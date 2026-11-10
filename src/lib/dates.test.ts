import { describe, expect, it } from 'vitest';
import type { DateRules } from '../data/rules';
import {
  addDays,
  diffDays,
  isIsoDate,
  nextValidDates,
  todayInZone,
  validateDate,
  weekday,
} from './dates';

const rules: DateRules = {
  minLeadDays: 3,
  closedWeekdays: [0],
  blockedDates: ['2026-12-24'],
  maxAdvanceDays: 90,
};

// Martes 10 de noviembre de 2026.
const today = '2026-11-10';

function issueOf(iso: string) {
  const result = validateDate(iso, rules, today);
  return result.ok ? 'ok' : result.issue;
}

describe('todayInZone', () => {
  it('usa la fecha de Caracas aunque en UTC ya sea el día siguiente', () => {
    // 02:30 UTC del día 11 son las 22:30 del día 10 en Caracas (UTC-4).
    expect(todayInZone('America/Caracas', new Date('2026-11-11T02:30:00Z'))).toBe('2026-11-10');
  });

  it('cambia de día a la medianoche de Caracas', () => {
    expect(todayInZone('America/Caracas', new Date('2026-11-11T04:00:00Z'))).toBe('2026-11-11');
  });
});

describe('utilidades de fecha', () => {
  it('suma días cruzando mes y año', () => {
    expect(addDays('2026-11-29', 3)).toBe('2026-12-02');
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
  });

  it('calcula diferencias y días de la semana', () => {
    expect(diffDays('2026-11-10', '2026-11-13')).toBe(3);
    expect(diffDays('2026-11-13', '2026-11-10')).toBe(-3);
    expect(weekday('2026-11-10')).toBe(2);
    expect(weekday('2026-11-15')).toBe(0);
  });

  it('rechaza fechas que no existen', () => {
    expect(isIsoDate('2026-02-30')).toBe(false);
    expect(isIsoDate('10/11/2026')).toBe(false);
    expect(isIsoDate('2026-11-13')).toBe(true);
  });
});

describe('validateDate', () => {
  it('pide una fecha si está vacía', () => {
    expect(issueOf('')).toBe('vacia');
  });

  it('rechaza un formato o una fecha imposibles', () => {
    expect(issueOf('2026-02-30')).toBe('formato');
  });

  it('rechaza fechas pasadas', () => {
    expect(issueOf('2026-11-09')).toBe('pasada');
  });

  it('rechaza hoy y los días sin anticipación suficiente', () => {
    expect(issueOf('2026-11-10')).toBe('anticipacion');
    expect(issueOf('2026-11-12')).toBe('anticipacion');
  });

  it('acepta la primera fecha con anticipación suficiente', () => {
    expect(issueOf('2026-11-13')).toBe('ok');
  });

  it('rechaza los días no laborables', () => {
    expect(issueOf('2026-11-15')).toBe('cerrado');
  });

  it('rechaza fechas bloqueadas', () => {
    expect(issueOf('2026-12-24')).toBe('bloqueada');
  });

  it('rechaza fechas demasiado lejanas', () => {
    expect(issueOf('2026-02-08')).toBe('pasada');
    expect(issueOf('2027-02-08')).toBe('ok');
    expect(issueOf('2027-02-09')).toBe('lejana');
  });

  it('explica el problema con la fecha mínima', () => {
    const result = validateDate('2026-11-11', rules, today);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain('3 días');
      expect(result.message).toContain('13 de noviembre');
    }
  });
});

describe('nextValidDates', () => {
  it('salta los domingos', () => {
    expect(nextValidDates(rules, today, 3)).toEqual(['2026-11-13', '2026-11-14', '2026-11-16']);
  });
});
