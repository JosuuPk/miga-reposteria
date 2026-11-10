import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Summary } from '../components/configurator/Summary';
import { DateField, DeliveryField } from '../components/request/Fields';
import { RequestPanel } from '../components/request/RequestPanel';
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
import { formatLongDate, todayInZone, validateDate } from '../lib/dates';
import { clearDraft, loadDraft, saveDraft } from '../lib/draft';
import { formatSurcharge } from '../lib/money';
import { buildCakeMessage } from '../lib/request';
import { usePageTitle } from '../lib/usePageTitle';
import { NotFoundPage } from './NotFoundPage';
import './pages.css';
import './ProductPage.css';


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
  // Borrador guardado en este navegador (validado al cargarlo).
  const [draft] = useState(() => loadDraft(product));
  const [config, setConfig] = useState<CakeConfig>(() => draft ?? createConfig(product));
  const [showDraftNotice, setShowDraftNotice] = useState(draft !== null);
  const [stepIndex, setStepIndex] = useState(0);
  const [visited, setVisited] = useState<Set<StepId>>(
    () => new Set(draft ? steps.map((s) => s.id) : ['size']),
  );
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

  useEffect(() => saveDraft(config), [config]);

  function startOver() {
    clearDraft(product.id);
    setConfig(createConfig(product));
    setStepIndex(0);
    setVisited(new Set(['size']));
    setRemovals([]);
    setError(null);
    setShowDraftNotice(false);
  }

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

      {showDraftNotice && (
        <div className="aviso aviso--borrador" role="status">
          <p>
            Recuperamos el borrador que dejaste en este dispositivo. Las observaciones no se
            guardan.
          </p>
          <p>
            <button type="button" onClick={() => setShowDraftNotice(false)}>
              Seguir con el borrador
            </button>
            <button type="button" onClick={startOver}>
              Empezar de cero
            </button>
          </p>
        </div>
      )}

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
              <DateField date={config.date} today={today} onChange={(date) => update({ date })} />
            )}

            {step.id === 'delivery' && (
              <DeliveryField mode={config.deliveryMode} zoneId={config.zoneId} onChange={update} />
            )}

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
        <RequestPanel message={buildCakeMessage(product, config)} />
      )}
    </>
  );
}
