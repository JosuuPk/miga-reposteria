# Progreso

## Terminado
- **Día 1 (10 nov 2026):** entorno comprobado (Git 2.55, Node 24.19, npm 11.17). Proyecto Vite + React + TypeScript. Datos de marca, catálogo y reglas. Muestra visual oscura y dinámica según las referencias del usuario. Diez imágenes del usuario (generadas con ChatGPT) conectadas y rotuladas "Imagen ilustrativa".
- **Día 2:** navegación con React Router (`/`, `/catalogo`, `/producto/<id>`, no encontrada). Inicio, catálogo con filtro en la dirección y fichas de producto.
- **Día 3:** configurador en `/armar/<id>` con nueve pasos, compatibilidades, estimado único (`computeEstimate`) y fechas en America/Caracas.
- **Día 4:**
  - Mensaje de la solicitud (`src/lib/request.ts`): producto, opciones, porciones, texto sobre la torta, fecha, modalidad y zona, desglose, observaciones y aclaración de que requiere confirmación. El desglose sale del mismo cálculo que la pantalla.
  - Enlace de WhatsApp con `encodeURIComponent`. Sin número válido en `brand.ts` devuelve `null` y la web queda en modo demostración: se puede revisar y copiar, no se abre WhatsApp.
  - Panel "Tu solicitud" al final de la revisión: vista previa, "Copiar solicitud" y aviso. Nunca dice que algo se envió, reservó o pagó.
  - Borrador en `localStorage` (`src/lib/draft.ts`): con versión, validado al cargar (`restoreConfig`), caduca a los 7 días. No guarda las observaciones. Aviso al recuperarlo, con "Empezar de cero".
  - Solicitud simple para postres y bocados en su ficha: cantidad, fecha, entrega, observaciones y estimado. Los productos con precio "desde" dejan la personalización por cotizar.
  - Los campos de fecha y entrega se comparten entre configurador y solicitud simple (`src/components/request/Fields.tsx`); los estilos de formulario pasaron a `src/styles/forms.css`.

## Comprobado
- `npm run build` compila sin errores.
- `npm test`: 55 pruebas en 4 archivos, todas pasan. Incluyen el contenido del mensaje, que su total coincide con el resumen, la codificación del enlace (ida y vuelta con acentos, saltos de línea y símbolos), el modo demostración sin número y la restauración de borradores dañados o incompatibles.
- En navegador (escritorio):
  - Configuración completa hasta la revisión; el mensaje mostrado contiene todo y su total ($53) coincide con el resumen.
  - Modo demostración: no aparece enlace a WhatsApp y se muestra el aviso.
  - "Copiar solicitud" informa "Solicitud copiada". No se pudo leer el portapapeles desde la prueba para comprobar su contenido (permiso denegado en el panel).
  - Borrador: al recargar se recupera todo salvo las observaciones; "Empezar de cero" lo borra; un borrador dañado se ignora sin errores.
  - Solicitud simple: cantidad, errores específicos al preparar sin fecha ni entrega, mensaje final.
  - Teclado en el configurador: espacio y flechas en las opciones, tabulador hasta "Siguiente", Enter avanza y el foco pasa al título del paso; el contorno de foco es visible.
  - Sin errores de consola durante el recorrido.
- Móvil (375 px): ficha con solicitud simple y configurador sin desplazamiento horizontal.
- Días anteriores: cambio de tamaño con opciones incompatibles, extras, cotizaciones, fechas pasadas, sin anticipación, cerradas y bloqueadas, retiro y entrega (ver historial de Git).
- **No comprobado:** abrir WhatsApp de verdad (no hay número real; el enlace solo se probó con pruebas automáticas); contenido real del portapapeles; lector de pantalla; modo "movimiento reducido"; navegadores distintos del panel integrado (Chromium).

## Pendiente
- Día 5: preguntas frecuentes y condiciones, pulido, README con instalación y actualización, archivo de configuración de ejemplo, registro de pruebas y limitaciones, lista de datos para un negocio real, capturas, caso de estudio y preparación para publicar (regla de rutas, og:image, costos y pasos).

## Problemas conocidos
- El calendario nativo no puede deshabilitar domingos ni fechas bloqueadas; se validan al elegir y se ofrecen fechas sugeridas.
- La solicitud simple no guarda borrador (solo el configurador).
- `compartir.webp` sin conectar: og:image necesita la dirección pública del sitio y conviene JPG.
- Al publicar hará falta una regla para que el alojamiento sirva `index.html` en cualquier ruta.
- En la vista previa integrada las animaciones de entrada no arrancan mientras el panel no está a la vista.
- `src/styles/forms.css` todavía incluye la maquetación del configurador (viene del antiguo `ConfiguratorPage.css`); funciona, pero se puede separar en el pulido.

## Próxima acción
Con el visto bueno del usuario al Día 4, empezar el Día 5.
