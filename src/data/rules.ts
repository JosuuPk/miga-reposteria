// Reglas de fechas y entrega (demostración). Importes en centavos enteros de USD.
// Las fechas se escriben como 'AAAA-MM-DD' y se interpretan en la zona horaria
// definida en brand.ts (America/Caracas).

export type DateRules = {
  /** Días completos de anticipación mínima entre hoy y la fecha deseada. */
  minLeadDays: number;
  /** Días de la semana sin producción ni entregas. 0 = domingo ... 6 = sábado. */
  closedWeekdays: number[];
  /** Fechas concretas bloqueadas. */
  blockedDates: string[];
  /** Hasta cuántos días hacia adelante se aceptan solicitudes. */
  maxAdvanceDays: number;
};

export const dateRules: DateRules = {
  minLeadDays: 3,
  closedWeekdays: [0],
  blockedDates: ['2026-12-24', '2026-12-25', '2026-12-31', '2027-01-01'],
  maxAdvanceDays: 90,
};

export type DeliveryZone = {
  id: string;
  label: string;
  /** Tarifa en centavos, o null si la entrega en esa zona se cotiza a mano. */
  feeCents: number | null;
};

export const pickup = {
  label: 'Retiro en el taller',
  // No se publica una dirección: en la demostración no existe un local real.
  areaLabel: 'Chacao (dirección al confirmar)',
  feeCents: 0,
};

export const deliveryZones: DeliveryZone[] = [
  { id: 'chacao', label: 'Chacao', feeCents: 400 },
  { id: 'baruta', label: 'Baruta', feeCents: 500 },
  { id: 'libertador', label: 'Libertador', feeCents: 500 },
  { id: 'sucre', label: 'Sucre', feeCents: 600 },
  { id: 'el-hatillo', label: 'El Hatillo', feeCents: 700 },
  { id: 'otra', label: 'Otra zona', feeCents: null },
];
