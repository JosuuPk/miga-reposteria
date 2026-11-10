import { brand } from '../data/brand';
import './Footer.css';

export function Footer() {
  return (
    <footer className="pie">
      <div className="contenedor pie__fila">
        <p className="pie__marca">{brand.name}</p>
        <p>
          Repostería por encargo en {brand.city}, {brand.country}.
          {brand.isDemo &&
            ' Esta es una marca conceptual creada como demostración; no corresponde a un negocio real y no recibe pedidos.'}
        </p>
      </div>
    </footer>
  );
}
