import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Summary } from '../components/configurator/Summary';
import { brand } from '../data/brand';
import { messageMaxLength, notesMaxLength, sizes } from '../data/cakeOptions';
import { findProduct, type Product } from '../data/catalog';
import { dateRules, deliveryZones, pickup } from '../data/rules';
import {
  blockedBy,
  choose,
  createConfig,
  findOption,
  groupLabels,
  groupOptions,
  setMessage,
  setNotes,
  stepIssue,
  steps,
  toggleExtra,
  type CakeConfig,
  type Group,
  type Removal,
  type StepId,
} from '../lib/cakeConfig';
import {
  addDays,
  closedDaysText,
  formatLongDate,
  formatShortDate,
  nextValidDates,
  todayInZone,
  validateDate,
} from '../lib/dates';
import { formatSurcharge, formatUsd } from '../lib/money';
import { usePageTitle } from '../lib/usePageTitle';
import { NotFoundPage } from './NotFoundPage';
import './pages.css';
import './ProductPage.css';
import './ConfiguratorPage.css';

export function ConfiguratorPage() {
  const { id } = useParams();
  const product = findProduct(id);
  if (!product || !product.cakePreset) {
    return <NotFoundPage message="Ese producto no se arma con el configurador." />;
  }
  return <Configurator key={product.id} product={product} />;
}

const hints: Record<StepId, string> = {
  size: 'El precio base cubre 8 porciones. Los tamaños mayores suman al estimado.',
  flavor: 'Es el sabor de las tres capas de bizcocho.',
  filling: 'Va entre las capas de bizcocho.',
  covering: 'Lo que cubre la torta por fuera.',
  extras: 'Opcionales. Puedes elegir varios o ninguno.',
  message: `Opcional. Lo escribimos sobre la torta, hasta ${messageMaxLength} caracteres.`,
  date: 'El día en que quieres recibir o retirar la torta.',
  delivery: 'Retírala en el taller o te la llevamos.',
  review: 'Revisa tu solicitud antes de enviarla.',
};

