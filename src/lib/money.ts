/**
 * Convierte centavos enteros a texto en USD, sin pasar por decimales flotantes.
 * 2800 -> "$28"   2850 -> "$28,50"
 */
/**
 * Texto para un adicional sobre el precio base.
 * 0 -> "Incluido"   300 -> "+$3"   null -> "Requiere cotización"
 */
export function formatSurcharge(cents: number | null): string {
  if (cents === null) return 'Requiere cotización';
  if (cents === 0) return 'Incluido';
  return `+${formatUsd(cents)}`;
}

export function formatUsd(cents: number): string {
  if (!Number.isInteger(cents)) {
    throw new Error(`El importe debe estar en centavos enteros: ${cents}`);
  }
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const dollars = Math.trunc(abs / 100);
  const rest = abs % 100;
  return rest === 0
    ? `${sign}$${dollars}`
    : `${sign}$${dollars},${String(rest).padStart(2, '0')}`;
}
