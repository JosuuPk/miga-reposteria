import './FlavorMarquee.css';

const sabores = [
  'Vainilla',
  'Chocolate oscuro',
  'Parchita',
  'Frambuesa',
  'Dulce de leche',
  'Zanahoria y canela',
  'Merengue suizo',
  'Queso crema',
];

/** Cinta de sabores en movimiento continuo. La segunda copia es solo visual. */
export function FlavorMarquee() {
  return (
    <div className="cinta">
      <div className="cinta__pista">
        <ul aria-label="Sabores de la casa">
          {sabores.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <ul aria-hidden="true">
          {sabores.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
