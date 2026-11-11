# Caso de estudio: Miga

Texto base para el portafolio. Ajústalo a tu voz. No contiene resultados comerciales porque no los hay: es una demostración con una marca conceptual.

## Versión corta

**Miga** es una demostración de web para una repostería por encargo en Caracas. El visitante arma su torta capa por capa, ve un precio estimado desglosado mientras elige y termina con una solicitud lista para enviar por WhatsApp. La diseñé y construí en cinco etapas con Claude Code, definiendo el producto, la dirección de arte y las reglas del negocio.

## Versión completa

### El problema

Muchas reposterías pequeñas reciben los pedidos por WhatsApp y repiten las mismas preguntas en cada conversación: para cuántas personas, qué sabor, para cuándo, dónde se entrega. El cliente no sabe cuánto costará hasta el final y el negocio dedica tiempo a pedidos que no se concretan.

### La idea

Una web que ordena esa conversación antes de que empiece. El cliente llega a WhatsApp con la torta definida, un estimado y una fecha que ya cumple las reglas del taller. El negocio sigue confirmando a mano, que es como trabaja.

### Lo que hace

- Catálogo de ocho productos con filtro por tipo y una ficha para cada uno.
- Configurador de tortas en nueve pasos: tamaño, bizcocho, relleno, cobertura, extras, mensaje, fecha, entrega y revisión.
- Estimado en vivo con su desglose, visible durante todo el proceso.
- Reglas de compatibilidad: las combinaciones imposibles se bloquean explicando el motivo.
- Fechas validadas con la hora de Caracas: anticipación mínima, días cerrados y fechas bloqueadas.
- Solicitud completa para copiar o abrir en WhatsApp.
- Borrador guardado en el navegador para no perder la torta al recargar.

### Decisiones de diseño

- **Dirección visual oscura y dinámica.** Fondo cacao profundo, luz frambuesa y caramelo, tipografía gruesa y fotografía sobre negro que se funde con la página. La primera propuesta era clara y editorial; se cambió tras revisar referencias, buscando más movimiento.
- **El corte de la torta como motivo.** Las capas aparecen en la portada y en el resumen del configurador, donde el dibujo cambia de color y de pisos con cada elección.
- **Movimiento con límite.** Luces que respiran, un titular que entra enfocándose, tarjetas que aparecen al hacer scroll. Todo se apaga si la persona tiene activado "reducir movimiento".
- **Móvil primero.** El resumen es una barra al pie que se despliega, para que el total esté siempre a mano sin tapar los controles.

### Decisiones de producto

- **La web no promete lo que no puede cumplir.** No dice "pedido enviado" ni "fecha reservada": abrir WhatsApp no garantiza nada, y la interfaz lo explica.
- **"Requiere cotización" no es gratis.** Lo que no tiene precio fijo queda fuera del total y se muestra como "$73 + por cotizar".
- **Un solo cálculo.** El resumen y el mensaje salen de la misma función, así que no pueden mostrar totales distintos.
- **Contenido separado del diseño.** Productos, precios, opciones y reglas viven en archivos de datos que se editan sin tocar la interfaz.
- **Privacidad por defecto.** Sin cuentas ni servidor; no se pide la dirección y las observaciones no se guardan.

### Cómo se construyó

React, TypeScript y Vite, sin backend. Trabajé con Claude Code por etapas: muestra visual, catálogo, configurador, solicitud y documentación. Yo definí el alcance, las reglas y la dirección de arte, y generé las imágenes; el código lo escribió la IA y lo revisé en cada etapa. La lógica de precios, compatibilidades, fechas y mensaje tiene 55 pruebas automáticas.

### Honestidad sobre el alcance

- Miga no es un negocio real: productos, precios y reglas son de ejemplo.
- Las imágenes son ilustrativas, generadas con IA, y la web las rotula así.
- No hay pagos, cuentas, inventario ni panel de administración.
- No se probó con clientes ni hay métricas de uso.

### Qué haría a continuación

Probarla con una repostería real, sustituir las imágenes por fotografías propias, medir en qué paso se abandona el configurador y valorar un gestor de contenidos para que el negocio actualice precios sin ayuda.

## Capturas

Están en `docs/capturas/`:

| Archivo | Qué muestra |
| --- | --- |
| `01-inicio-escritorio.png` | Portada |
| `02-inicio-completo.png` | Página de inicio entera |
| `03-catalogo.png` | Catálogo completo |
| `04-ficha-producto.png` | Ficha de una torta |
| `05-configurador.png` | Configurador con el resumen |
| `06-revision-solicitud.png` | Revisión y solicitud lista |
| `07-inicio-movil.png` | Portada en móvil |
| `08-configurador-movil.png` | Configurador en móvil |
