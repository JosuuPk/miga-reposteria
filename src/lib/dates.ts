// Fechas del negocio. Todo se maneja como texto 'AAAA-MM-DD' (una fecha de calendario,
// sin hora), y "hoy" se calcula en la zona horaria del negocio. Así un visitante en
// otro huso horario ve las mismas reglas que el taller.

import type { DateRules } from '../data/rules';

const DAY_MS = 86_400_000;

/** Fecha de hoy en la zona horaria indicada, como 'AAAA-MM-DD'. */
export function todayInZone(timeZone: string, now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function toUtc(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

function fromUtc(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** true si el texto es una fecha de calendario real (rechaza 2026-02-30). */
export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && fromUtc(toUtc(value)) === value;
}

export function addDays(iso: string, days: number): string {
  return fromUtc(toUtc(iso) + days * DAY_MS);
}

/** Días de calendario desde "from" hasta "to" (negativo si "to" es anterior). */
export function diffDays(from: string, to: string): number {
  return Math.round((toUtc(to) - toUtc(from)) / DAY_MS);
}

/** Día de la semana: 0 = domingo ... 6 = sábado. */
export function weekday(iso: string): number {
  return new Date(toUtc(iso)).getUTCDay();
}

const weekdayNames = ['domingos', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábados'];

/** "sábado, 14 de noviembre de 2026" */
export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat('es-VE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(toUtc(iso)));
}

/** "sáb, 14 nov" */
export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat('es-VE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(toUtc(iso)));
}

export type DateIssue =
  | 'vacia'
  | 'formato'
  | 'pasada'
  | 'anticipacion'
  | 'cerrado'
  | 'bloqueada'
  | 'lejana';

export type DateCheck = { ok: true } | { ok: false; issue: DateIssue; message: string };

/**
 * Comprueba una fecha contra las reglas conocidas. Que sea válida NO garantiza
 * capacidad de producción: eso lo confirma el negocio.
 */
export function validateDate(iso: string, rules: DateRules, today: string): DateCheck {
  const fail = (issue: DateIssue, message: string): DateCheck => ({ ok: false, issue, message });

  if (!iso) return fail('vacia', 'Elige una fecha para continuar.');
  if (!isIsoDate(iso)) return fail('formato', 'Esa fecha no es válida. Elígela en el calendario.');

  const earliest = addDays(today, rules.minLeadDays);
  const latest = addDays(today, rules.maxAdvanceDays);

  if (diffDays(today, iso) < 0) {
    return fail('pasada', `Esa fecha ya pasó. Elige una a partir del ${formatLongDate(earliest)}.`);
  }
  if (diffDays(earliest, iso) < 0) {
    return fail(
      'anticipacion',
      `Necesitamos al menos ${rules.minLeadDays} días de anticipación. Elige una fecha a partir del ${formatLongDate(earliest)}.`,
    );
  }
  if (diffDays(iso, latest) < 0) {
    return fail(
      'lejana',
      `Recibimos solicitudes con hasta ${rules.maxAdvanceDays} días de anticipación. Elige una fecha hasta el ${formatLongDate(latest)}.`,
    );
  }
  if (rules.closedWeekdays.includes(weekday(iso))) {
    return fail(
      'cerrado',
      `Los ${weekdayNames[weekday(iso)]} no hay producción ni entregas. Elige otro día.`,
    );
  }
  if (rules.blockedDates.includes(iso)) {
    return fail('bloqueada', `El ${formatLongDate(iso)} no está disponible. Elige otra fecha.`);
  }
  return { ok: true };
}

/** Las próximas "count" fechas que cumplen las reglas. */
export function nextValidDates(rules: DateRules, today: string, count: number): string[] {
  const found: string[] = [];
  for (let i = rules.minLeadDays; i <= rules.maxAdvanceDays && found.length < count; i++) {
    const candidate = addDays(today, i);
    if (validateDate(candidate, rules, today).ok) found.push(candidate);
  }
  return found;
}

/** Texto con los días cerrados, p. ej. "domingos" o "domingos y lunes". */
export function closedDaysText(rules: DateRules): string {
  const names = rules.closedWeekdays.map((d) => weekdayNames[d]);
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`;
}
