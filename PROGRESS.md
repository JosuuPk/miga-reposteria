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

## Comprobado
Detalle completo en `docs/PRUEBAS.md`. En resumen:
- `npm run build` compila sin errores; `npm test` pasa 55 pruebas.
- Recorrido principal en Chromium, en escritorio y móvil, sin errores de consola.
- Movimiento reducido: sin animaciones y con todo el contenido visible (emulado con Playwright).
- Las animaciones de entrada arrancan solas en un navegador normal (Playwright).
- El portapapeles contiene el mensaje mostrado.
- Con `VITE_SITE_URL` definida, el build incluye og:image y canonical; sin ella, no.
- **No probado:** abrir WhatsApp con un número real, Safari y Firefox, teléfonos reales, lectores de pantalla, vista previa al compartir (requiere publicar).

## Pendiente (decisiones del usuario)
- Publicar: elegir alojamiento, subir el repositorio a GitHub y seguir `docs/PUBLICAR.md`. No se creó ninguna cuenta ni se publicó nada.
- Probar el enlace de WhatsApp con un número real.
- Revisar los textos de demostración (descripciones, preguntas frecuentes, caso de estudio).
- Para un negocio real: completar `docs/DATOS_NEGOCIO_REAL.md`.

## Problemas conocidos
Ver "Limitaciones conocidas" en `docs/PRUEBAS.md`. Además:
- `src/styles/forms.css` incluye la maquetación del configurador junto con los estilos de formulario; funciona, pero convendría separarlo.
- La portada a 1440×900 deja la torta parcialmente bajo el pliegue.

## Próxima acción
Esperar a que el usuario decida si publica y dónde.
