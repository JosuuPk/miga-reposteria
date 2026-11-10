import { useMemo } from 'react';
import { dateRules, deliveryZones, pickup } from '../../data/rules';
import type { DeliveryMode } from '../../lib/cakeConfig';
import {
  addDays,
  closedDaysText,
  formatLongDate,
  formatShortDate,
  nextValidDates,
  validateDate,
} from '../../lib/dates';
import { formatUsd } from '../../lib/money';

/** Campo de fecha con validación inmediata y fechas sugeridas. */
export function DateField({
  date,
  today,
  onChange,
}: {
  date: string;
  today: string;
  onChange: (date: string) => void;
}) {
  const suggestions = useMemo(() => nextValidDates(dateRules, today, 6), [today]);
  const check = date ? validateDate(date, dateRules, today) : null;

  return (
    <>
      <div className="campo">
        <label htmlFor="fecha">Fecha deseada</label>
        <input
          id="fecha"
          type="date"
          value={date}
          min={addDays(today, dateRules.minLeadDays)}
          max={addDays(today, dateRules.maxAdvanceDays)}
          aria-describedby="fecha-reglas fecha-estado"
          onChange={(e) => onChange(e.target.value)}
        />
        <p
          id="fecha-estado"
          className={check && !check.ok ? 'campo__nota campo__nota--error' : 'campo__nota campo__nota--ok'}
          aria-live="polite"
        >
          {check
            ? check.ok
              ? `${formatLongDate(date)}: cumple las reglas conocidas.`
              : check.message
            : ''}
        </p>
      </div>

      <div className="sugerencias">
        <p>Próximas fechas que cumplen las reglas</p>
        <ul>
          {suggestions.map((d) => (
            <li key={d}>
              <button type="button" aria-pressed={date === d} onClick={() => onChange(d)}>
                {formatShortDate(d)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p id="fecha-reglas" className="campo__nota">
        Mínimo {dateRules.minLeadDays} días de anticipación. Sin producción ni entregas los{' '}
        {closedDaysText(dateRules)}. Las fechas usan la hora de Caracas. Que una fecha cumpla las
        reglas no garantiza cupo: la disponibilidad la confirma el negocio.
      </p>
    </>
  );
}

/** Retiro o entrega, con la zona cuando hace falta. No pide dirección. */
export function DeliveryField({
  mode,
  zoneId,
  onChange,
}: {
  mode: DeliveryMode | null;
  zoneId: string | null;
  onChange: (patch: { deliveryMode: DeliveryMode; zoneId?: string | null }) => void;
}) {
  return (
    <>
      <fieldset className="opciones-lista">
        <legend className="solo-lectores">Modalidad</legend>
        <label className="opcion">
          <input
            type="radio"
            name="modalidad"
            checked={mode === 'retiro'}
            onChange={() => onChange({ deliveryMode: 'retiro', zoneId: null })}
          />
          <span className="opcion__texto">
            <b>{pickup.label}</b>
            <small>{pickup.areaLabel}</small>
          </span>
          <span className="opcion__precio">Sin costo</span>
        </label>
        <label className="opcion">
          <input
            type="radio"
            name="modalidad"
            checked={mode === 'entrega'}
            onChange={() => onChange({ deliveryMode: 'entrega' })}
          />
          <span className="opcion__texto">
            <b>Entrega a domicilio</b>
            <small>La tarifa depende de la zona</small>
          </span>
          <span className="opcion__precio">Según zona</span>
        </label>
      </fieldset>

      {mode === 'entrega' && (
        <>
          <h3 className="subtitulo">Zona de entrega</h3>
          <fieldset className="opciones-lista opciones-lista--compacta">
            <legend className="solo-lectores">Zona de entrega</legend>
            {deliveryZones.map((zone) => (
              <label key={zone.id} className="opcion">
                <input
                  type="radio"
                  name="zona"
                  checked={zoneId === zone.id}
                  onChange={() => onChange({ deliveryMode: 'entrega', zoneId: zone.id })}
                />
                <span className="opcion__texto">
                  <b>{zone.label}</b>
                </span>
                <span
                  className={
                    zone.feeCents === null ? 'opcion__precio opcion__precio--cotizar' : 'opcion__precio'
                  }
                >
                  {zone.feeCents === null ? 'Entrega por cotizar' : `+${formatUsd(zone.feeCents)}`}
                </span>
              </label>
            ))}
          </fieldset>
          <p className="campo__nota">
            No pedimos tu dirección aquí: la coordinas con el negocio por WhatsApp.
          </p>
        </>
      )}
    </>
  );
}
