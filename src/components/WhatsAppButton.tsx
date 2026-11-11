import { useLocation } from 'react-router';
import { brand } from '../data/brand';
import { routerBase } from '../lib/assetUrl';
import { buildWhatsAppUrl } from '../lib/request';
import './WhatsAppButton.css';

/** Enlace de contacto general, o null si no hay número configurado. */
export function contactUrl(): string | null {
  return buildWhatsAppUrl(brand.whatsappNumber, brand.whatsappGreeting);
}

function Icon() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        d="M16 4.5a11.5 11.5 0 0 0-9.9 17.4L4.5 27.5l5.8-1.5A11.5 11.5 0 1 0 16 4.5Z"
      />
      <path
        fill="currentColor"
        d="M12.6 10.3c-.3-.6-.6-.6-.9-.6h-.7c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.100s1.300 3.600 1.500 3.900c.2.200 2.600 4.100 6.400 5.600 3.100 1.200 3.800 1 4.500.900.700-.1 2.200-.900 2.500-1.800.3-.9.3-1.600.2-1.800-.1-.2-.3-.3-.7-.5l-2.400-1.200c-.3-.1-.6-.2-.8.200l-1.100 1.400c-.2.200-.4.300-.800.1-.4-.2-1.500-.600-2.900-1.800-1.100-1-1.800-2.100-2-2.500-.2-.4 0-.6.200-.800l.500-.600c.2-.200.2-.400.4-.600.100-.300 0-.5 0-.7l-1.100-2.500Z"
      />
    </svg>
  );
}

/** Botón normal, para usar dentro del contenido. No se muestra sin número. */
export function WhatsAppButton({ className = 'boton boton--contorno' }: { className?: string }) {
  const url = contactUrl();
  if (!url) return null;
  return (
    <a className={`${className} boton--whatsapp`} href={url} target="_blank" rel="noopener noreferrer">
      <Icon />
      Escribir por WhatsApp
    </a>
  );
}

/** Burbuja fija en la esquina inferior derecha. No se muestra sin número. */
export function WhatsAppBubble() {
  const { pathname } = useLocation();
  const url = contactUrl();
  if (!url) return null;
  // En el configurador, en móvil, la burbuja se oculta (ver CSS) para no tapar controles.
  const lifted = pathname.replace(routerBase, '').startsWith('/armar');
  return (
    <a
      className={`burbuja${lifted ? ' burbuja--elevada' : ''}`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp (se abre en otra pestaña)"
    >
      <span className="burbuja__texto" aria-hidden="true">
        Escríbenos
      </span>
      <span className="burbuja__icono">
        <Icon />
      </span>
    </a>
  );
}
