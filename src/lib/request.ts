// Texto de la solicitud y enlace de WhatsApp. El desglose sale de pricing.ts,
// el mismo cálculo que se ve en pantalla.

import { brand } from '../data/brand';
import { sizes } from '../data/cakeOptions';
import type { Product } from '../data/catalog';
import { deliveryZones, pickup } from '../data/rules';
import { findOption, type CakeConfig, type DeliveryMode } from './cakeConfig';
import { formatLongDate, isIsoDate } from './dates';
import {
  clampQuantity,
  computeEstimate,
  computeSimpleEstimate,
  formatLineAmount,
  formatTotal,
  type Estimate,
  type SimpleRequest,
} from './pricing';

function deliveryText(mode: DeliveryMode | null, zoneId: string | null): string {
  if (mode === 'retiro') return `${pickup.label}, ${pickup.areaLabel}`;
  if (mode === 'entrega') {
    const zone = deliveryZones.find((z) => z.id === zoneId);
    return zone ? `Entrega a domicilio, zona ${zone.label}` : 'Entrega a domicilio, zona sin elegir';
  }
  return 'Sin elegir';
}

function dateText(date: string): string {
  return isIsoDate(date) ? formatLongDate(date) : 'Sin elegir';
}

function estimateBlock(estimate: Estimate): string[] {
  const lines = ['*Estimado (USD)*'];
  for (const line of estimate.lines) {
    lines.push(`- ${line.label}: ${formatLineAmount(line)}`);
  }
  lines.push(`*Total estimado:* ${formatTotal(estimate)}`);
  if (estimate.pending.length > 0) {
    lines.push('Lo que está por cotizar no está incluido en el total.');
  }
  return lines;
}

function closing(notes: string): string[] {
  const clean = notes.trim();
  return [
    '',
    '*Observaciones:*',
    clean || 'Ninguna',
    '',
    'Entiendo que esta solicitud requiere confirmación del negocio: la fecha, el diseño y el precio final no están confirmados.',
  ];
}

/** Mensaje completo de una torta armada en el configurador. */
export function buildCakeMessage(product: Product, config: CakeConfig): string {
  const size = sizes.find((s) => s.id === config.sizeId);
  const extras = config.extraIds
    .map((id) => findOption(id)?.label)
    .filter((label): label is string => Boolean(label));
  const message = config.message.trim();

  return [
    `Hola, ${brand.name}. Quiero solicitar una torta:`,
    '',
    `*Producto:* ${product.name}`,
    `*Porciones:* ${size?.label ?? 'Sin elegir'}`,
    `*Bizcocho:* ${findOption(config.flavorId)?.label ?? 'Sin elegir'}`,
    `*Relleno:* ${findOption(config.fillingId)?.label ?? 'Sin elegir'}`,
    `*Cobertura:* ${findOption(config.coveringId)?.label ?? 'Sin elegir'}`,
    `*Extras:* ${extras.length > 0 ? extras.join(', ') : 'Ninguno'}`,
    `*Texto sobre la torta:* ${message ? `"${message}"` : 'Sin texto'}`,
    `*Fecha solicitada:* ${dateText(config.date)}`,
    `*Entrega:* ${deliveryText(config.deliveryMode, config.zoneId)}`,
    '',
    ...estimateBlock(computeEstimate(product, config)),
    ...closing(config.notes),
  ].join('\n');
}

/** Mensaje completo de un producto sin configurador. */
export function buildSimpleMessage(product: Product, request: SimpleRequest): string {
  return [
    `Hola, ${brand.name}. Quiero solicitar:`,
    '',
    `*Producto:* ${product.name}`,
    `*Cantidad:* ${clampQuantity(request.quantity)} × ${product.unitLabel}`,
    `*Fecha solicitada:* ${dateText(request.date)}`,
    `*Entrega:* ${deliveryText(request.deliveryMode, request.zoneId)}`,
    '',
    ...estimateBlock(computeSimpleEstimate(product, request)),
    ...closing(request.notes),
  ].join('\n');
}

/**
 * Deja el número solo con dígitos y comprueba que tenga un largo internacional
 * razonable. Devuelve null si no hay número o no es válido.
 */
export function normalizeWhatsAppNumber(number: string | null | undefined): string | null {
  if (!number) return null;
  const digits = number.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

/**
 * Enlace que abre WhatsApp con el mensaje escrito. El visitante todavía debe
 * pulsar "Enviar". Devuelve null si no hay un número válido (modo demostración).
 */
export function buildWhatsAppUrl(number: string | null | undefined, message: string): string | null {
  const digits = normalizeWhatsAppNumber(number);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
