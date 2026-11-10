// Configuración de marca y contacto.
// Para operar con un negocio real, cambia estos valores (ver PROJECT_BRIEF.md).

export type Brand = {
  name: string;
  city: string;
  country: string;
  /** true mientras la marca, los precios y las imágenes sean de demostración. */
  isDemo: boolean;
  /**
   * Número de WhatsApp en formato internacional, solo dígitos (ej.: "584121234567").
   * Con null la web queda en modo demostración: permite previsualizar y copiar
   * la solicitud, pero no abre WhatsApp.
   */
  whatsappNumber: string | null;
  /**
   * Foto de la portada (cuadrada, fondo oscuro), p. ej. "/images/portada.png".
   * Con null se muestra el corte de torta dibujado.
   */
  heroImageSrc: string | null;
  /** Zona horaria usada para todas las reglas de fechas del negocio. */
  timeZone: string;
  currency: 'USD';
};

export const brand: Brand = {
  name: 'Miga',
  city: 'Caracas',
  country: 'Venezuela',
  isDemo: true,
  whatsappNumber: null,
  heroImageSrc: '/images/portada.webp',
  timeZone: 'America/Caracas',
  currency: 'USD',
};
