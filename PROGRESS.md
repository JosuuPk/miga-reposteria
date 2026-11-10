# Progreso

## Terminado
- **Día 1 (10 nov 2026):** entorno comprobado (Git 2.55, Node 24.19, npm 11.17). Proyecto Vite + React + TypeScript. Datos de marca, catálogo y reglas. Muestra visual oscura y dinámica según las referencias del usuario. Diez imágenes del usuario (generadas con ChatGPT) conectadas y rotuladas "Imagen ilustrativa".
- **Día 2 (10 nov 2026):** navegación con React Router (`/`, `/catalogo`, `/producto/<id>`, no encontrada). Inicio, catálogo con filtro en la dirección y fichas de producto con tabla de opciones.
- **Día 3 (10 nov 2026):**
  - Configurador en `/armar/<id>` para las tres tortas, con nueve pasos: tamaño, bizcocho, relleno, cobertura, extras, mensaje, fecha, entrega y revisión. Se puede ir a cualquier paso sin perder lo elegido.
  - Lógica sin interfaz en `src/lib/`: `cakeConfig.ts` (estado, compatibilidades, validación de pasos), `pricing.ts` (única función que suma: `computeEstimate`) y `dates.ts` (fechas como `AAAA-MM-DD`, "hoy" en America/Caracas).
  - Compatibilidades: el paso anterior manda. Una opción que choca con algo elegido antes se muestra bloqueada con el motivo; si se cambia una opción anterior, lo incompatible se quita y aparece un aviso con enlace para corregirlo.
  - Resumen con dibujo de la torta en corte, desglose y total. "Requiere cotización" y "Entrega por cotizar" quedan fuera del total y se muestran como "$X + por cotizar".
  - Fecha: calendario con mínimo y máximo, mensajes específicos por cada regla y seis fechas sugeridas que cumplen las reglas.
  - Enlaces: botón "Armar esta torta" en las fichas de torta y "Armar torta" en el menú.

## Comprobado
- `npm run build` compila sin errores.
- `npm test`: 40 pruebas en 3 archivos, todas pasan (importes, estimado, compatibilidades, pasos, fechas y zona horaria).
- En navegador (escritorio), recorrido completo del configurador:
  - Avanzar sin elegir muestra el error del paso.
  - Cambiar a 30 porciones quita el merengue, avisa y bloquea merengue y semidesnuda; pulsar una opción bloqueada no cambia nada.
  - Sumar y quitar extras cambia el total en su importe exacto.
  - "Diseño especial" y "Otra zona" muestran cotización y el total pasa a "+ por cotizar".
  - Fecha vacía, pasada, sin anticipación, domingo, bloqueada (24 dic) y demasiado lejana: cada una con su mensaje.
  - Retiro, entrega con zona, y cambio de modalidad.
  - Mensaje recortado a 40 caracteres con acentos; observaciones con acentos, símbolos y salto de línea.
  - Volver atrás conserva las selecciones.
  - Sin errores de consola durante el recorrido.
- Móvil (375 px): sin desplazamiento horizontal; barra de estimado al pie que se despliega; menú en una línea (se corrigió un salto de línea y el color del botón "Armar torta").
- No comprobado: recorrido completo solo con teclado en el configurador (los controles son radios y casillas nativos y el foco pasa al título del paso, pero no se recorrió paso a paso); lector de pantalla; modo "movimiento reducido".

## Pendiente
- Primer commit: Git no tiene nombre ni correo de autor configurados; falta que el usuario diga cuáles usar.
- Día 4: mensaje de la solicitud (usando `computeEstimate`), copiar, enlace de WhatsApp bien codificado, modo demostración sin número, borrador guardado en el navegador con versión y validación, solicitud simple para postres y bocados, pruebas con navegador.
- Día 5: preguntas frecuentes y condiciones, pulido, README, archivo de configuración de ejemplo, capturas, caso de estudio y preparación para publicar.

## Problemas conocidos
- La revisión termina con un aviso: copiar y abrir WhatsApp llega el Día 4.
- La configuración se pierde al recargar la página (el borrador guardado es del Día 4).
- Postres y bocados aún no tienen forma de solicitarse.
- El calendario nativo no puede deshabilitar domingos ni fechas bloqueadas; se validan al elegir y se ofrecen fechas sugeridas.
- `compartir.webp` sin conectar: og:image necesita la dirección pública del sitio y conviene JPG (Día 5).
- Al publicar hará falta una regla para que el alojamiento sirva `index.html` en cualquier ruta (Día 5).
- En la vista previa integrada las animaciones de entrada no arrancan mientras el panel no está a la vista.

## Próxima acción
Con el visto bueno del usuario al Día 3, empezar el Día 4.
