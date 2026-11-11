// Direcciones de archivos públicos (imágenes). El sitio puede publicarse en la raíz
// de un dominio ("/") o en una subcarpeta ("/miga-reposteria/", como en GitHub Pages).
// Vite expone esa base en BASE_URL; aquí se antepone a las rutas de los datos.

const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** "/images/x.webp" -> "/miga-reposteria/images/x.webp" cuando hay subcarpeta. */
export function assetUrl(path: string): string {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Base para el enrutador, sin barra final ("" en la raíz). */
export const routerBase = base;
