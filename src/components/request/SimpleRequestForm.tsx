import { useMemo, useState } from 'react';
import { brand } from '../../data/brand';
import { notesMaxLength } from '../../data/cakeOptions';
import type { Product } from '../../data/catalog';
import { dateRules, deliveryZones } from '../../data/rules';
import { todayInZone, validateDate } from '../../lib/dates';
import {
  clampQuantity,
  computeSimpleEstimate,
  createSimpleRequest,
  formatLineAmount,
  formatTotal,
  maxQuantity,
  type SimpleRequest,
} from '../../lib/pricing';
import { buildSimpleMessage } from '../../lib/request';
import { DateField, DeliveryField } from './Fields';
import { RequestPanel } from './RequestPanel';
import '../configurator/Summary.css'; // estilos de las líneas y el total del estimado
import './SimpleRequestForm.css';

/** Qué falta para poder preparar la solicitud, en el orden del formulario. */
function issuesOf(request: SimpleRequest, today: string): string[] {
  const issues: string[] = [];
  const date = validateDate(request.date, dateRules, today);
  if (!date.ok) issues.push(date.issue === 'vacia' ? 'Elige una fecha.' : date.message);
  if (!request.deliveryMode) {
    issues.push('Elige si lo retiras o si te lo llevamos.');
  } else if (
    request.deliveryMode === 'entrega' &&
    !deliveryZones.some((z) => z.id === request.zoneId)
  ) {
    issues.push('Elige la zona de entrega.');
  }
  return issues;
}

/** Solicitud para postres y bocados: cantidad, fecha, entrega y observaciones. */
export function SimpleRequestForm({ product }: { product: Product }) {
  const [request, setRequest] = useState<SimpleRequest>(() => createSimpleRequest(product));
  const [asked, setAsked] = useState(false);
  const today = useMemo(() => todayInZone(brand.timeZone), []);

  const estimate = computeSimpleEstimate(product, request);
  const issues = issuesOf(request, today);
  const update = (patch: Partial<SimpleRequest>) => setRequest((prev) => ({ ...prev, ...patch }));

  return (
    <section className="pedido" aria-labelledby="pedido-titulo">
      <h2 id="pedido-titulo">Solicitar {product.name.toLowerCase()}</h2>

      <div className="pedido__rejilla">
        <div className="pedido__campos">
          <div className="campo">
            <span id="cantidad-etiqueta" className="campo__etiqueta">
              Cantidad ({product.unitLabel})
            </span>
            <div className="cantidad" role="group" aria-labelledby="cantidad-etiqueta">
              <button
                type="button"
                aria-label="Quitar uno"
                disabled={request.quantity <= 1}
                onClick={() => update({ quantity: clampQuantity(request.quantity - 1) })}
              >
                −
              </button>
              <output aria-live="polite">{request.quantity}</output>
              <button
                type="button"
                aria-label="Añadir uno"
                disabled={request.quantity >= maxQuantity}
                onClick={() => update({ quantity: clampQuantity(request.quantity + 1) })}
              >
                +
              </button>
            </div>
            <p className="campo__nota">
              Hasta {maxQuantity}. Para más cantidad, indícalo en las observaciones.
            </p>
          </div>

          <h3 className="subtitulo">Fecha</h3>
          <DateField date={request.date} today={today} onChange={(date) => update({ date })} />

          <h3 className="subtitulo">Entrega</h3>
          <DeliveryField mode={request.deliveryMode} zoneId={request.zoneId} onChange={update} />

          <div className="campo pedido__observaciones">
            <label htmlFor="observaciones">Observaciones</label>
            <textarea
              id="observaciones"
              rows={3}
              value={request.notes}
              maxLength={notesMaxLength}
              placeholder="Sabores, alergias, colores..."
              aria-describedby="observaciones-cuenta"
              onChange={(e) => update({ notes: e.target.value.slice(0, notesMaxLength) })}
            />
            <p id="observaciones-cuenta" className="campo__nota">
              {request.notes.length} de {notesMaxLength} caracteres. Opcional. No escribas tu
              dirección ni datos de pago.
            </p>
          </div>
        </div>

        <aside className="pedido__estimado" aria-label="Estimado">
          <h3>Tu estimado</h3>
          <ul className="resumen__lineas">
            {estimate.lines.map((line) => (
              <li key={line.key}>
                <span>{line.label}</span>
                <span className={line.cents === null ? 'resumen__cotizar' : undefined}>
                  {formatLineAmount(line)}
                </span>
              </li>
            ))}
          </ul>
          <p className="resumen__total">
            <span>Total estimado</span>
            <strong>{formatTotal(estimate)}</strong>
          </p>
          <p className="resumen__condiciones">
            Estimado en USD, de demostración. El precio final y la fecha quedan sujetos a la
            confirmación del negocio.
          </p>
        </aside>
      </div>

      {!asked && (
        <button type="button" className="boton pedido__preparar" onClick={() => setAsked(true)}>
          Preparar solicitud
        </button>
      )}

      {asked && issues.length > 0 && (
        <div className="error" role="alert">
          <p>Para preparar la solicitud falta:</p>
          <ul>
            {issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {asked && issues.length === 0 && <RequestPanel message={buildSimpleMessage(product, request)} />}
    </section>
  );
}
