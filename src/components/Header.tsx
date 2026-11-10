import { Link, NavLink } from 'react-router';
import { brand } from '../data/brand';
import './Header.css';

export function Header() {
  return (
    <header className="cabecera">
      <div className="cabecera__fila">
        <Link className="cabecera__marca" to="/" aria-label={`${brand.name}, inicio`}>
          {brand.name}
          <span aria-hidden="true">.</span>
        </Link>
        <p className="cabecera__lugar">Repostería por encargo en {brand.city}</p>
        <nav aria-label="Principal">
          <NavLink className="cabecera__enlace" to="/catalogo">
            Catálogo
          </NavLink>
          <NavLink className="cabecera__enlace cabecera__enlace--principal" to="/armar/torta-a-medida">
            Armar torta
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
