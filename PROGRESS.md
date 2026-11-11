# Progreso

## Terminado
- **Día 1 (10 nov 2026):** entorno, proyecto Vite + React + TypeScript, datos de marca, catálogo y reglas, muestra visual oscura y dinámica, diez imágenes del usuario conectadas.
- **Día 2:** navegación con React Router, inicio, catálogo con filtro y fichas de producto.
- **Día 3:** configurador de tortas en nueve pasos, compatibilidades, estimado único y fechas en America/Caracas.
- **Día 4:** mensaje de la solicitud, enlace de WhatsApp, modo demostración, borrador guardado y solicitud simple para postres y bocados.
- **Día 5 (11 nov 2026):**
  - Página `/preguntas` con preguntas frecuentes y condiciones del estimado; las respuestas sobre anticipación, días cerrados y zonas se leen de `rules.ts`. Enlaces en el pie.
  - Configuración por variables (`.env.example`): `VITE_WHATSAPP_NUMBER` y `VITE_SITE_URL`. El número ya no se escribe en el código.
  - Preparación para publicar: `public/_redirects`, `vercel.json`, imagen `compartir.jpg` (1200×630) y etiquetas de vista previa que se añaden solo si existe `VITE_SITE_URL`.
  - Documentación: `README.md`, `docs/PUBLICAR.md`, `docs/DATOS_NEGOCIO_REAL.md`, `docs/PRUEBAS.md`, `docs/CASO_DE_ESTUDIO.md`.
  - Ocho capturas para el portafolio en `docs/capturas/`.

- **Publicación (11 nov 2026):** código subido a https://github.com/JosuuPk/miga-reposteria (público). Netlify suspendió la cuenta del usuario al crearla, así que se pasó a GitHub Pages: base `/miga-reposteria/`, `assetUrl` para imágenes, `basename` en el enrutador, copia `404.html` para rutas internas y publicación automática con GitHub Actions.

- **WhatsApp de contacto (11 nov 2026):** botón en la portada, enlace en el pie y burbuja fija abajo a la derecha (`src/components/WhatsAppButton.tsx`), con un saludo corto (`brand.whatsappGreeting`). Usan el número del usuario, definido en `.github/workflows/pages.yml`; sin número no se muestran. En el configurador en móvil la burbuja se oculta para no tapar controles. Con número, la revisión del pedido también muestra "Abrir WhatsApp con la solicitud".

## Comprobado
- Versión de Pages probada en local (`npm run preview:pages`): inicio, catálogo, ficha, configurador y preguntas cargan bajo `/miga-reposteria/`, con imágenes y sin errores de consola.
Detalle completo en `docs/PRUEBAS.md`. En resumen:
- `npm run build` compila sin errores; `npm test` pasa 55 pruebas.
- Recorrido principal en Chromium, en escritorio y móvil, sin errores de consola.
- Movimiento reducido: sin animaciones y con todo el contenido visible (emulado con Playwright).
- Las animaciones de entrada arrancan solas en un navegador normal (Playwright).
- El portapapeles contiene el mensaje mostrado.
- Con `VITE_SITE_URL` definida, el build incluye og:image y canonical; sin ella, no.
- **No probado:** abrir WhatsApp con un número real, Safari y Firefox, teléfonos reales, lectores de pantalla, vista previa al compartir (requiere publicar).

## Pendiente (decisiones del usuario)
- Activar GitHub Pages en el repositorio (Settings > Pages > Source: GitHub Actions) y comprobar el sitio publicado.
- Probar en un teléfono que el botón, la burbuja y la solicitud abren WhatsApp con el mensaje escrito.
- Revisar los textos de demostración (descripciones, preguntas frecuentes, caso de estudio).
- Para un negocio real: completar `docs/DATOS_NEGOCIO_REAL.md`.

## Problemas conocidos
Ver "Limitaciones conocidas" en `docs/PRUEBAS.md`. Además:
- `src/styles/forms.css` incluye la maquetación del configurador junto con los estilos de formulario; funciona, pero convendría separarlo.
- La portada a 1440×900 deja la torta parcialmente bajo el pliegue.

## Próxima acción
Cuando el usuario active Pages, revisar el sitio publicado en https://josuupk.github.io/miga-reposteria/.
