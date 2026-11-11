import { Link } from 'react-router';
import { brand } from '../data/brand';
import { contactUrl } from './WhatsAppButton';
import './Footer.css';

export function Footer() {
  const whatsapp = contactUrl();
  return (
    <footer className="pie">
      <div className="contenedor pie__fila">
        <div>
          <p className="pie__marca">{brand.name}</p>
          <p>
            Repostería por encargo en {brand.city}, {brand.country}.
            {brand.isDemo &&
              ' Esta es una marca conceptual creada como demostración; no corresponde a un negocio real.'}
          </p>
        </div>
        <nav aria-label="Pie de página">
          <ul>
            <li>
              <Link to="/catalogo">Catálogo</Link>
            </li>
            <li>
              <Link to="/armar/torta-a-medida">Armar torta</Link>
            </li>
            <li>
              <Link to="/preguntas">Preguntas y condiciones</Link>
            </li>
            {whatsapp && (
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
