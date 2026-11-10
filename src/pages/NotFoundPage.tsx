import { Link } from 'react-router';
import { usePageTitle } from '../lib/usePageTitle';
import './pages.css';

export function NotFoundPage({ message = 'Esa dirección no existe en este sitio.' }: { message?: string }) {
  usePageTitle('Página no encontrada');
  return (
    <section className="seccion seccion--pagina no-encontrada" aria-labelledby="nf-titulo">
      <div className="contenedor">
        <h1 id="nf-titulo">No encontramos esa página</h1>
        <p>{message}</p>
        <Link className="boton" to="/catalogo">
          Ir al catálogo
        </Link>
      </div>
    </section>
  );
}
