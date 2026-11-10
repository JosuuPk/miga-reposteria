// Catálogo de demostración. Todos los precios están en centavos enteros de USD.
// Para cambiar un producto, edita su entrada; para cambiar una foto, sustituye el
// archivo en public/images/productos/ (ver docs/IMAGENES.md).

export type ProductFamily = 'torta' | 'postre' | 'bocado';

export const familyLabels: Record<ProductFamily, string> = {
  torta: 'Tortas',
  postre: 'Postres',
  bocado: 'Bocados',
};

export type ProductImage = {
  /** Ruta pública de la foto, o null para mostrar el marcador provisional. */
  src: string | null;
  alt: string;
  width: number;
  height: number;
  /** Colores de las franjas del marcador provisional (de arriba hacia abajo). */
  placeholderTones: string[];
};

/** Combinación con la que arranca el configurador para una torta (ids de cakeOptions.ts). */
export type CakePreset = {
  flavorId: string;
  fillingId: string;
  coveringId: string;
};

export type Product = {
  /** Identificador único; también es la dirección de la ficha: /producto/<id>. */
  id: string;
  name: string;
  family: ProductFamily;
  /** Frase corta para tarjetas. */
  summary: string;
  /** Texto de la ficha de producto. */
  description: string;
  /** Datos prácticos que se muestran como lista en la ficha. */
  details: string[];
  /** Alérgenos principales (demostración; un negocio real debe verificarlos). */
  allergens: string[];
  /** Precio base en centavos de USD. */
  basePriceCents: number;
  /** true si el precio final depende de las opciones elegidas ("Desde"). */
  priceIsStartingAt: boolean;
  /** Unidad a la que se refiere el precio base. */
  unitLabel: string;
  /** Solo para tortas: combinación inicial del configurador. */
  cakePreset?: CakePreset;
  image: ProductImage;
};

const VAINILLA = '#E3C78D';
const CHOCOLATE = '#5A3423';
const CREMA = '#F0E2C6';
const FRAMBUESA = '#B0123F';
const PARCHITA = '#E8A93B';
const ZANAHORIA = '#C9772E';
const CARAMELO = '#A8652B';
const CANELA = '#8A5A3A';
const ROSA = '#EFC9CC';

