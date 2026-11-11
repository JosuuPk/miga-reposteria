# Datos que faltan para operar con un negocio real

Todo lo que hoy es de demostración y dónde se cambia. Hasta completar esta lista, la web debe seguir en modo demostración.

## Marca y contacto (`src/data/brand.ts`, `.env`)

- [ ] Nombre comercial y, si existe, logotipo.
- [ ] Ciudad y zona de retiro. Decidir si se publica la dirección o solo la zona.
- [ ] Número de WhatsApp del negocio (`VITE_WHATSAPP_NUMBER`). Confirmar que es una línea que alguien atiende.
- [ ] Horario de atención de WhatsApp, para decirlo en la web.
- [ ] Cambiar `isDemo` a `false`. Esto quita el aviso de demostración y las etiquetas "Imagen ilustrativa".

## Catálogo (`src/data/catalog.ts`)

- [ ] Lista real de productos, con nombres y descripciones propias.
- [ ] Precio base de cada uno y a qué cantidad corresponde.
- [ ] Alérgenos verificados por el negocio para cada receta. Los actuales son de ejemplo y no deben usarse.
- [ ] Conservación y duración de cada producto.

## Opciones de torta (`src/data/cakeOptions.ts`)

- [ ] Tamaños que se ofrecen, porciones reales y precio de cada uno.
- [ ] Bizcochos, rellenos, coberturas y extras disponibles, con su precio.
- [ ] Qué combinaciones no se pueden hacer y por qué. Las tres reglas actuales son supuestos de la demostración.
- [ ] Qué se cotiza siempre a mano (diseños especiales, tamaños grandes).
- [ ] Límite real del texto sobre la torta.

## Fechas y capacidad (`src/data/rules.ts`)

- [ ] Anticipación mínima real, y si varía según el producto o el tamaño.
- [ ] Días de la semana sin producción ni entregas.
- [ ] Fechas bloqueadas: vacaciones, feriados, días ya completos. Alguien debe mantener esta lista al día.
- [ ] Con cuánta anticipación máxima se aceptan solicitudes.

La web no conoce la capacidad de producción. Si un día se llena, hay que añadirlo a mano a las fechas bloqueadas.

## Entrega (`src/data/rules.ts`)

- [ ] Zonas donde se entrega y tarifa de cada una.
- [ ] Horarios de retiro y de entrega.
- [ ] Qué pasa con las zonas fuera de la lista.

## Condiciones (`src/pages/FaqPage.tsx`)

- [ ] Formas de pago aceptadas y moneda. Hoy la web muestra solo USD y no hace conversiones: para mostrar bolívares haría falta acordar una regla y una fuente de la tasa.
- [ ] Anticipo o abono para reservar, si lo hay.
- [ ] Política de cambios, cancelaciones y devoluciones.
- [ ] Revisar las preguntas frecuentes con el negocio: hoy describen el funcionamiento de la demostración.

## Fotografías (`public/images/`, `docs/IMAGENES.md`)

- [ ] Fotos propias de los productos reales, con luz y encuadre coherentes. Las actuales son generadas con IA y no pueden presentarse como trabajos del negocio.
- [ ] Permiso de uso de cada foto y registro de su procedencia.

## Legal y operación

- [ ] Datos legales que el negocio deba mostrar y permisos sanitarios que apliquen. Conviene consultarlo con quien asesore al negocio.
- [ ] Quién actualiza precios y fechas, y cómo. Recordatorio: no hay panel de administración; cada cambio requiere editar archivos y volver a publicar.
- [ ] Dominio propio, si se quiere.