function Configurator({ product }: { product: Product }) {
  usePageTitle(`Armar: ${product.name}`);
  const [config, setConfig] = useState<CakeConfig>(() => createConfig(product));
  const [stepIndex, setStepIndex] = useState(0);
  const [visited, setVisited] = useState<Set<StepId>>(() => new Set(['size']));
  const [error, setError] = useState<string | null>(null);
  const [removals, setRemovals] = useState<Removal[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const today = useMemo(() => todayInZone(brand.timeZone), []);
  const step = steps[stepIndex];

  // Al cambiar de paso, el foco va al título para lectores de pantalla y teclado.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [stepIndex]);

  function goTo(index: number) {
    setError(null);
    setStepIndex(index);
    setVisited((prev) => new Set(prev).add(steps[index].id));
  }

  function next() {
    const issue = stepIssue(config, step.id, dateRules, today);
    if (issue) {
      setError(issue);
      return;
    }
    goTo(stepIndex + 1);
  }

  function pick(group: Exclude<Group, 'extras'>, optionId: string) {
    const result = choose(config, group, optionId);
    setConfig(result.config);
    setError(null);
    // Se conservan los avisos de grupos que siguen sin elección.
    setRemovals((prev) =>
      [...prev, ...result.removed].filter((r) => {
        if (r.group === 'extras') return result.removed.includes(r);
        const key = `${r.group}Id` as 'flavorId' | 'fillingId' | 'coveringId';
        return result.config[key] === null;
      }),
    );
  }

  function update(patch: Partial<CakeConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
    setError(null);
  }

  function stateOf(id: StepId, index: number): 'actual' | 'completo' | 'pendiente' {
    if (index === stepIndex) return 'actual';
    if (visited.has(id) && !stepIssue(config, id, dateRules, today)) return 'completo';
    return 'pendiente';
  }

  return (
    <div className="configurador contenedor">
      <nav className="ficha__ruta" aria-label="Ruta">
        <Link to="/catalogo">Catálogo</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/producto/${product.id}`}>{product.name}</Link>
      </nav>

      <h1>Arma tu torta</h1>

      <div className="configurador__rejilla">
        <div className="configurador__pasos">
          <nav aria-label="Pasos del configurador">
            <ol className="progreso">
              {steps.map((s, i) => {
                const state = stateOf(s.id, i);
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      className={`progreso__paso progreso__paso--${state}`}
                      aria-current={state === 'actual' ? 'step' : undefined}
                      aria-label={`Paso ${i + 1} de ${steps.length}: ${s.title}${
                        state === 'completo' ? ', completo' : ''
                      }`}
                      onClick={() => goTo(i)}
                    >
                      <span aria-hidden="true">{i + 1}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <section className="paso-actual" aria-labelledby="paso-titulo">
            <p className="paso-actual__cuenta">
              Paso {stepIndex + 1} de {steps.length}
            </p>
            <h2 id="paso-titulo" ref={headingRef} tabIndex={-1}>
              {step.title}
            </h2>
            <p className="paso-actual__ayuda">{hints[step.id]}</p>

            {removals.length > 0 && (
              <div className="aviso" role="status">
                {removals.map((r) => (
                  <p key={r.option.id}>
                    Quitamos {groupLabels[r.group].toLowerCase()} "{r.option.label}" porque no se
                    combina con "{r.because.label}".{' '}
                    {r.group !== 'extras' && (
                      <button
                        type="button"
                        onClick={() => goTo(steps.findIndex((s) => s.id === r.group))}
                      >
                        Elegir otra opción de {groupLabels[r.group].toLowerCase()}
                      </button>
                    )}
                  </p>
                ))}
              </div>
            )}

            {(step.id === 'size' ||
              step.id === 'flavor' ||
              step.id === 'filling' ||
              step.id === 'covering') && (
              <OptionStep
                group={step.id}
                config={config}
                onPick={(optionId) => pick(step.id as Exclude<Group, 'extras'>, optionId)}
              />
            )}

            {step.id === 'extras' && (
              <fieldset className="opciones-lista">
                <legend className="solo-lectores">Extras</legend>
                {groupOptions.extras.map((option) => {
                  const blockers = blockedBy(config, 'extras', option.id);
                  return (
                    <label key={option.id} className="opcion">
                      <input
                        type="checkbox"
                        checked={config.extraIds.includes(option.id)}
                        disabled={blockers.length > 0}
                        onChange={() => setConfig(toggleExtra(config, option.id))}
                      />
                      <span className="opcion__texto">
                        <b>{option.label}</b>
                        {option.note && <small>{option.note}</small>}
                      </span>
                      <span className="opcion__precio">{formatSurcharge(option.priceCents)}</span>
                    </label>
                  );
                })}
              </fieldset>
            )}

            {step.id === 'message' && (
              <div className="campo">
                <label htmlFor="mensaje">Mensaje sobre la torta</label>
                <input
                  id="mensaje"
                  type="text"
                  value={config.message}
                  maxLength={messageMaxLength}
                  placeholder="Feliz cumpleaños, Ana"
                  aria-describedby="mensaje-cuenta"
                  onChange={(e) => setConfig(setMessage(config, e.target.value))}
                />
                <p id="mensaje-cuenta" className="campo__nota">
                  {config.message.length} de {messageMaxLength} caracteres. Déjalo vacío si no
                  quieres mensaje.
                </p>
              </div>
            )}

            {step.id === 'date' && (
              <DateStep config={config} today={today} onChange={(date) => update({ date })} />
            )}

            {step.id === 'delivery' && <DeliveryStep config={config} onChange={update} />}

            {step.id === 'review' && (
              <ReviewStep
                product={product}
                config={config}
                today={today}
                onEdit={(id) => goTo(steps.findIndex((s) => s.id === id))}
                onNotes={(notes) => setConfig(setNotes(config, notes))}
              />
            )}

            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}

            <div className="paso-actual__botones">
              {stepIndex > 0 ? (
                <button type="button" className="boton boton--contorno" onClick={() => goTo(stepIndex - 1)}>
                  Atrás
                </button>
              ) : (
                <Link className="boton boton--contorno" to={`/producto/${product.id}`}>
                  Volver a la ficha
                </Link>
              )}
              {stepIndex < steps.length - 1 && (
                <button type="button" className="boton" onClick={next}>
                  Siguiente: {steps[stepIndex + 1].title}
                </button>
              )}
            </div>
          </section>
        </div>

        <Summary product={product} config={config} />
      </div>
    </div>
  );
}

function OptionStep({
  group,
  config,
  onPick,
}: {
  group: Exclude<Group, 'extras'>;
  config: CakeConfig;
  onPick: (optionId: string) => void;
}) {
  const selected = config[`${group}Id` as 'sizeId' | 'flavorId' | 'fillingId' | 'coveringId'];
  return (
    <fieldset className="opciones-lista">
      <legend className="solo-lectores">{groupLabels[group]}</legend>
      {groupOptions[group].map((option) => {
        const blockers = blockedBy(config, group, option.id);
        const disabled = blockers.length > 0;
        return (
          <label key={option.id} className={`opcion${disabled ? ' opcion--bloqueada' : ''}`}>
            <input
              type="radio"
              name={group}
              checked={selected === option.id}
              disabled={disabled}
              onChange={() => onPick(option.id)}
            />
            {option.swatch && (
              <span className="opcion__muestra" style={{ background: option.swatch }} aria-hidden="true" />
            )}
            <span className="opcion__texto">
              <b>{option.label}</b>
              {disabled ? (
                <small>No se combina con {blockers.map((b) => b.label.toLowerCase()).join(' ni ')}</small>
              ) : (
                option.note && <small>{option.note}</small>
              )}
            </span>
            <span className={option.priceCents === null ? 'opcion__precio opcion__precio--cotizar' : 'opcion__precio'}>
              {formatSurcharge(option.priceCents)}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

function DateStep({
  config,
  today,
  onChange,
}: {
  config: CakeConfig;
  today: string;
  onChange: (date: string) => void;
}) {
  const suggestions = useMemo(() => nextValidDates(dateRules, today, 6), [today]);
  const check = config.date ? validateDate(config.date, dateRules, today) : null;

  return (
    <>
      <div className="campo">
        <label htmlFor="fecha">Fecha deseada</label>
        <input
          id="fecha"
          type="date"
          value={config.date}
          min={addDays(today, dateRules.minLeadDays)}
          max={addDays(today, dateRules.maxAdvanceDays)}
          aria-describedby="fecha-reglas fecha-estado"
          onChange={(e) => onChange(e.target.value)}
        />
        <p id="fecha-estado" className={check && !check.ok ? 'campo__nota campo__nota--error' : 'campo__nota campo__nota--ok'} aria-live="polite">
          {check
            ? check.ok
              ? `${formatLongDate(config.date)}: cumple las reglas conocidas.`
              : check.message
            : ''}
        </p>
      </div>

      <div className="sugerencias">
        <p>Próximas fechas que cumplen las reglas</p>
        <ul>
          {suggestions.map((date) => (
            <li key={date}>
              <button type="button" aria-pressed={config.date === date} onClick={() => onChange(date)}>
                {formatShortDate(date)}
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

function DeliveryStep({
  config,
  onChange,
}: {
  config: CakeConfig;
  onChange: (patch: Partial<CakeConfig>) => void;
}) {
  return (
    <>
      <fieldset className="opciones-lista">
        <legend className="solo-lectores">Modalidad</legend>
        <label className="opcion">
          <input
            type="radio"
            name="modalidad"
            checked={config.deliveryMode === 'retiro'}
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
            checked={config.deliveryMode === 'entrega'}
            onChange={() => onChange({ deliveryMode: 'entrega' })}
          />
          <span className="opcion__texto">
            <b>Entrega a domicilio</b>
            <small>La tarifa depende de la zona</small>
          </span>
          <span className="opcion__precio">Según zona</span>
        </label>
      </fieldset>

      {config.deliveryMode === 'entrega' && (
        <>
          <h3 className="subtitulo">Zona de entrega</h3>
          <fieldset className="opciones-lista opciones-lista--compacta">
            <legend className="solo-lectores">Zona de entrega</legend>
            {deliveryZones.map((zone) => (
              <label key={zone.id} className="opcion">
                <input
                  type="radio"
                  name="zona"
                  checked={config.zoneId === zone.id}
                  onChange={() => onChange({ zoneId: zone.id })}
                />
                <span className="opcion__texto">
                  <b>{zone.label}</b>
                </span>
                <span className={zone.feeCents === null ? 'opcion__precio opcion__precio--cotizar' : 'opcion__precio'}>
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

function ReviewStep({
  product,
  config,
  today,
  onEdit,
  onNotes,
}: {
  product: Product;
  config: CakeConfig;
  today: string;
  onEdit: (id: StepId) => void;
  onNotes: (notes: string) => void;
}) {
  const size = sizes.find((s) => s.id === config.sizeId);
  const zone = deliveryZones.find((z) => z.id === config.zoneId);
  const extrasText =
    config.extraIds.map((id) => findOption(id)?.label).filter(Boolean).join(', ') || 'Ninguno';

  const rows: { id: StepId; label: string; value: string | null }[] = [
    { id: 'size', label: 'Tamaño', value: size?.label ?? null },
    { id: 'flavor', label: 'Bizcocho', value: findOption(config.flavorId)?.label ?? null },
    { id: 'filling', label: 'Relleno', value: findOption(config.fillingId)?.label ?? null },
    { id: 'covering', label: 'Cobertura', value: findOption(config.coveringId)?.label ?? null },
    { id: 'extras', label: 'Extras', value: extrasText },
    { id: 'message', label: 'Mensaje', value: config.message.trim() || 'Sin mensaje' },
    {
      id: 'date',
      label: 'Fecha deseada',
      value: validateDate(config.date, dateRules, today).ok ? formatLongDate(config.date) : null,
    },
    {
      id: 'delivery',
      label: 'Entrega',
      value:
        config.deliveryMode === 'retiro'
          ? `${pickup.label}, ${pickup.areaLabel}`
          : config.deliveryMode === 'entrega' && zone
            ? `Entrega a domicilio en ${zone.label}`
            : null,
    },
  ];
  const missing = rows.filter((r) => r.value === null);

  return (
    <>
      <p className="revision__producto">{product.name}</p>
      <dl className="revision">
        {rows.map((row) => (
          <div key={row.id} className={row.value === null ? 'revision__falta' : undefined}>
            <dt>{row.label}</dt>
            <dd>{row.value ?? 'Falta elegir'}</dd>
            <dd>
              <button type="button" onClick={() => onEdit(row.id)} aria-label={`Cambiar ${row.label.toLowerCase()}`}>
                {row.value === null ? 'Completar' : 'Cambiar'}
              </button>
            </dd>
          </div>
        ))}
      </dl>

      <div className="campo">
        <label htmlFor="observaciones">Observaciones</label>
        <textarea
          id="observaciones"
          rows={4}
          value={config.notes}
          maxLength={notesMaxLength}
          aria-describedby="observaciones-cuenta"
          placeholder="Alergias, colores, referencias del diseño..."
          onChange={(e) => onNotes(e.target.value)}
        />
        <p id="observaciones-cuenta" className="campo__nota">
          {config.notes.length} de {notesMaxLength} caracteres. Opcional. No escribas tu dirección
          ni datos de pago.
        </p>
      </div>

      {missing.length > 0 ? (
        <p className="error" role="status">
          Para terminar falta: {missing.map((m) => m.label.toLowerCase()).join(', ')}.
        </p>
      ) : (
        <p className="revision__etapa">
          Tu solicitud está completa. El paso de copiarla y abrir WhatsApp se añade en la
          siguiente etapa de la demostración. Nada se ha enviado ni reservado.
        </p>
      )}
    </>
  );
}
