// Opciones del configurador de tortas (demostración). Importes en centavos de USD
// que se SUMAN al precio base del producto.
//
// - id: único en TODO el archivo (no repetir entre grupos).
// - priceCents: null significa "Requiere cotización": nunca se trata como gratis.
// - notWith: ids de otras opciones con las que NO se puede combinar. Basta
//   declararlo en una de las dos; la lógica lo aplica en ambos sentidos.
// - swatch: color con el que se dibuja la opción en el resumen.

export type CakeOption = {
  id: string;
  label: string;
  /** Aclaración breve que se muestra bajo la etiqueta. */
  note?: string;
  priceCents: number | null;
  notWith?: string[];
  swatch?: string;
};

export type CakeSize = CakeOption & {
  servings: number | null;
  /** Número de pisos con que se dibuja la torta. */
  tiers: 1 | 2;
};

export const sizes: CakeSize[] = [
  { id: 'p8', label: '8 porciones', servings: 8, tiers: 1, note: 'Un piso, 15 cm', priceCents: 0 },
  { id: 'p12', label: '12 porciones', servings: 12, tiers: 1, note: 'Un piso, 18 cm', priceCents: 1000 },
  { id: 'p20', label: '20 porciones', servings: 20, tiers: 1, note: 'Un piso, 23 cm', priceCents: 2400 },
  { id: 'p30', label: '30 porciones', servings: 30, tiers: 2, note: 'Dos pisos', priceCents: 4200 },
  {
    id: 'p-mas',
    label: 'Más de 30 porciones',
    servings: null,
    tiers: 2,
    note: 'El tamaño se define contigo',
    priceCents: null,
  },
];

export const flavors: CakeOption[] = [
  { id: 'vainilla', label: 'Vainilla', priceCents: 0, swatch: '#E3C78D' },
  { id: 'chocolate', label: 'Chocolate', note: 'Cacao oscuro', priceCents: 200, swatch: '#5A3423' },
  { id: 'zanahoria', label: 'Zanahoria y nuez', note: 'Con canela', priceCents: 300, swatch: '#B9722F' },
  { id: 'marmoleado', label: 'Marmoleado', note: 'Vainilla y cacao', priceCents: 200, swatch: '#A9824F' },
];

export const fillings: CakeOption[] = [
  { id: 'dulce-de-leche', label: 'Dulce de leche', priceCents: 0, swatch: '#A8652B' },
  { id: 'frambuesa', label: 'Frambuesa', note: 'Compota de la casa', priceCents: 300, swatch: '#C4184F' },
  // La crema de parchita es ácida y corta el queso crema.
  {
    id: 'parchita',
    label: 'Crema de parchita',
    priceCents: 300,
    notWith: ['c-queso-crema'],
    swatch: '#E8A93B',
  },
  { id: 'ganache', label: 'Ganache de chocolate', priceCents: 300, swatch: '#3B2117' },
  { id: 'queso-crema', label: 'Queso crema', priceCents: 200, swatch: '#F3E7CF' },
];

export const coverings: CakeOption[] = [
  // El merengue no soporta el peso de un segundo piso.
  {
    id: 'merengue-suizo',
    label: 'Merengue suizo',
    note: 'Textura de espátula',
    priceCents: 0,
    notWith: ['p30', 'p-mas'],
    swatch: '#FBF6EC',
  },
  { id: 'crema-mantequilla', label: 'Crema de mantequilla', priceCents: 300, swatch: '#F4E3BE' },
  { id: 'ganache-oscuro', label: 'Ganache oscuro', priceCents: 400, swatch: '#2E1911' },
  { id: 'c-queso-crema', label: 'Queso crema', note: 'Poco dulce', priceCents: 300, swatch: '#F3E7CF' },
  // Sin cobertura en los lados: solo para tortas de un piso.
  {
    id: 'semidesnuda',
    label: 'Semidesnuda',
    note: 'Se ven las capas',
    priceCents: 0,
    notWith: ['p30', 'p-mas'],
    swatch: '#EFE0C2',
  },
  {
    id: 'diseno-especial',
    label: 'Diseño especial',
    note: 'Fondant, figuras o pintura a mano',
    priceCents: null,
    swatch: '#EFC9CC',
  },
];

export const extras: CakeOption[] = [
  { id: 'frambuesas', label: 'Frambuesas frescas', priceCents: 400 },
  { id: 'flores', label: 'Flores comestibles', priceCents: 500 },
  { id: 'macarons', label: 'Macarons (6)', priceCents: 600 },
  { id: 'topper', label: 'Topper de cartulina', note: 'Texto corto', priceCents: 300 },
  { id: 'velas', label: 'Velas doradas (10)', priceCents: 100 },
];

/** Máximo de caracteres del mensaje escrito sobre la torta. */
export const messageMaxLength = 40;

/** Máximo de caracteres de las observaciones. */
export const notesMaxLength = 300;
