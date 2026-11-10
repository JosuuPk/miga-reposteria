import { describe, expect, it } from 'vitest';
import { messageMaxLength } from '../data/cakeOptions';
import { findProduct, products } from '../data/catalog';
import { dateRules } from '../data/rules';
import {
  blockedBy,
  choose,
  conflict,
  createConfig,
  firstIncompleteStep,
  setMessage,
  stepIssue,
  toggleExtra,
  type CakeConfig,
} from './cakeConfig';

const product = findProduct('torta-a-medida')!;
const today = '2026-11-10';

function base(overrides: Partial<CakeConfig> = {}): CakeConfig {
  return { ...createConfig(product), ...overrides };
}

describe('compatibilidades', () => {
  it('detecta el conflicto en los dos sentidos', () => {
    expect(conflict('merengue-suizo', 'p30')).toBe(true);
    expect(conflict('p30', 'merengue-suizo')).toBe(true);
    expect(conflict('parchita', 'c-queso-crema')).toBe(true);
    expect(conflict('vainilla', 'frambuesa')).toBe(false);
  });

  it('bloquea una cobertura incompatible con el tamaño ya elegido', () => {
    const config = base({ sizeId: 'p30', coveringId: null });
    expect(blockedBy(config, 'covering', 'merengue-suizo').map((o) => o.id)).toEqual(['p30']);
    expect(blockedBy(config, 'covering', 'crema-mantequilla')).toEqual([]);
  });

  it('no deja elegir una opción bloqueada', () => {
    const config = base({ sizeId: 'p30', coveringId: null });
    const result = choose(config, 'covering', 'semidesnuda');
    expect(result.config.coveringId).toBeNull();
  });

  it('al cambiar el tamaño quita la cobertura que deja de ser compatible y lo informa', () => {
    const config = base({ sizeId: 'p12', coveringId: 'merengue-suizo' });
    const result = choose(config, 'size', 'p30');
    expect(result.config.sizeId).toBe('p30');
    expect(result.config.coveringId).toBeNull();
    expect(result.removed).toHaveLength(1);
    expect(result.removed[0].option.id).toBe('merengue-suizo');
    expect(result.removed[0].because.id).toBe('p30');
  });

  it('al cambiar el relleno quita la cobertura incompatible', () => {
    const config = base({ sizeId: 'p8', fillingId: 'frambuesa', coveringId: 'c-queso-crema' });
    const result = choose(config, 'filling', 'parchita');
    expect(result.config.fillingId).toBe('parchita');
    expect(result.config.coveringId).toBeNull();
  });

  it('conserva lo demás cuando no hay conflicto', () => {
    const config = base({ sizeId: 'p8', coveringId: 'merengue-suizo', extraIds: ['velas'] });
    const result = choose(config, 'size', 'p20');
    expect(result.removed).toEqual([]);
    expect(result.config.coveringId).toBe('merengue-suizo');
    expect(result.config.extraIds).toEqual(['velas']);
  });

  it('las combinaciones de la casa de todas las tortas son válidas', () => {
    for (const p of products.filter((x) => x.cakePreset)) {
      const preset = p.cakePreset!;
      expect(conflict(preset.flavorId, preset.fillingId), p.id).toBe(false);
      expect(conflict(preset.flavorId, preset.coveringId), p.id).toBe(false);
      expect(conflict(preset.fillingId, preset.coveringId), p.id).toBe(false);
    }
  });
});

describe('extras y textos', () => {
  it('añade y quita extras sin duplicarlos', () => {
    let config = base();
    config = toggleExtra(config, 'velas');
    config = toggleExtra(config, 'flores');
    expect(config.extraIds).toEqual(['velas', 'flores']);
    config = toggleExtra(config, 'velas');
    expect(config.extraIds).toEqual(['flores']);
  });

  it('ignora extras que no existen', () => {
    expect(toggleExtra(base(), 'no-existe').extraIds).toEqual([]);
  });

  it('recorta el mensaje al límite de caracteres', () => {
    const long = 'x'.repeat(messageMaxLength + 20);
    expect(setMessage(base(), long).message).toHaveLength(messageMaxLength);
  });
});

describe('pasos', () => {
  it('pide el tamaño al empezar', () => {
    expect(stepIssue(base(), 'size', dateRules, today)).toMatch(/tamaño/);
    expect(firstIncompleteStep(base(), dateRules, today)).toBe('size');
  });

  it('pide la zona cuando se elige entrega', () => {
    const config = base({ deliveryMode: 'entrega' });
    expect(stepIssue(config, 'delivery', dateRules, today)).toMatch(/zona/);
    expect(stepIssue({ ...config, zoneId: 'chacao' }, 'delivery', dateRules, today)).toBeNull();
    expect(stepIssue(base({ deliveryMode: 'retiro' }), 'delivery', dateRules, today)).toBeNull();
  });

  it('llega a la revisión cuando todo está completo', () => {
    const config = base({ sizeId: 'p12', date: '2026-11-13', deliveryMode: 'retiro' });
    expect(firstIncompleteStep(config, dateRules, today)).toBe('review');
    expect(stepIssue(config, 'review', dateRules, today)).toBeNull();
  });

  it('la revisión señala el paso que falta', () => {
    const config = base({ sizeId: 'p12', deliveryMode: 'retiro' });
    expect(stepIssue(config, 'review', dateRules, today)).toContain('Fecha');
  });
});
