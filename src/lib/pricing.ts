// Cálculo del estimado. ESTE es el único módulo que suma precios: lo usan el
// resumen en pantalla y el mensaje de la solicitud, para que nunca difieran.

import type { Product } from '../data/catalog';
import { deliveryZones, pickup } from '../data/rules';
import { findOption, groupLabels, type CakeConfig, type DeliveryMode } from './cakeConfig';
import { formatUsd } from './money';

export type EstimateLine = {
  key: string;
  /** Concepto, p. ej. "Relleno: Frambuesa". */
  label: string;
  /** Importe en centavos, o null si requiere cotización. */
  cents: number | null;
  kind: 'base' | 'adicional' | 'entrega';
};

export type Estimate = {
  lines: EstimateLine[];
  /** Suma de todo lo que tiene precio conocido. */
  knownTotalCents: number;
  /** Conceptos sin precio: los define el negocio. Nunca cuentan como $0. */
  pending: string[];
};

function deliveryLine(mode: DeliveryMode | null, zoneId: string | null): EstimateLine | null {
  if (mode === 'retiro') {
    return { key: 'entrega', label: pickup.label, cents: pickup.feeCents, kind: 'entrega' };
  }
  if (mode === 'entrega') {
    const zone = deliveryZones.find((z) => z.id === zoneId);
    if (zone) {
      return { key: 'entrega', label: `Entrega en ${zone.label}`, cents: zone.feeCents, kind: 'entrega' };
    }
  }
  return null;
}

function summarize(lines: EstimateLine[]): Estimate {
  let knownTotalCents = 0;
  const pending: string[] = [];
  for (const line of lines) {
    if (line.cents === null) pending.push(line.label);
    else knownTotalCents += line.cents;
  }
  return { lines, knownTotalCents, pending };
}

/** Estimado de una torta armada en el configurador. */
export function computeEstimate(product: Product, config: CakeConfig): Estimate {
  const lines: EstimateLine[] = [
    {
      key: 'base',
      label: `${product.name} (${product.unitLabel})`,
      cents: product.basePriceCents,
      kind: 'base',
    },
  ];

  const single = [
    ['size', config.sizeId],
    ['flavor', config.flavorId],
    ['filling', config.fillingId],
    ['covering', config.coveringId],
  ] as const;

  for (const [group, id] of single) {
    const option = findOption(id);
    // Lo incluido en el precio base (0) no genera línea; lo cotizable (null) sí.
    if (!option || option.priceCents === 0) continue;
    lines.push({
      key: option.id,
      label: `${groupLabels[group]}: ${option.label}`,
      cents: option.priceCents,
      kind: 'adicional',
    });
  }

  for (const id of config.extraIds) {
    const option = findOption(id);
    if (!option) continue;
    lines.push({
      key: option.id,
      label: `Extra: ${option.label}`,
      cents: option.priceCents,
      kind: 'adicional',
    });
  }

  const delivery = deliveryLine(config.deliveryMode, config.zoneId);
  if (delivery) lines.push(delivery);

  return summarize(lines);
}

/** Solicitud de un producto sin configurador (postres y bocados). */
export type SimpleRequest = {
  productId: string;
  quantity: number;
  /** Fecha deseada, 'AAAA-MM-DD' o ''. */
  date: string;
  deliveryMode: DeliveryMode | null;
  zoneId: string | null;
  notes: string;
};

export const maxQuantity = 10;

export function createSimpleRequest(product: Product): SimpleRequest {
  return {
    productId: product.id,
    quantity: 1,
    date: '',
    deliveryMode: null,
    zoneId: null,
    notes: '',
  };
}

/** Deja la cantidad en un entero entre 1 y el máximo. */
export function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(maxQuantity, Math.max(1, Math.trunc(value)));
}

/** Estimado de un producto sin configurador: precio por cantidad más entrega. */
export function computeSimpleEstimate(product: Product, request: SimpleRequest): Estimate {
  const quantity = clampQuantity(request.quantity);
  const lines: EstimateLine[] = [
    {
      key: 'base',
      label: `${product.name} (${product.unitLabel}) × ${quantity}`,
      cents: product.basePriceCents * quantity,
      kind: 'base',
    },
  ];

  // Los productos con precio "desde" tienen variantes que define el negocio.
  if (product.priceIsStartingAt) {
    lines.push({
      key: 'personalizacion',
      label: 'Personalización (sabores, tamaño de caja o diseño)',
      cents: null,
      kind: 'adicional',
    });
  }

  const delivery = deliveryLine(request.deliveryMode, request.zoneId);
  if (delivery) lines.push(delivery);

  return summarize(lines);
}

/** Texto del importe de una línea. */
export function formatLineAmount(line: EstimateLine): string {
  if (line.cents === null) {
    return line.kind === 'entrega' ? 'Entrega por cotizar' : 'Requiere cotización';
  }
  if (line.cents === 0 && line.kind === 'entrega') return 'Sin costo';
  return formatUsd(line.cents);
}

/** Texto del total: "$45" o "$45 + por cotizar". */
export function formatTotal(estimate: Estimate): string {
  const known = formatUsd(estimate.knownTotalCents);
  return estimate.pending.length > 0 ? `${known} + por cotizar` : known;
}
