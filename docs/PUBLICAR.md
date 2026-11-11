# Publicar la web

La web es un sitio estático: al ejecutar `npm run build` se genera la carpeta `dist`, y eso es todo lo que hay que alojar. No necesita servidor propio ni base de datos.

**Nada de esto se ha hecho todavía.** No se creó ninguna cuenta ni se publicó nada. Estos son los pasos para cuando decidas hacerlo.

## Qué está preparado

- `public/_redirects` y `vercel.json`: hacen que direcciones como `/producto/quesillo` funcionen al abrirlas directamente o al recargar. El primero sirve en Netlify y Cloudflare Pages; el segundo en Vercel.
- Imagen de vista previa (`public/images/compartir.jpg`, 1200×630). Se activa al definir `VITE_SITE_URL`.
- Variables de configuración documentadas en `.env.example`.

## Dónde alojarla

Estos servicios alojan sitios estáticos y, según la información con la que se escribió esta guía, ofrecen un plan gratuito suficiente para una demostración de portafolio. **Los planes y límites cambian: confirma el precio en la página oficial antes de elegir.**

| Servicio | Regla de rutas incluida | Página de precios |
| --- | --- | --- |
| Netlify | Sí (`_redirects`) | https://www.netlify.com/pricing/ |
| Cloudflare Pages | Sí (`_redirects`) | https://pages.cloudflare.com/ |
| Vercel | Sí (`vercel.json`) | https://vercel.com/pricing |
| GitHub Pages | No: requiere un ajuste adicional para las rutas | https://docs.github.com/pages |

Para un negocio real, revisa además las condiciones de uso comercial del plan gratuito de cada servicio.

## Costos a prever

| Concepto | Costo |
| --- | --- |
| Alojamiento con plan gratuito | $0, mientras el tráfico sea bajo. Por confirmar en cada servicio. |
| Dirección gratuita del servicio (`algo.netlify.app`, `algo.pages.dev`, `algo.vercel.app`) | $0 |
| Dominio propio (`.com` u otro) | Pago anual al registrador; depende de la extensión. Opcional para un portafolio. |
| WhatsApp | La web solo abre un enlace público `wa.me`; no usa la API de pago de WhatsApp Business. |

No hay otros servicios de pago, claves ni integraciones.

## Pasos

1. **Sube el código a GitHub.** Crea un repositorio vacío en tu cuenta y sigue las instrucciones que muestra para subir un repositorio existente. El proyecto ya tiene su historial en Git.
2. **Crea una cuenta** en el servicio que elijas e importa el repositorio.
3. **Indica cómo se genera el sitio:**
   - Comando de build: `npm run build`
   - Carpeta de salida: `dist`
4. **Define las variables** en el panel del servicio (Environment variables):
   - `VITE_SITE_URL`: la dirección que te asigne el servicio, sin barra final.
   - `VITE_WHATSAPP_NUMBER`: déjala vacía para mantener el modo demostración.
5. **Publica** y abre la dirección.

## Comprobar después de publicar

- [ ] Abrir directamente `/catalogo`, `/producto/quesillo` y `/armar/torta-a-medida`, y recargar: deben cargar, no dar error 404.
- [ ] Completar una torta hasta la revisión en un teléfono real.
- [ ] Pegar el enlace del sitio en un chat de WhatsApp y ver que aparece la imagen de vista previa. WhatsApp guarda la vista previa; si no aparece a la primera, prueba con otro chat o más tarde.
- [ ] Confirmar que el aviso de demostración sigue visible.

## Antes de usarla con un negocio real

Completa primero [DATOS_NEGOCIO_REAL.md](DATOS_NEGOCIO_REAL.md). En particular: no definas `VITE_WHATSAPP_NUMBER` ni pongas `isDemo: false` hasta que productos, precios, reglas y fotos sean los del negocio.
