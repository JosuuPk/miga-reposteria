# Publicar la web

La web es un sitio estático: al ejecutar `npm run build` se genera la carpeta `dist`, y eso es todo lo que hay que alojar. No necesita servidor propio ni base de datos.

El código está en GitHub y la publicación es automática. Solo falta activarla una vez (ver "Activarlo").

## Qué está preparado

- Publicación automática en GitHub Pages (`.github/workflows/pages.yml`).
- `public/_redirects` y `vercel.json`, por si más adelante se cambia a Netlify, Cloudflare Pages o Vercel.
- Imagen de vista previa (`public/images/compartir.jpg`, 1200×630). Se activa al definir `VITE_SITE_URL`.
- Variables de configuración documentadas en `.env.example`.

## Dónde está alojada: GitHub Pages

Se eligió GitHub Pages porque es gratuito para repositorios públicos, no usa créditos y no requiere otra cuenta. (Netlify se descartó: suspendió la cuenta al crearla, el 11 nov 2026.)

- Repositorio: https://github.com/JosuuPk/miga-reposteria
- Dirección del sitio: https://josuupk.github.io/miga-reposteria/

### Cómo funciona

El archivo `.github/workflows/pages.yml` hace todo cada vez que se suben cambios a la rama `main`: instala, ejecuta las pruebas, genera el sitio y lo publica. Si una prueba falla, no se publica. El avance se ve en la pestaña **Actions** del repositorio.

Dos ajustes propios de GitHub Pages, ya incluidos:

- **Subcarpeta.** El sitio vive en `/miga-reposteria/`, no en la raíz. Por eso se genera con `npm run build:pages`, y las imágenes y los enlaces usan esa base (`src/lib/assetUrl.ts`).
- **Rutas internas.** GitHub Pages no tiene reglas de redirección, así que se publica una copia de la página principal como `404.html`. Con eso, abrir `/producto/quesillo` directamente carga la web. Efecto secundario: esas direcciones responden con código 404 aunque se vean bien, lo que puede afectar a buscadores y a la vista previa al compartir enlaces internos. La portada no tiene ese problema.

### Activarlo (una sola vez)

1. En el repositorio, entra en **Settings** y luego en **Pages**.
2. En **Build and deployment**, en **Source**, elige **GitHub Actions**.
3. Ve a la pestaña **Actions**, abre la última ejecución de "Publicar en GitHub Pages" y pulsa **Re-run all jobs** (o sube cualquier cambio).

### Si cambias el nombre del repositorio

Hay que cambiar `miga-reposteria` en tres sitios: los scripts `build:pages` y `preview:pages` de `package.json`, y `VITE_SITE_URL` en `.github/workflows/pages.yml`.

### Probar esa versión en tu equipo

```bash
npm run build:pages
```

```bash
npm run preview:pages
```

Y abre `http://localhost:4173/miga-reposteria/`.

## Otras opciones de alojamiento

El proyecto también está preparado para servicios que publican en la raíz de un dominio y sí admiten reglas de rutas (`public/_redirects` y `vercel.json`). En ellos se usa `npm run build` y la carpeta `dist`. **Los planes cambian: confirma el precio en la página oficial.**

| Servicio | Página de precios |
| --- | --- |
| Cloudflare Pages | https://pages.cloudflare.com/ |
| Vercel (plan gratuito solo para uso personal) | https://vercel.com/pricing |
| Netlify (plan Free de $0 con 300 créditos al mes, según su página el 11 nov 2026) | https://www.netlify.com/pricing/ |

## Costos a prever

| Concepto | Costo |
| --- | --- |
| GitHub Pages con repositorio público | $0 |
| Dirección `josuupk.github.io/miga-reposteria` | $0 |
| Dominio propio (`.com` u otro) | Pago anual al registrador; depende de la extensión. Opcional para un portafolio. |
| WhatsApp | La web solo abre un enlace público `wa.me`; no usa la API de pago de WhatsApp Business. |

No hay otros servicios de pago, claves ni integraciones.

## Comprobar después de publicar

- [ ] Abrir directamente `/miga-reposteria/catalogo`, `/miga-reposteria/producto/quesillo` y `/miga-reposteria/armar/torta-a-medida`, y recargar: deben mostrar la web.
- [ ] Completar una torta hasta la revisión en un teléfono real.
- [ ] Pegar el enlace del sitio en un chat de WhatsApp y ver que aparece la imagen de vista previa. WhatsApp guarda la vista previa; si no aparece a la primera, prueba con otro chat o más tarde.
- [ ] Confirmar que el aviso de demostración sigue visible.

## Antes de usarla con un negocio real

Completa primero [DATOS_NEGOCIO_REAL.md](DATOS_NEGOCIO_REAL.md). En particular: no definas `VITE_WHATSAPP_NUMBER` ni pongas `isDemo: false` hasta que productos, precios, reglas y fotos sean los del negocio.
