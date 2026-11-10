import { Link } from 'react-router';
import type { Product } from '../data/catalog';
import { formatUsd } from '../lib/money';
import { useReveal } from '../lib/useReveal';
import { ProductPhoto } from './ProductPhoto';
import './ProductGrid.css';

type Variant = 'destacado' | 'medio' | 'par' | 'cuadro' | 'fila';

/**
 * "mosaico": una pieza grande, dos medianas, tres cuadradas y el resto en fila.
 * "trio": piezas cuadradas iguales (para "También horneamos").
 */
type Layout = 'mosaico' | 'trio';

function variantFor(index: number, count: number, layout: Layout): Variant {
  if (layout === 'trio') return 'cuadro';
  if (count <= 2) return 'par';
  if (index === 0) return 'destacado';
  if (index <= 2) return 'medio';
  if (index <= 5) return 'cuadro';
  return 'fila';
}

const ratios: Record<Variant, string> = {
  destacado: '4 / 5',
  medio: '16 / 10',
  par: '16 / 10',
  cuadro: '1 / 1',
  fila: '1 / 1',
};

export function priceText(product: Product): string {
  const price = formatUsd(product.basePriceCents);
  return product.priceIsStartingAt ? `Desde ${price}` : price;
}

function ProductCard({ product, variant, index }: { product: Product; variant: Variant; index: number }) {
  const ref = useReveal<HTMLLIElement>();
  return (
    <li
      ref={ref}
      className={`producto producto--${variant} revelar`}
      style={{ '--retraso': `${(index % 3) * 90}ms` } as React.CSSProperties}
    >
      <Link className="producto__tarjeta" to={`/producto/${product.id}`}>
        <ProductPhoto image={product.image} ratio={ratios[variant]} eager={index === 0} />
        <div className="producto__texto">
          <h3>{product.name}</h3>
          <p className="producto__resumen">{product.summary}</p>
          <p className="producto__precio">
            <strong>{priceText(product)}</strong>
            <span>{product.unitLabel}</span>
          </p>
        </div>
      </Link>
    </li>
  );
}

export function ProductGrid({ items, layout = 'mosaico' }: { items: Product[]; layout?: Layout }) {
  return (
    <ul className="rejilla">
      {items.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          variant={variantFor(index, items.length, layout)}
        />
      ))}
    </ul>
  );
}
