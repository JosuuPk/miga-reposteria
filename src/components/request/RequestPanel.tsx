import { useEffect, useState } from 'react';
import { brand } from '../../data/brand';
import { buildWhatsAppUrl } from '../../lib/request';
import './RequestPanel.css';

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Navegadores sin permiso de portapapeles: se intenta con un campo temporal.
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/**
 * Vista previa de la solicitud, con copiar y abrir WhatsApp.
 * Nunca afirma que la solicitud se envió: eso ocurre en WhatsApp y no se puede verificar.
 */
export function RequestPanel({ message }: { message: string }) {
  const [copied, setCopied] = useState<'no' | 'si' | 'fallo'>('no');
  const url = buildWhatsAppUrl(brand.whatsappNumber, message);

  // Si la solicitud cambia, lo copiado antes ya no está al día.
  useEffect(() => setCopied('no'), [message]);

  return (
    <section className="solicitud" aria-labelledby="solicitud-titulo">
      <h3 id="solicitud-titulo">Tu solicitud</h3>
      <p className="solicitud__ayuda">
        Este es el mensaje completo. Los asteriscos se ven como negritas en WhatsApp.
      </p>

      <pre className="solicitud__texto" tabIndex={0} aria-label="Texto de la solicitud">
        {message}
      </pre>

      <div className="solicitud__botones">
        <button
          type="button"
          className={url ? 'boton boton--contorno' : 'boton'}
          onClick={async () => setCopied((await copyText(message)) ? 'si' : 'fallo')}
        >
          Copiar solicitud
        </button>
        {url && (
          <a className="boton" href={url} target="_blank" rel="noopener noreferrer">
            Abrir WhatsApp con la solicitud
          </a>
        )}
      </div>

      <p className="solicitud__estado" role="status">
        {copied === 'si' && 'Solicitud copiada al portapapeles.'}
        {copied === 'fallo' &&
          'No se pudo copiar automáticamente. Selecciona el texto de arriba y cópialo a mano.'}
      </p>

      {url ? (
        <p className="solicitud__nota">
          Se abrirá WhatsApp con el mensaje ya escrito. Para enviarlo, pulsa "Enviar" allí. La
          solicitud queda pendiente hasta que el negocio la confirme: abrir WhatsApp no reserva la
          fecha ni registra un pago.
        </p>
      ) : (
        <p className="solicitud__nota solicitud__nota--demo">
          <b>Modo demostración.</b> Este sitio no tiene un número de WhatsApp configurado, así que
          no abre WhatsApp ni envía nada. Puedes revisar y copiar la solicitud. Nada se ha enviado,
          reservado ni cobrado.
        </p>
      )}
    </section>
  );
}
