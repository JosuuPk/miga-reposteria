import { Link } from 'react-router';
import { FlavorMarquee } from '../components/FlavorMarquee';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { ProductGrid } from '../components/ProductGrid';
import { products } from '../data/catalog';
import { usePageTitle } from '../lib/usePageTitle';
import { useReveal } from '../lib/useReveal';
import './pages.css';

export function HomePage() {
  usePageTitle();
  const headingRef = useReveal<HTMLDivElement>();
  const tortas = products.filter((p) => p.family === 'torta');

  return (
    <>
      <Hero />
      <FlavorMarquee />

      <section className="seccion" aria-labelledby="tortas-titulo">
        <div className="contenedor">
          <div ref={headingRef} className="seccion__encabezado revelar">
            <h2 id="tortas-titulo">Tortas para armar</h2>
            <p>
              Tres puntos de partida. Todas se hacen por encargo, con al menos tres días de
              anticipación.
            </p>
          </div>

          <ProductGrid items={tortas} />

          <div className="seccion__cierre">
            <p>También hay postres de la casa y bocados para regalar.</p>
            <Link className="boton boton--contorno" to="/catalogo">
              Ver los {products.length} productos
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks />
    </>
  );
}
