import { useRef } from 'react';
import { Link } from 'react-router';
import { brand } from '../data/brand';
import { assetUrl } from '../lib/assetUrl';
import './Hero.css';

const titular = ['Tu', 'torta,', 'capa', 'por', 'capa.'];

// Combinación de ejemplo que flota alrededor de la torta. Es ilustrativa:
// las opciones reales del configurador se definen en los archivos de datos.
const elecciones = [
  { texto: 'Merengue suizo', color: '#FBF6EC', lugar: 'a', profundidad: 18 },
  { texto: 'Bizcocho de vainilla', color: '#E3C78D', lugar: 'b', profundidad: -28 },
  { texto: 'Relleno de frambuesa', color: '#FF5C8A', lugar: 'c', profundidad: 32 },
  { texto: '12 porciones', color: '#E8A93B', lugar: 'd', profundidad: -16 },
];

const capas = ['cobertura', 'bizcocho', 'relleno', 'bizcocho', 'relleno', 'bizcocho'];

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Las etiquetas siguen ligeramente al cursor (solo con ratón).
  function onPointerMove(event: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el || event.pointerType !== 'mouse') return;
    const box = el.getBoundingClientRect();
    el.style.setProperty('--px', ((event.clientX - box.left) / box.width - 0.5).toFixed(3));
    el.style.setProperty('--py', ((event.clientY - box.top) / box.height - 0.5).toFixed(3));
  }

  return (
    <section
      ref={ref}
      className="portada"
      aria-labelledby="portada-titulo"
      onPointerMove={onPointerMove}
    >
      <div className="portada__luz portada__luz--frambuesa" aria-hidden="true" />
      <div className="portada__luz portada__luz--caramelo" aria-hidden="true" />

      <div className="contenedor portada__contenido">
        <p className="portada__dato">
          <span aria-hidden="true" />
          Por encargo en {brand.city}, con 3 días de anticipación
        </p>

        <h1 id="portada-titulo" aria-label={titular.join(' ')}>
          {titular.map((palabra, i) => (
            <span key={i} aria-hidden="true" style={{ '--i': i } as React.CSSProperties}>
              {palabra}{' '}
            </span>
          ))}
        </h1>

        <p className="portada__bajada">
          Elige el tamaño, el bizcocho, el relleno y la cobertura. Verás un precio estimado y nos
          envías la solicitud por WhatsApp para confirmarla.
        </p>

        <Link className="boton" to="/catalogo">
          Ver el catálogo
        </Link>

        <div
          className={`portada__escena${brand.heroImageSrc ? ' portada__escena--foto' : ''}`}
        >
          {brand.heroImageSrc ? (
            <>
              <img className="portada__foto-halo" src={assetUrl(brand.heroImageSrc)} alt="" aria-hidden="true" />
              <img
                className="portada__foto"
                src={assetUrl(brand.heroImageSrc)}
                alt="Torta de capas de vainilla y frambuesa con merengue (imagen ilustrativa)"
                width={1254}
                height={1254}
                fetchPriority="high"
              />
            </>
          ) : (
            <div
              className="corte"
              role="img"
              aria-label="Dibujo de una torta en capas: merengue, bizcocho de vainilla y relleno de frambuesa"
            >
              {capas.map((capa, i) => (
                <span
                  key={i}
                  className={`corte__capa corte__capa--${capa}`}
                  style={{ '--orden': capas.length - 1 - i } as React.CSSProperties}
                />
              ))}
              <span className="corte__plato" />
            </div>
          )}

          <ul className="portada__elecciones" aria-label="Una combinación de ejemplo">
            {elecciones.map((e) => (
              <li
                key={e.lugar}
                className={`eleccion eleccion--${e.lugar}`}
                style={{ '--prof': e.profundidad } as React.CSSProperties}
              >
                <span className="eleccion__cuerpo">
                  <i style={{ background: e.color }} aria-hidden="true" />
                  {e.texto}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
