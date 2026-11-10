import { sizes } from '../../data/cakeOptions';
import { findOption, type CakeConfig } from '../../lib/cakeConfig';
import './CakeDiagram.css';

/**
 * Dibujo plano de la torta en corte: cobertura, bizcocho y relleno con los colores
 * de lo elegido. Lo que falta por elegir se dibuja con borde punteado.
 */
export function CakeDiagram({ config }: { config: CakeConfig }) {
  const size = sizes.find((s) => s.id === config.sizeId);
  const flavor = findOption(config.flavorId);
  const filling = findOption(config.fillingId);
  const covering = findOption(config.coveringId);
  const tiers = size?.tiers ?? 1;
  const coversSides = covering && covering.id !== 'semidesnuda';

  const description = [
    size ? size.label : 'tamaño sin elegir',
    flavor ? `bizcocho de ${flavor.label.toLowerCase()}` : 'bizcocho sin elegir',
    filling ? `relleno de ${filling.label.toLowerCase()}` : 'relleno sin elegir',
    covering ? `cobertura ${covering.label.toLowerCase()}` : 'cobertura sin elegir',
  ].join(', ');

  const band = (kind: 'bizcocho' | 'relleno', color: string | undefined, key: string) => (
    <span
      key={key}
      className={`dibujo__capa dibujo__capa--${kind}${color ? '' : ' dibujo__capa--vacia'}`}
      style={color ? { background: color } : undefined}
    />
  );

  const tier = (index: number) => (
    <div
      key={index}
      className={`dibujo__piso${tiers === 2 && index === 0 ? ' dibujo__piso--alto' : ''}`}
      style={
        {
          '--cobertura': coversSides ? covering.swatch : 'transparent',
        } as React.CSSProperties
      }
    >
      <span
        className={`dibujo__capa dibujo__capa--cobertura${covering ? '' : ' dibujo__capa--vacia'}`}
        style={covering ? { background: covering.swatch } : undefined}
      />
      {band('bizcocho', flavor?.swatch, 'b1')}
      {band('relleno', filling?.swatch, 'r1')}
      {band('bizcocho', flavor?.swatch, 'b2')}
      {band('relleno', filling?.swatch, 'r2')}
      {band('bizcocho', flavor?.swatch, 'b3')}
    </div>
  );

  return (
    <div className="dibujo" role="img" aria-label={`Tu torta en corte: ${description}`}>
      {Array.from({ length: tiers }, (_, i) => tier(i))}
      <span className="dibujo__plato" />
    </div>
  );
}
