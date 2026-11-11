# Miga: web de repostería (demostración)

Web de repostería con configurador de tortas y solicitud por WhatsApp. React + TypeScript + Vite, sin backend.

- Alcance y decisiones: `PROJECT_BRIEF.md`. Estado y próxima acción: `PROGRESS.md`. Léelos antes de trabajar.
- Comandos: `npm run dev` (puerto 5173), `npm run build`, `npm test` (Vitest).
- `computeEstimate` (`src/lib/pricing.ts`) es la única función que suma precios; el mensaje de WhatsApp debe usarla. Los ids de `cakeOptions.ts` son únicos en todo el archivo.
- Datos separados del diseño: `src/data/` (marca, catálogo, opciones de torta, reglas). Lógica en `src/lib/`. Páginas en `src/pages/` (rutas en `src/App.tsx`, React Router). Componentes en `src/components/`, cada uno con su CSS. Tokens en `src/styles/tokens.css`.
- Diseño oscuro y dinámico; todo movimiento debe apagarse con `prefers-reduced-motion`.
- Importes siempre en centavos enteros de USD; se muestran con `formatUsd`.
- Fechas en `America/Caracas`, como texto `AAAA-MM-DD`.
- Textos de la interfaz en español. Nada de testimonios, cifras ni fotos presentadas como reales.
- Configuración por variables `VITE_*` (`.env.example`); el número de WhatsApp no se escribe en el código. Guías en `docs/` y `README.md`.
- Publicada en GitHub Pages bajo `/miga-reposteria/`: las rutas de imágenes pasan por `assetUrl` (`src/lib/assetUrl.ts`); no escribir `/images/...` directo en componentes.
- Sin número de WhatsApp configurado, la web queda en modo demostración. Nunca mostrar que una solicitud se envió, reservó o pagó. No inventar un número.
- El borrador (`src/lib/draft.ts`) no guarda observaciones ni datos personales; si cambia la forma de `CakeConfig`, subir `CONFIG_VERSION`.
- No añadir dependencias, servicios ni claves sin acordarlo con el usuario (no programa: explicar en breve).
