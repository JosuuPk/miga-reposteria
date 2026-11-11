import { Link } from 'react-router';
import { brand } from '../data/brand';
import { dateRules, deliveryZones, pickup } from '../data/rules';
import { closedDaysText } from '../lib/dates';
import { formatUsd } from '../lib/money';
import { usePageTitle } from '../lib/usePageTitle';
import './pages.css';
import './FaqPage.css';

// Las respuestas que dependen de reglas (anticipación, días cerrados, zonas) se
// leen de src/data/rules.ts, así no se desactualizan al cambiar los datos.
export function FaqPage() {
  usePageTitle('Preguntas y condiciones');

  const zonesWithFee = deliveryZones.filter((z) => z.feeCents !== null);
  const closed = closedDaysText(dateRules);

  const questions: { q: string; a: React.ReactNode }[] = [
    {
      q: '¿Con cuánta anticipación debo pedir?',
      a: (
        <p>
          Al menos {dateRules.minLeadDays} días antes de la fecha deseada, y como máximo con{' '}
          {dateRules.maxAdvanceDays} días de anticipación. No hay producción ni entregas los{' '}
          {closed}. Las fechas se calculan con la hora de {brand.city}.
        </p>
      ),
    },
    {
      q: '¿El precio que veo es el precio final?',
      a: (
        <p>
          No. Es un estimado en USD calculado con las opciones que eliges. El precio final lo
          confirma el negocio cuando revisa tu solicitud.
        </p>
      ),
    },
    {
      q: '¿Qué significa "Requiere cotización"?',
      a: (
        <p>
          Que esa opción no tiene un precio fijo, por ejemplo un diseño especial, más de 30
          porciones o una zona de entrega sin tarifa definida. No se suma al total ni se considera
          gratis: el negocio te da el precio al responder.
        </p>
      ),
    },
    {
      q: '¿Cómo envío y confirmo mi pedido?',
      a: (
        <>
          <p>
            Al terminar verás el texto completo de tu solicitud. Puedes copiarlo o abrir WhatsApp
            con el mensaje ya escrito; para enviarlo debes pulsar "Enviar" en WhatsApp.
          </p>
          <p>
            La solicitud queda pendiente hasta que el negocio la confirme. Esta web no reserva
            fechas, no cobra y no puede saber si enviaste el mensaje.
          </p>
        </>
      ),
    },
    {
      q: '¿Hacen entregas a domicilio?',
      a: (
        <>
          <p>
            Puedes elegir {pickup.label.toLowerCase()} ({pickup.areaLabel}), sin costo, o entrega a
            domicilio en estas zonas:
          </p>
          <ul>
            {zonesWithFee.map((zone) => (
              <li key={zone.id}>
                {zone.label}: {formatUsd(zone.feeCents!)}
              </li>
            ))}
          </ul>
          <p>
            Para otras zonas la entrega se cotiza. La dirección exacta no se pide en la web: se
            coordina por WhatsApp.
          </p>
        </>
      ),
    },
    {
      q: '¿Cómo se paga?',
      a: (
        <p>
          Esta web no procesa pagos. La forma de pago y el anticipo, si lo hay, se acuerdan
          directamente con el negocio al confirmar.
        </p>
      ),
    },
    {
      q: '¿Puedo cambiar o cancelar una solicitud?',
      a: (
        <p>
          Mientras no esté confirmada, basta con avisar por WhatsApp. Los cambios y cancelaciones
          después de la confirmación dependen de las condiciones que acuerdes con el negocio.
        </p>
      ),
    },
    {
      q: '¿Qué pasa con las alergias?',
      a: (
        <p>
          Cada ficha indica los alérgenos principales de la receta. Todo se prepara en una misma
          cocina, así que puede haber trazas de gluten, huevo, lácteos y frutos secos. Indica
          cualquier alergia en las observaciones.
        </p>
      ),
    },
    {
      q: '¿Qué datos guarda esta web?',
      a: (
        <p>
          Ninguno en un servidor. El configurador guarda en tu propio navegador, durante 7 días,
          la torta que estabas armando para que no la pierdas al recargar. Las observaciones no se
          guardan. Puedes borrarlo con "Empezar de cero".
        </p>
      ),
    },
  ];

  if (brand.isDemo) {
    questions.push({
      q: '¿Las fotos y los precios son reales?',
      a: (
        <p>
          No. {brand.name} es una marca conceptual creada como demostración. Las imágenes son
          ilustrativas, generadas con inteligencia artificial, y los productos, precios, zonas y
          reglas son de ejemplo. No se reciben pedidos.
        </p>
      ),
    });
  }

  return (
    <section className="seccion seccion--pagina" aria-labelledby="faq-titulo">
      <div className="contenedor faq">
        <div className="seccion__encabezado">
          <h1 id="faq-titulo">Preguntas y condiciones</h1>
          <p>Lo que conviene saber antes de enviar una solicitud.</p>
        </div>

        <div className="faq__lista">
          {questions.map(({ q, a }) => (
            <details key={q}>
              <summary>
                <h2>{q}</h2>
              </summary>
              <div className="faq__respuesta">{a}</div>
            </details>
          ))}
        </div>

        <section className="condiciones" aria-labelledby="condiciones-titulo">
          <h2 id="condiciones-titulo">Condiciones del estimado</h2>
          <ul>
            <li>Los importes están en USD y son estimados, no un presupuesto en firme.</li>
            <li>Lo marcado como "por cotizar" no forma parte del total mostrado.</li>
            <li>
              Que una fecha cumpla las reglas no garantiza cupo: la disponibilidad la confirma el
              negocio.
            </li>
            <li>Ninguna solicitud está aceptada hasta que el negocio la confirme por WhatsApp.</li>
          </ul>
          <Link className="boton" to="/armar/torta-a-medida">
            Armar una torta
          </Link>
        </section>
      </div>
    </section>
  );
}
