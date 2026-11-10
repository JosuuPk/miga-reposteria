// Cálculo del estimado. ESTA es la única función que suma precios: la usan el
// resumen en pantalla y el mensaje de la solicitud, para que nunca difieran.

import type { Product } from '../data/catalog';
import { deliveryZones, pickup } from '../data/rules';
import { findOption, groupLabels, type CakeConfig } from './cakeConfig';
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

  if (config.deliveryMode === 'retiro') {
    lines.push({ key: 'entrega', label: pickup.label, cents: pickup.feeCents, kind: 'entrega' });
  } else if (config.deliveryMode === 'entrega') {
    const zone = deliveryZones.find((z) => z.id === config.zoneId);
    if (zone) {
      lines.push({
        key: 'entrega',
        label: `Entrega en ${zone.label}`,
        cents: zone.feeCents,
        kind: 'entrega',
      });
    }
  }

  let knownTotalCents = 0;
  const pending: string[] = [];
  for (const line of lines) {
    if (line.cents === null) pending.push(line.label);
    else knownTotalCents += line.cents;
  }

  return { lines, knownTotalCents, pending };
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
