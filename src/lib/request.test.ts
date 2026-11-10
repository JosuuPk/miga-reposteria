import { describe, expect, it } from 'vitest';
import { findProduct } from '../data/catalog';
import { CONFIG_VERSION, createConfig, restoreConfig, type CakeConfig } from './cakeConfig';
import {
  clampQuantity,
  computeEstimate,
  computeSimpleEstimate,
  createSimpleRequest,
  formatTotal,
} from './pricing';
import {
  buildCakeMessage,
  buildSimpleMessage,
  buildWhatsAppUrl,
  normalizeWhatsAppNumber,
} from './request';

const cake = findProduct('torta-a-medida')!;
const quesillo = findProduct('quesillo')!;
const cupcakes = findProduct('cupcakes')!;

const full: CakeConfig = {
  ...createConfig(cake),
  sizeId: 'p12',
  flavorId: 'vainilla',
  fillingId: 'frambuesa',
  coveringId: 'crema-mantequilla',
  extraIds: ['frambuesas', 'velas'],
  message: '¡Feliz cumpleaños, José!',
  date: '2026-11-14',
  deliveryMode: 'entrega',
  zoneId: 'chacao',
  notes: 'Sin nueces, por favor.\nColores: rosa & dorado — ¿se puede? 100%',
};

describe('mensaje de la torta', () => {
  const message = buildCakeMessage(cake, full);

  it('incluye el producto y todas las opciones elegidas', () => {
    for (const part of [
      'Torta a tu medida',
      '12 porciones',
      'Vainilla',
      'Frambuesa',
      'Crema de mantequilla',
      'Frambuesas frescas, Velas doradas (10)',
      '"¡Feliz cumpleaños, José!"',
      'sábado, 14 de noviembre de 2026',
      'Entrega a domicilio, zona Chacao',
    ]) {
      expect(message).toContain(part);
    }
  });

  it('usa el mismo total que el resumen en pantalla', () => {
    const estimate = computeEstimate(cake, full);
    expect(message).toContain(`*Total estimado:* ${formatTotal(estimate)}`);
    expect(message).toContain('*Total estimado:* $53');
    for (const line of estimate.lines) expect(message).toContain(line.label);
  });

  it('conserva los saltos de línea y símbolos de las observaciones', () => {
    expect(message).toContain('Sin nueces, por favor.\nColores: rosa & dorado — ¿se puede? 100%');
  });

  it('aclara que requiere confirmación', () => {
    expect(message).toMatch(/requiere confirmación del negocio/);
    expect(message).not.toMatch(/reservad|pagad|confirmado tu pedido/i);
  });

  it('marca lo que está por cotizar sin sumarlo', () => {
    const quoted = buildCakeMessage(cake, { ...full, coveringId: 'diseno-especial', zoneId: 'otra' });
    expect(quoted).toContain('Cobertura: Diseño especial: Requiere cotización');
    expect(quoted).toContain('Entrega en Otra zona: Entrega por cotizar');
    expect(quoted).toContain('+ por cotizar');
  });

  it('indica cuando no hay texto, extras ni observaciones', () => {
    const plain = buildCakeMessage(cake, { ...full, message: '  ', extraIds: [], notes: '' });
    expect(plain).toContain('*Texto sobre la torta:* Sin texto');
    expect(plain).toContain('*Extras:* Ninguno');
    expect(plain).toContain('*Observaciones:*\nNinguna');
  });
});

describe('solicitud simple', () => {
  it('multiplica el precio por la cantidad', () => {
    const request = { ...createSimpleRequest(quesillo), quantity: 3, deliveryMode: 'retiro' as const };
    const estimate = computeSimpleEstimate(quesillo, request);
    expect(estimate.knownTotalCents).toBe(1800 * 3);
    expect(estimate.pending).toEqual([]);
    expect(buildSimpleMessage(quesillo, request)).toContain('*Cantidad:* 3 × molde de 8 porciones');
  });

  it('los productos con precio "desde" dejan la personalización por cotizar', () => {
    const estimate = computeSimpleEstimate(cupcakes, createSimpleRequest(cupcakes));
    expect(estimate.knownTotalCents).toBe(1500);
    expect(estimate.pending).toHaveLength(1);
    expect(formatTotal(estimate)).toBe('$15 + por cotizar');
  });

  it('limita la cantidad a un rango válido', () => {
    expect(clampQuantity(0)).toBe(1);
    expect(clampQuantity(99)).toBe(10);
    expect(clampQuantity(2.9)).toBe(2);
    expect(clampQuantity(Number.NaN)).toBe(1);
  });
});

describe('enlace de WhatsApp', () => {
  it('sin número configurado no genera enlace (modo demostración)', () => {
    expect(buildWhatsAppUrl(null, 'hola')).toBeNull();
    expect(buildWhatsAppUrl('', 'hola')).toBeNull();
    expect(buildWhatsAppUrl('123', 'hola')).toBeNull();
  });

  it('limpia el número y rechaza los que no son válidos', () => {
    expect(normalizeWhatsAppNumber('+58 412-123 4567')).toBe('584121234567');
    expect(normalizeWhatsAppNumber('abc')).toBeNull();
  });

  it('codifica espacios, saltos de línea, acentos y símbolos sin perder nada', () => {
    const message = buildCakeMessage(cake, full);
    const url = buildWhatsAppUrl('+58 412 1234567', message)!;
    expect(url.startsWith('https://wa.me/584121234567?text=')).toBe(true);

    const encoded = url.split('?text=')[1];
    expect(encoded).not.toMatch(/[\s&#+]/);
    expect(encoded).toContain('%0A');
    expect(decodeURIComponent(encoded)).toBe(message);
    expect(new URL(url).searchParams.get('text')).toBe(message);
  });
});

describe('borrador restaurado', () => {
  it('recupera una configuración válida', () => {
    expect(restoreConfig(JSON.parse(JSON.stringify(full)), cake)).toEqual(full);
  });

  it('descarta borradores de otra versión o de otro producto', () => {
    expect(restoreConfig({ ...full, version: CONFIG_VERSION + 1 }, cake)).toBeNull();
    expect(restoreConfig({ ...full, productId: 'torta-zanahoria' }, cake)).toBeNull();
    expect(restoreConfig(null, cake)).toBeNull();
    expect(restoreConfig('texto', cake)).toBeNull();
  });

  it('descarta ids desconocidos, combinaciones incompatibles y datos mal formados', () => {
    const restored = restoreConfig(
      {
        ...full,
        sizeId: 'p30',
        flavorId: 'no-existe',
        coveringId: 'merengue-suizo', // no se combina con 30 porciones
        extraIds: ['velas', 'velas', 'inventado', 42],
        message: 'x'.repeat(500),
        date: '2026-02-30',
        deliveryMode: 'entrega',
        zoneId: 'zona-borrada',
      },
      cake,
    )!;
    expect(restored.sizeId).toBe('p30');
    expect(restored.flavorId).toBeNull();
    expect(restored.coveringId).toBeNull();
    expect(restored.extraIds).toEqual(['velas']);
    expect(restored.message).toHaveLength(40);
    expect(restored.date).toBe('');
    expect(restored.deliveryMode).toBe('entrega');
    expect(restored.zoneId).toBeNull();
  });
});
