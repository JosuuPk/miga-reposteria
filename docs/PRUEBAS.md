# Registro de pruebas y limitaciones

Última actualización: 11 de noviembre de 2026.

## Pruebas automáticas

`npm test` ejecuta 55 pruebas en 4 archivos. Todas pasan.

| Archivo | Qué cubre |
| --- | --- |
| `src/lib/pricing.test.ts` | Formato de importes en centavos; total con base, adicionales, extras y entrega; sumar y quitar extras; opciones por cotizar; retiro sin costo; zona sin tarifa. |
| `src/lib/cakeConfig.test.ts` | Incompatibilidades en ambos sentidos; opciones bloqueadas; limpieza al cambiar el tamaño o el relleno; combinaciones de la casa válidas; extras; límite del mensaje; validación de cada paso. |
| `src/lib/dates.test.ts` | "Hoy" en hora de Caracas cuando en UTC ya es el día siguiente; fechas vacías, imposibles, pasadas, sin anticipación, en día cerrado, bloqueadas y demasiado lejanas; fechas sugeridas. |
| `src/lib/request.test.ts` | Contenido del mensaje; que su total coincide con el estimado; observaciones con saltos de línea y símbolos; solicitud simple; enlace de WhatsApp codificado y decodificado sin pérdidas; modo demostración sin número; borradores dañados, de otra versión o con combinaciones incompatibles. |

## Pruebas con navegador

Hechas en Chromium, con el panel integrado de la aplicación y con Playwright, a tamaño de escritorio (1280 y 1440 px) y de móvil (375 y 390 px).

| Caso | Resultado |
| --- | --- |
| Configuración completa de una torta hasta la revisión | Pasa |
| Avanzar sin elegir muestra el error del paso | Pasa |
| Cambiar a 30 porciones quita el merengue, avisa y bloquea las coberturas incompatibles | Pasa |
| Pulsar una opción bloqueada no cambia nada | Pasa |
| Sumar y quitar extras cambia el total en su importe exacto | Pasa |
| "Diseño especial" y "Otra zona" muestran cotización y el total pasa a "+ por cotizar" | Pasa |
| Fecha vacía, pasada, sin anticipación, domingo, bloqueada y demasiado lejana | Pasa: cada una con su mensaje |
| Retiro, entrega con zona y cambio de modalidad | Pasa |
| Mensaje sobre la torta recortado a 40 caracteres, con acentos | Pasa |
| Observaciones con acentos, símbolos y salto de línea | Pasa |
| El total del mensaje coincide con el del resumen | Pasa |
| "Copiar solicitud": el portapapeles contiene el mensaje mostrado | Pasa (en Windows los saltos de línea se copian como CRLF, que es lo normal) |
| Modo demostración: sin enlace a WhatsApp y con aviso | Pasa |
| Recuperación del borrador al recargar, sin las observaciones | Pasa |
| "Empezar de cero" borra el borrador; un borrador dañado se ignora | Pasa |
| Solicitud simple de postres y bocados | Pasa |
| Catálogo: filtro por tipo y dirección compartible | Pasa |
| Producto o página inexistente | Pasa: página de "no encontrada" |
| Teclado: tabulador, espacio y flechas en opciones, Enter para avanzar, foco visible | Pasa (recorrido parcial: pasos 1 y 2 del configurador y navegación general) |
| Sin desplazamiento horizontal en móvil | Pasa en inicio, catálogo, fichas, configurador y preguntas |
| Movimiento reducido: sin animaciones y con todo el contenido visible | Pasa |
| Las animaciones de entrada arrancan solas al cargar | Pasa |
| Sin errores de consola en el recorrido principal | Pasa |

## No probado

- **Abrir WhatsApp de verdad.** Desde el 11 nov 2026 el sitio usa el número del autor como contacto de la demostración. Se comprobó que los enlaces apuntan a ese número con el mensaje bien codificado, pero no se pulsaron para no enviar mensajes: falta probarlo en un teléfono.
- **Otros navegadores.** Todo se probó en Chromium. Falta Safari (iPhone) y Firefox; el punto más sensible es el selector de fecha, que cada navegador dibuja a su manera.
- **Teléfonos reales.** Los tamaños de móvil se emularon en el ordenador.
- **Lectores de pantalla.** Se usaron controles nativos, etiquetas y regiones de aviso, pero no se probó con NVDA, VoiceOver ni TalkBack.
- **Recorrido completo solo con teclado** de los nueve pasos, de principio a fin.
- **Contraste medido** con una herramienta. Los colores se eligieron con contraste alto, pero no se auditaron.
- **Vista previa al compartir** en WhatsApp u otras redes: requiere el sitio publicado.
- **Rendimiento** con una conexión lenta.

## Limitaciones conocidas

- El calendario nativo no puede deshabilitar domingos ni fechas bloqueadas. Se validan al elegir y se ofrecen seis fechas sugeridas que cumplen las reglas.
- La web no conoce la capacidad de producción: una fecha válida no garantiza cupo.
- No se puede saber si el visitante envió el mensaje en WhatsApp.
- La solicitud simple (postres y bocados) no guarda borrador; solo lo hace el configurador.
- El borrador vive en el navegador: no pasa de un dispositivo a otro y se pierde si se borran los datos del sitio.
- Solo hay un producto por solicitud; no existe carrito.
- Los precios se muestran únicamente en USD.
- Actualizar contenido requiere editar archivos y volver a publicar; no hay panel de administración.
- En el panel de vista previa de la aplicación de escritorio, las animaciones de entrada no arrancan mientras el panel no está a la vista. En un navegador normal sí arrancan.
