# Miga: web de repostería con configurador de pedidos

Demostración de una web para una repostería por encargo. El visitante explora el catálogo, arma una torta paso a paso, ve un precio estimado desglosado, elige fecha y entrega, y obtiene una solicitud lista para enviar por WhatsApp.

**Miga es una marca conceptual.** Los productos, precios, zonas y reglas son de ejemplo, y las imágenes son ilustrativas (generadas con IA). No es un negocio real ni recibe pedidos.

## Qué necesitas

- [Node.js](https://nodejs.org) 20 o superior (se desarrolló con la 24). Incluye npm.
- Git, solo si quieres guardar el historial o publicar desde un repositorio.

## Ponerla en marcha

En una terminal, dentro de la carpeta del proyecto:

```bash
npm install
```

```bash
npm run dev
```

Abre `http://localhost:5173` en el navegador. Los cambios en los archivos se ven al guardar.

| Comando | Para qué sirve |
| --- | --- |
| `npm run dev` | Ver la web en tu equipo mientras la editas. |
| `npm test` | Ejecutar las pruebas automáticas (precios, compatibilidades, fechas, mensaje). |
| `npm run build` | Generar la versión para publicar, en la carpeta `dist`. |
| `npm run preview` | Ver en tu equipo esa versión ya generada. |

## Configuración

Copia `.env.example` como `.env` y rellena lo que necesites. Ninguno de los valores es secreto.

| Variable | Qué hace | Si está vacía |
| --- | --- | --- |
| `VITE_WHATSAPP_NUMBER` | Número del negocio, solo dígitos con código de país. | Modo demostración: se puede revisar y copiar la solicitud, pero no se abre WhatsApp. |
| `VITE_SITE_URL` | Dirección pública del sitio, sin barra final. | No se añade imagen de vista previa al compartir el enlace. |

Después de cambiar `.env`, detén y vuelve a ejecutar `npm run dev`.

## Cómo actualizar el contenido

Todo el contenido está en archivos de datos dentro de `src/data/`. No hace falta tocar el diseño.

| Quiero cambiar... | Archivo |
| --- | --- |
| Nombre de la marca, ciudad, modo demostración, foto de portada | `src/data/brand.ts` |
| Productos, descripciones, precios base, alérgenos, fotos | `src/data/catalog.ts` |
| Tamaños, sabores, rellenos, coberturas, extras y sus precios | `src/data/cakeOptions.ts` |
| Anticipación mínima, días cerrados, fechas bloqueadas | `src/data/rules.ts` |
| Zonas de entrega y tarifas | `src/data/rules.ts` |
| Preguntas frecuentes | `src/pages/FaqPage.tsx` |

Reglas al editar:

- **Los precios van en centavos enteros.** $28 se escribe `2800`; $3,50 se escribe `350`.
- **`null` en un precio significa "Requiere cotización"** (o "Entrega por cotizar" en una zona). No uses `0` para eso: `0` significa incluido o sin costo.
- **Los `id` no se repiten** dentro de `cakeOptions.ts`, ni entre grupos distintos. Si cambias o borras un `id`, revisa que no aparezca en `notWith` ni en `cakePreset` (en `catalog.ts`).
- **Incompatibilidades:** en una opción, `notWith: ['otro-id']` impide combinarla con esa otra. Basta escribirlo en una de las dos.
- **Fechas:** siempre como `'AAAA-MM-DD'`. Los días de la semana van de `0` (domingo) a `6` (sábado).
- Después de editar, ejecuta `npm test` y `npm run build`. Si algo quedó mal escrito, uno de los dos lo avisa.

### Cambiar una imagen

1. Guarda la nueva con el mismo nombre en `public/images/productos/` (o `public/images/portada.webp` para la portada).
2. Si cambia el nombre o el tamaño, actualiza `src`, `width` y `height` del producto en `catalog.ts`.
3. Anota de dónde salió en `docs/IMAGENES.md`.

Mientras `isDemo` sea `true`, las fotos llevan la etiqueta "Imagen ilustrativa". Para un negocio real, usa fotos propias de sus productos.

### Limitación importante

Editar estos archivos **no es un panel de administración**. Cada cambio requiere que alguien edite el archivo, compruebe que compila y vuelva a publicar la web. El comerciante no puede cambiar un precio desde el teléfono. Si eso hace falta, es un proyecto aparte (un gestor de contenidos o un panel con base de datos).

## Cómo está organizado

```text
src/
  data/        Contenido: marca, catálogo, opciones de torta, reglas
  lib/         Lógica sin interfaz: precios, compatibilidades, fechas, mensaje, borrador
  pages/       Una página por ruta (inicio, catálogo, ficha, configurador, preguntas)
  components/  Piezas visuales, cada una con su CSS
  styles/      Colores y tipografía (tokens.css), base y formularios
public/images/ Fotografías
docs/          Guías: imágenes, pruebas, publicación, datos pendientes, caso de estudio
```

Dos decisiones que conviene respetar:

- **Un solo cálculo de precios.** `src/lib/pricing.ts` es el único lugar donde se suman importes. El resumen en pantalla y el mensaje de WhatsApp lo usan, así que nunca difieren.
- **Fechas en hora de Caracas.** "Hoy" se calcula en `America/Caracas` aunque el visitante esté en otro país.

## Qué hace y qué no

Hace: catálogo, fichas, configurador de tortas en nueve pasos, estimado desglosado, validación de fechas, solicitud por WhatsApp, borrador guardado en el navegador.

No hace: cuentas de cliente, pagos en línea, inventario, reservas automáticas, panel de administración. La web **no sabe si el mensaje se envió** ni reserva nada: la solicitud queda pendiente hasta que el negocio la confirma por WhatsApp.

## Más documentación

- [docs/PUBLICAR.md](docs/PUBLICAR.md): cómo publicarla y qué cuesta.
- [docs/DATOS_NEGOCIO_REAL.md](docs/DATOS_NEGOCIO_REAL.md): lo que falta para usarla con un negocio real.
- [docs/PRUEBAS.md](docs/PRUEBAS.md): qué se probó y qué no.
- [docs/IMAGENES.md](docs/IMAGENES.md): imágenes y su procedencia.
- [docs/CASO_DE_ESTUDIO.md](docs/CASO_DE_ESTUDIO.md): texto para el portafolio.
