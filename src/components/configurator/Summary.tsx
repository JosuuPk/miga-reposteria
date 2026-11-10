import { useId, useState } from 'react';
import type { Product } from '../../data/catalog';
import type { CakeConfig } from '../../lib/cakeConfig';
import { computeEstimate, formatLineAmount, formatTotal } from '../../lib/pricing';
import { CakeDiagram } from './CakeDiagram';
import './Summary.css';

/**
 * Resumen del estimado. En pantallas grandes es una columna fija; en móvil es una
 * barra al pie del configurador que se despliega al pulsarla.
 */
export function Summary({ product, config }: { product: Product; config: CakeConfig }) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  const estimate = computeEstimate(product, config);

  return (
    <aside className={`resumen${open ? ' resumen--abierto' : ''}`} aria-label="Resumen del estimado">
      <button
        type="button"
        className="resumen__barra"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>
          <small>Estimado</small>
          <strong>{formatTotal(estimate)}</strong>
        </span>
        <span className="resumen__accion">{open ? 'Ocultar desglose' : 'Ver desglose'}</span>
      </button>

      <div className="resumen__cuerpo" id={bodyId}>
        <CakeDiagram config={config} />

        <h2>Tu estimado</h2>
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

        {estimate.pending.length > 0 && (
          <p className="resumen__pendiente">
            Lo marcado como "por cotizar" no está incluido en el total: lo define el negocio.
          </p>
        )}

        <p className="resumen__condiciones">
          Estimado en USD, de demostración. El precio final, la fecha y el diseño quedan sujetos
          a la confirmación del negocio.
        </p>
      </div>
    </aside>
  );
}
