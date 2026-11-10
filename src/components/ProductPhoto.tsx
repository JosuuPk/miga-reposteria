import { brand } from '../data/brand';
import type { ProductImage } from '../data/catalog';
import './ProductPhoto.css';

type Props = {
  image: ProductImage;
  /** Proporción con la que se recorta en pantalla, p. ej. "4 / 5". */
  ratio: string;
  eager?: boolean;
};

/**
 * Muestra la foto del producto con su espacio reservado. Si todavía no hay foto,
 * dibuja un marcador de franjas rotulado como "Imagen provisional". En modo
 * demostración, las fotos se rotulan como "Imagen ilustrativa".
 */
export function ProductPhoto({ image, ratio, eager = false }: Props) {
  return (
    <div className="foto" style={{ aspectRatio: ratio }}>
      {image.src ? (
        <>
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
          />
          {brand.isDemo && (
            <em>
              <b>Imagen </b>ilustrativa
            </em>
          )}
        </>
      ) : (
        <div className="foto__marcador" role="img" aria-label={`Imagen provisional: ${image.alt}`}>
          {image.placeholderTones.map((tone, i) => (
            <span key={i} style={{ background: tone }} />
          ))}
          <em>
            <b>Imagen </b>provisional
          </em>
        </div>
      )}
    </div>
  );
}
