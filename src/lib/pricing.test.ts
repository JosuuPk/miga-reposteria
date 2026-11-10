import { describe, expect, it } from 'vitest';
import { findProduct } from '../data/catalog';
import { createConfig, toggleExtra, type CakeConfig } from './cakeConfig';
import { formatSurcharge, formatUsd } from './money';
import { computeEstimate, formatLineAmount, formatTotal } from './pricing';

const product = findProduct('torta-a-medida')!; // base: $28

function config(overrides: Partial<CakeConfig> = {}): CakeConfig {
  return {
    ...createConfig(product),
    flavorId: 'vainilla',
    fillingId: 'dulce-de-leche',
    coveringId: 'merengue-suizo',
    ...overrides,
  };
}

describe('formato de importes', () => {
  it('muestra centavos enteros sin errores de redondeo', () => {
    expect(formatUsd(2800)).toBe('$28');
    expect(formatUsd(2850)).toBe('$28,50');
    expect(formatUsd(5)).toBe('$0,05');
    expect(formatUsd(0)).toBe('$0');
  });

  it('rechaza importes que no son centavos enteros', () => {
    expect(() => formatUsd(28.5)).toThrow();
  });

  it('distingue incluido, adicional y cotización', () => {
    expect(formatSurcharge(0)).toBe('Incluido');
    expect(formatSurcharge(300)).toBe('+$3');
    expect(formatSurcharge(null)).toBe('Requiere cotización');
  });
});

describe('computeEstimate', () => {
  it('con todo incluido, el total es el precio base', () => {
    const estimate = computeEstimate(product, config({ sizeId: 'p8' }));
    expect(estimate.knownTotalCents).toBe(2800);
    expect(estimate.lines).toHaveLength(1);
    expect(estimate.pending).toEqual([]);
  });

  it('suma base, adicionales, extras y entrega', () => {
    const estimate = computeEstimate(
      product,
      config({
        sizeId: 'p12', // +10
        fillingId: 'frambuesa', // +3
        coveringId: 'crema-mantequilla', // +3
        extraIds: ['frambuesas', 'velas'], // +4 +1
        deliveryMode: 'entrega',
        zoneId: 'chacao', // +4
      }),
    );
    expect(estimate.knownTotalCents).toBe(2800 + 1000 + 300 + 300 + 400 + 100 + 400);
    expect(formatTotal(estimate)).toBe('$53');
    expect(estimate.lines.map((l) => l.kind)).toEqual([
      'base',
      'adicional',
      'adicional',
      'adicional',
      'adicional',
      'adicional',
      'entrega',
    ]);
  });

  it('al quitar un extra el total baja exactamente su precio', () => {
    const withExtra = config({ sizeId: 'p8', extraIds: ['flores'] });
    const without = toggleExtra(withExtra, 'flores');
    expect(computeEstimate(product, withExtra).knownTotalCents).toBe(3300);
    expect(computeEstimate(product, without).knownTotalCents).toBe(2800);
  });

  it('un diseño que requiere cotización no suma ni cuenta como gratis', () => {
    const estimate = computeEstimate(product, config({ sizeId: 'p8', coveringId: 'diseno-especial' }));
    expect(estimate.knownTotalCents).toBe(2800);
    expect(estimate.pending).toEqual(['Cobertura: Diseño especial']);
    expect(formatTotal(estimate)).toBe('$28 + por cotizar');
    const line = estimate.lines.find((l) => l.key === 'diseno-especial')!;
    expect(formatLineAmount(line)).toBe('Requiere cotización');
  });

  it('el retiro aparece sin costo', () => {
    const estimate = computeEstimate(product, config({ sizeId: 'p8', deliveryMode: 'retiro' }));
    const line = estimate.lines.find((l) => l.kind === 'entrega')!;
    expect(line.cents).toBe(0);
    expect(formatLineAmount(line)).toBe('Sin costo');
    expect(estimate.knownTotalCents).toBe(2800);
  });

  it('una zona sin tarifa queda como entrega por cotizar', () => {
    const estimate = computeEstimate(
      product,
      config({ sizeId: 'p8', deliveryMode: 'entrega', zoneId: 'otra' }),
    );
    const line = estimate.lines.find((l) => l.kind === 'entrega')!;
    expect(formatLineAmount(line)).toBe('Entrega por cotizar');
    expect(estimate.pending).toHaveLength(1);
    expect(formatTotal(estimate)).toBe('$28 + por cotizar');
  });

  it('sin modalidad elegida no hay línea de entrega', () => {
    const estimate = computeEstimate(product, config({ sizeId: 'p8' }));
    expect(estimate.lines.some((l) => l.kind === 'entrega')).toBe(false);
  });

  it('usa el precio base de cada torta', () => {
    const other = findProduct('torta-chocolate-parchita')!;
    const estimate = computeEstimate(other, { ...createConfig(other), sizeId: 'p8' });
    // 32 base + chocolate 2 + parchita 3 + ganache oscuro 4
    expect(estimate.knownTotalCents).toBe(3200 + 200 + 300 + 400);
  });
});
