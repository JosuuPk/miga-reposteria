import { useReveal } from '../lib/useReveal';
import './HowItWorks.css';

const pasos = [
  {
    titulo: 'Elige una torta',
    texto: 'Parte de una combinación de la casa o empieza en blanco.',
  },
  {
    titulo: 'Ármala capa por capa',
    texto: 'Tamaño, bizcocho, relleno, cobertura y extras. El estimado cambia con cada elección.',
  },
  {
    titulo: 'Envía la solicitud',
    texto: 'Revisas el resumen y lo envías tú por WhatsApp. En la web no se reserva ni se cobra nada.',
  },
  {
    titulo: 'Te confirmamos',
    texto: 'El negocio revisa la fecha, el diseño y el precio final, y te responde.',
  },
];

function Paso({ titulo, texto, index }: { titulo: string; texto: string; index: number }) {
  const ref = useReveal<HTMLLIElement>();
  return (
    <li
      ref={ref}
      className="paso revelar"
      style={{ '--retraso': `${index * 110}ms` } as React.CSSProperties}
    >
      <span className="paso__numero" aria-hidden="true">
        {index + 1}
      </span>
      <h3>{titulo}</h3>
      <p>{texto}</p>
    </li>
  );
}

export function HowItWorks() {
  return (
    <section className="pasos" aria-labelledby="pasos-titulo">
      <div className="contenedor">
        <h2 id="pasos-titulo">Cómo se pide</h2>
        <ol className="pasos__lista">
          {pasos.map((paso, i) => (
            <Paso key={paso.titulo} {...paso} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}