export const products: Product[] = [
  {
    id: 'torta-a-medida',
    name: 'Torta a tu medida',
    family: 'torta',
    summary:
      'Tú eliges el tamaño, el bizcocho, el relleno y la cobertura. Te mostramos el estimado mientras la armas.',
    description:
      'Empieza en blanco y decide cada capa. Es la opción para cumpleaños, aniversarios y cualquier celebración donde quieras una torta pensada para ti.',
    details: [
      'Desde 8 hasta 30 porciones; para más, se cotiza',
      'Mensaje sobre la torta incluido',
      'Se entrega refrigerada; sácala 30 minutos antes de servir',
    ],
    allergens: ['Gluten', 'Huevo', 'Lácteos'],
    basePriceCents: 2800,
    priceIsStartingAt: true,
    unitLabel: '8 porciones',
    cakePreset: { flavorId: 'vainilla', fillingId: 'frambuesa', coveringId: 'crema-mantequilla' },
    image: {
      src: '/images/productos/torta-a-medida.webp',
      alt: 'Torta de dos pisos con cobertura clara, frambuesas frescas y flores comestibles',
      width: 1024,
      height: 1536,
      placeholderTones: [CREMA, VAINILLA, FRAMBUESA, VAINILLA, FRAMBUESA, VAINILLA],
    },
  },
  {
    id: 'torta-chocolate-parchita',
    name: 'Chocolate y parchita',
    family: 'torta',
    summary: 'Bizcocho húmedo de cacao con crema de parchita y ganache oscuro.',
    description:
      'El amargo del cacao con la acidez de la parchita. Viene con esta combinación lista, pero puedes cambiar el tamaño, la cobertura y los extras.',
    details: [
      'Combinación de la casa: cacao, crema de parchita y ganache oscuro',
      'Salsa de parchita con semillas por encima',
      'Se entrega refrigerada; sácala 30 minutos antes de servir',
    ],
    allergens: ['Gluten', 'Huevo', 'Lácteos'],
    basePriceCents: 3200,
    priceIsStartingAt: true,
    unitLabel: '8 porciones',
    cakePreset: { flavorId: 'chocolate', fillingId: 'parchita', coveringId: 'ganache-oscuro' },
    image: {
      src: '/images/productos/torta-chocolate-parchita.webp',
      alt: 'Torta de chocolate con ganache oscuro y salsa de parchita, con una porción cortada',
      width: 1536,
      height: 1024,
      placeholderTones: [CHOCOLATE, PARCHITA, CHOCOLATE, PARCHITA, CHOCOLATE],
    },
  },
  {
    id: 'torta-zanahoria',
    name: 'Zanahoria y queso crema',
    family: 'torta',
    summary: 'Con nueces tostadas, canela y una cobertura de queso crema poco dulce.',
    description:
      'Bizcocho especiado y húmedo, con zanahoria rallada y nueces. La dejamos sin cubrir por los lados para que se vean las capas.',
    details: [
      'Combinación de la casa: zanahoria y nuez con queso crema',
      'Acabado semidesnudo, con nueces tostadas arriba',
      'Se entrega refrigerada; sácala 30 minutos antes de servir',
    ],
    allergens: ['Gluten', 'Huevo', 'Lácteos', 'Frutos secos'],
    basePriceCents: 3000,
    priceIsStartingAt: true,
    unitLabel: '8 porciones',
    cakePreset: { flavorId: 'zanahoria', fillingId: 'queso-crema', coveringId: 'semidesnuda' },
    image: {
      src: '/images/productos/torta-zanahoria.webp',
      alt: 'Torta de zanahoria de tres capas con queso crema y nueces',
      width: 1536,
      height: 1024,
      placeholderTones: [CREMA, ZANAHORIA, CREMA, ZANAHORIA],
    },
  },
  {
    id: 'tres-leches',
    name: 'Tres leches',
    family: 'postre',
    summary: 'Bizcocho empapado y merengue tostado, en bandeja para compartir.',
    description:
      'Bizcocho de vainilla empapado en tres leches, cubierto con merengue tostado al momento y un toque de canela.',
    details: [
      'Bandeja de 10 porciones',
      'Mantener refrigerado; consumir en 3 días',
      'La bandeja es retornable o se cobra aparte al confirmar',
    ],
    allergens: ['Gluten', 'Huevo', 'Lácteos'],
    basePriceCents: 2400,
    priceIsStartingAt: false,
    unitLabel: 'bandeja de 10 porciones',
    image: {
      src: '/images/productos/tres-leches.webp',
      alt: 'Bandeja de tres leches con merengue tostado y canela',
      width: 1254,
      height: 1254,
      placeholderTones: [CANELA, CREMA, VAINILLA],
    },
  },
  {
    id: 'quesillo',
    name: 'Quesillo',
    family: 'postre',
    summary: 'El de siempre: firme, con caramelo oscuro y un toque de ron.',
    description:
      'Quesillo venezolano hecho a baño de María, con sus huequitos y un caramelo oscuro que no empalaga.',
    details: [
      'Molde de 8 porciones',
      'Lleva un toque de ron; pídelo sin ron en las observaciones',
      'Mantener refrigerado; consumir en 4 días',
    ],
    allergens: ['Huevo', 'Lácteos'],
    basePriceCents: 1800,
    priceIsStartingAt: false,
    unitLabel: 'molde de 8 porciones',
    image: {
      src: '/images/productos/quesillo.webp',
      alt: 'Quesillo entero bañado en caramelo oscuro',
      width: 1254,
      height: 1254,
      placeholderTones: [CARAMELO, VAINILLA, VAINILLA],
    },
  },
  {
    id: 'cupcakes',
    name: 'Cupcakes',
    family: 'bocado',
    summary: 'Caja surtida o de un solo sabor, con la cobertura que prefieras.',
    description:
      'De vainilla con crema y frambuesa, de chocolate con crema de cacao, o mitad y mitad. Buenos para mesas de dulces y regalos.',
    details: [
      'Caja de 6; la caja de 12 tiene otro precio',
      'Sabores: vainilla, chocolate o surtidos',
      'Consumir en 2 días a temperatura ambiente',
    ],
    allergens: ['Gluten', 'Huevo', 'Lácteos'],
    basePriceCents: 1500,
    priceIsStartingAt: true,
    unitLabel: 'caja de 6',
    image: {
      src: '/images/productos/cupcakes.webp',
      alt: 'Seis cupcakes: tres de vainilla con frambuesa y tres de chocolate',
      width: 1254,
      height: 1254,
      placeholderTones: [ROSA, CREMA, VAINILLA, CHOCOLATE],
    },
  },
  {
    id: 'galletas-decoradas',
    name: 'Galletas decoradas',
    family: 'bocado',
    summary: 'De mantequilla, con glasa pintada a mano según tu celebración.',
    description:
      'Galletas de mantequilla con glasa lisa y detalles pintados a mano. Cuéntanos el motivo de la celebración y los colores.',
    details: [
      'Docena con un mismo motivo y paleta',
      'Los diseños con nombres, logotipos o personajes se cotizan aparte',
      'Duran 2 semanas en su empaque cerrado',
    ],
    allergens: ['Gluten', 'Huevo', 'Lácteos'],
    basePriceCents: 2200,
    priceIsStartingAt: true,
    unitLabel: 'docena',
    image: {
      src: '/images/productos/galletas-decoradas.webp',
      alt: 'Doce galletas de mantequilla con glasa en marfil, rosa y frambuesa y flores pintadas',
      width: 1254,
      height: 1254,
      placeholderTones: [ROSA, VAINILLA, CREMA],
    },
  },
  {
    id: 'brownies',
    name: 'Brownies',
    family: 'bocado',
    summary: 'Densos, con borde crujiente y sal marina por encima.',
    description:
      'Brownies de chocolate oscuro, húmedos por dentro y con la superficie agrietada. Llevan escamas de sal marina.',
    details: [
      'Caja de 9 unidades',
      'Sin frutos secos en la receta',
      'Consumir en 5 días a temperatura ambiente',
    ],
    allergens: ['Gluten', 'Huevo', 'Lácteos'],
    basePriceCents: 1600,
    priceIsStartingAt: false,
    unitLabel: 'caja de 9',
    image: {
      src: '/images/productos/brownies.webp',
      alt: 'Brownies apilados con sal marina por encima',
      width: 1254,
      height: 1254,
      placeholderTones: [CHOCOLATE, CANELA, CHOCOLATE],
    },
  },
];

export function findProduct(id: string | undefined): Product | undefined {
  return products.find((p) => p.id === id);
}
