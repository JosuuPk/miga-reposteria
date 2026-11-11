import { Link, useParams } from 'react-router';
import { ProductGrid, priceText } from '../components/ProductGrid';
import { ProductPhoto } from '../components/ProductPhoto';
import { SimpleRequestForm } from '../components/request/SimpleRequestForm';
import { coverings, extras, fillings, flavors, sizes, type CakeOption } from '../data/cakeOptions';
import { familyLabels, findProduct, products, type Product } from '../data/catalog';
import { assetUrl } from '../lib/assetUrl';
import { formatSurcharge } from '../lib/money';
import { usePageTitle } from '../lib/usePageTitle';
import { NotFoundPage } from './NotFoundPage';
import './pages.css';
import './ProductPage.css';

function photoRatio(product: Product): string {
  const { width, height } = product.image;
  if (height > width) return '4 / 5';
  if (width > height) return '3 / 2';
  return '1 / 1';
}

function OptionGroup({
  title,
  options,
  houseChoice,
}: {
  title: string;
  options: CakeOption[];
  houseChoice?: string;
}) {
  return (
    <div className="opciones__grupo">
      <h3>{title}</h3>
      <ul>
        {options.map((option) => (
          <li key={option.id} className={option.id === houseChoice ? 'es-de-la-casa' : undefined}>
            <span>
              {option.label}
              {option.id === houseChoice && <small> (de la casa)</small>}
            </span>
            <span className={option.priceCents === null ? 'opciones__cotizar' : 'opciones__precio'}>
              {formatSurcharge(option.priceCents)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductPage() {
  const { id } = useParams();
  const product = findProduct(id);
  if (!product) {
    return <NotFoundPage message="Ese producto no está en el catálogo." />;
  }
  return <ProductView product={product} />;
}

function ProductView({ product }: { product: Product }) {
  usePageTitle(product.name);

  const preset = product.cakePreset;
  const related = [
    ...products.filter((p) => p.id !== product.id && p.family === product.family),
    ...products.filter((p) => p.family !== product.family),
  ].slice(0, 3);

  return (
    <>
      <article className="ficha contenedor" aria-labelledby="ficha-titulo">
        <nav className="ficha__ruta" aria-label="Ruta">
          <Link to="/catalogo">Catálogo</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/catalogo?familia=${product.family}`}>{familyLabels[product.family]}</Link>
        </nav>

        <div className="ficha__rejilla">
          <div className="ficha__foto">
            {product.image.src && (
              <img className="ficha__halo" src={assetUrl(product.image.src)} alt="" aria-hidden="true" />
            )}
            <ProductPhoto image={product.image} ratio={photoRatio(product)} eager />
          </div>

          <div className="ficha__texto">
            <h1 id="ficha-titulo">{product.name}</h1>
            <p className="ficha__descripcion">{product.description}</p>

            <p className="ficha__precio">
              <strong>{priceText(product)}</strong>
              <span>{product.unitLabel}</span>
            </p>
            <p className="ficha__condicion">
              Precio estimado en USD, de demostración. El precio final lo confirma el negocio.
            </p>

            <ul className="ficha__detalles">
              {product.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>

            <p className="ficha__alergenos">
              <b>Contiene:</b> {product.allergens.join(', ').toLowerCase()}.
            </p>

            {preset ? (
              <Link className="boton ficha__armar" to={`/armar/${product.id}`}>
                Armar esta torta
              </Link>
            ) : (
              <a className="boton ficha__armar" href="#pedido-titulo">
                Solicitar
              </a>
            )}
          </div>
        </div>

        {!preset && <SimpleRequestForm key={product.id} product={product} />}

        {preset && (
          <section className="opciones" aria-labelledby="opciones-titulo">
            <h2 id="opciones-titulo">Lo que puedes elegir</h2>
            <p className="opciones__intro">
              Los importes se suman al precio base. Lo que requiere cotización no tiene precio
              fijo: lo define el negocio al confirmar.
            </p>
            <div className="opciones__rejilla">
              <OptionGroup title="Tamaño" options={sizes} />
              <OptionGroup title="Bizcocho" options={flavors} houseChoice={preset.flavorId} />
              <OptionGroup title="Relleno" options={fillings} houseChoice={preset.fillingId} />
              <OptionGroup title="Cobertura" options={coverings} houseChoice={preset.coveringId} />
              <OptionGroup title="Extras" options={extras} />
            </div>
          </section>
        )}
      </article>

      <section className="seccion seccion--alta" aria-labelledby="relacionados-titulo">
        <div className="contenedor">
          <div className="seccion__encabezado">
            <h2 id="relacionados-titulo">También horneamos</h2>
          </div>
          <ProductGrid key={product.id} items={related} layout="trio" />
        </div>
      </section>
    </>
  );
}
