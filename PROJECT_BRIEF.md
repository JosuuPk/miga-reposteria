# Brief del proyecto

## Qué es
Demostración pública para portafolio, adaptable después a un negocio real en Venezuela. El visitante explora productos, arma una torta, ve un precio estimado desglosado, elige fecha y entrega, revisa y copia su solicitud y abre WhatsApp con el mensaje listo. La solicitud siempre queda pendiente de confirmación del negocio.

## Decisiones tomadas (10 nov 2026)
- **Marca:** "Miga", conceptual, en Caracas. Sin número de WhatsApp: modo demostración.
- **Imágenes:** el usuario las generará con ChatGPT siguiendo `docs/IMAGENES.md`. Mientras tanto, marcadores de franjas rotulados "Imagen provisional". Al ser generadas con IA se rotulan "Imagen ilustrativa", no como trabajos reales.
- **Catálogo:** ocho productos de demostración (3 tortas configurables, tres leches, quesillo, cupcakes, galletas decoradas, brownies).
- **Reglas:** 3 días de anticipación, domingos cerrados, fechas bloqueadas de ejemplo, retiro gratis, entrega por zonas con tarifa y una zona "por cotizar".
- **Moneda:** USD, en centavos enteros. Sin conversión a otras monedas.
- **Base técnica:** React + TypeScript + Vite, CSS propio con variables. Sin backend ni base de datos. Fuentes incluidas en el proyecto (sin servicios externos).

## Dirección visual
Cambiada el 10 nov 2026 a petición del usuario, que descartó la versión clara y editorial. Sus referencias (tres pines de Pinterest) son webs oscuras e inmersivas con resplandores difuminados; solo se pudo ver el fotograma de portada de cada video.

- Fondo cacao profundo `#150B08`, texto marfil `#F5EDDD`, frambuesa `#D81E5B` / `#FF5C8A`, caramelo `#E8A93B`.
- Títulos en Bricolage Grotesque (sans expresiva, peso 700–800); texto en Atkinson Hyperlegible Next.
- Portada centrada: luces difuminadas, titular que entra desenfocado, torta en el centro con sus elecciones flotando alrededor (siguen al cursor). Admite una foto (`brand.heroImageSrc`) que se funde con el fondo.
- Menú flotante en cápsula con fondo difuminado. Cinta de sabores en movimiento.
- Catálogo en mosaico de tarjetas de vidrio oscuro que aparecen al hacer scroll y se encienden al pasar el cursor.
- Motivo propio: el **corte de la torta** (franjas = capas), en la portada y en los marcadores de imagen.
- Todo el movimiento se desactiva con "movimiento reducido".

## Alcance de la primera versión
Inicio, catálogo, ficha de producto, configurador de tortas (9 pasos), preguntas frecuentes y condiciones, resumen y apertura de WhatsApp.

Fuera: cuentas, pagos en línea, inventario, reservas automáticas, panel administrativo, chatbot, generación de imágenes dentro de la web, 3D.

## Reglas que no se negocian
- Un único cálculo de total compartido por la interfaz y el mensaje.
- "Requiere cotización" y "Entrega por cotizar" nunca se tratan como $0.
- Validar una fecha no garantiza capacidad de producción.
- No se muestra "pedido enviado" ni "reservado".
- Editar archivos de datos no es un panel para el comerciante: requiere a alguien que edite y publique.

## Plan
1. Brief, reglas y muestra visual. 2. Catálogo y fichas. 3. Configurador, precios y fechas. 4. WhatsApp, pruebas y correcciones. 5. Pulido, documentación y publicación.

## Datos que faltan para un negocio real
Nombre y marca, número de WhatsApp, zona de retiro, productos y precios reales, reglas de compatibilidad, capacidad y anticipación, zonas y tarifas de entrega, condiciones de pago y cancelación, fotografías propias.
