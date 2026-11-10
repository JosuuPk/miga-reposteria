import { useSearchParams } from 'react-router';
import { ProductGrid } from '../components/ProductGrid';
import { familyLabels, products, type ProductFamily } from '../data/catalog';
import { usePageTitle } from '../lib/usePageTitle';
import './pages.css';

const families = Object.keys(familyLabels) as ProductFamily[];

function isFamily(value: string | null): value is ProductFamily {
  return value !== null && (families as string[]).includes(value);
}

export function CatalogPage() {
  usePageTitle('Catálogo');
  // El filtro vive en la dirección (?familia=torta) para poder compartirla.
  const [params, setParams] = useSearchParams();
  const param = params.get('familia');
  const active = isFamily(param) ? param : null;
  const visible = active ? products.filter((p) => p.family === active) : products;

  function choose(family: ProductFamily | null) {
    setParams(family ? { familia: family } : {}, { replace: true, preventScrollReset: true });
  }

  return (
    <section className="seccion seccion--pagina" aria-labelledby="catalogo-titulo">
      <div className="contenedor">
        <div className="seccion__encabezado">
          <h1 id="catalogo-titulo">Catálogo</h1>
          <p>
            Tortas que armas a tu gusto, postres de la casa y bocados. Todo se hace por encargo.
          </p>
        </div>

        <div className="filtros" role="group" aria-label="Filtrar por tipo de producto">
          <button type="button" aria-pressed={active === null} onClick={() => choose(null)}>
            Todo <span>{products.length}</span>
          </button>
          {families.map((family) => (
            <button
              key={family}
              type="button"
              aria-pressed={active === family}
              onClick={() => choose(family)}
            >
              {familyLabels[family]}{' '}
              <span>{products.filter((p) => p.family === family).length}</span>
            </button>
          ))}
        </div>

        <p className="filtros__estado" role="status">
          {visible.length} {visible.length === 1 ? 'producto' : 'productos'}
          {active ? ` en ${familyLabels[active].toLowerCase()}` : ''}
        </p>

        {/* La clave hace que las tarjetas vuelvan a aparecer al cambiar de filtro. */}
        <ProductGrid key={active ?? 'todo'} items={visible} />

        <p className="seccion__nota">
          Precios estimados en USD, de demostración. El precio final lo confirma el negocio.
        </p>
      </div>
    </section>
  );
}
