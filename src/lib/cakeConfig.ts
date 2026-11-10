// Estado y reglas del configurador de tortas. Sin nada visual: se puede probar solo.

import {
  coverings,
  extras,
  fillings,
  flavors,
  messageMaxLength,
  notesMaxLength,
  sizes,
  type CakeOption,
} from '../data/cakeOptions';
import type { Product } from '../data/catalog';
import { deliveryZones, type DateRules } from '../data/rules';
import { validateDate } from './dates';

/** Grupos de opciones, en el orden de los pasos. El orden decide quién manda. */
export const groups = ['size', 'flavor', 'filling', 'covering', 'extras'] as const;
export type Group = (typeof groups)[number];

export const groupLabels: Record<Group, string> = {
  size: 'Tamaño',
  flavor: 'Bizcocho',
  filling: 'Relleno',
  covering: 'Cobertura',
  extras: 'Extras',
};

export const groupOptions: Record<Group, CakeOption[]> = {
  size: sizes,
  flavor: flavors,
  filling: fillings,
  covering: coverings,
  extras,
};

export type DeliveryMode = 'retiro' | 'entrega';

export const CONFIG_VERSION = 1;

export type CakeConfig = {
  version: number;
  productId: string;
  sizeId: string | null;
  flavorId: string | null;
  fillingId: string | null;
  coveringId: string | null;
  extraIds: string[];
  /** Texto escrito sobre la torta. */
  message: string;
  /** Fecha deseada, 'AAAA-MM-DD' o ''. */
  date: string;
  deliveryMode: DeliveryMode | null;
  zoneId: string | null;
  notes: string;
};

export function createConfig(product: Product): CakeConfig {
  return {
    version: CONFIG_VERSION,
    productId: product.id,
    sizeId: null,
    flavorId: product.cakePreset?.flavorId ?? null,
    fillingId: product.cakePreset?.fillingId ?? null,
    coveringId: product.cakePreset?.coveringId ?? null,
    extraIds: [],
    message: '',
    date: '',
    deliveryMode: null,
    zoneId: null,
    notes: '',
  };
}

const allOptions = new Map<string, { option: CakeOption; group: Group }>();
for (const group of groups) {
  for (const option of groupOptions[group]) {
    if (allOptions.has(option.id)) {
      throw new Error(`Id de opción repetido en cakeOptions.ts: ${option.id}`);
    }
    allOptions.set(option.id, { option, group });
  }
}

export function findOption(id: string | null): CakeOption | undefined {
  return id ? allOptions.get(id)?.option : undefined;
}

/** true si las dos opciones no se pueden combinar (en cualquiera de los dos sentidos). */
export function conflict(aId: string, bId: string): boolean {
  const a = allOptions.get(aId)?.option;
  const b = allOptions.get(bId)?.option;
  if (!a || !b) return false;
  return Boolean(a.notWith?.includes(bId) || b.notWith?.includes(aId));
}

function selectedIn(config: CakeConfig, group: Group): string[] {
  switch (group) {
    case 'size':
      return config.sizeId ? [config.sizeId] : [];
    case 'flavor':
      return config.flavorId ? [config.flavorId] : [];
    case 'filling':
      return config.fillingId ? [config.fillingId] : [];
    case 'covering':
      return config.coveringId ? [config.coveringId] : [];
    case 'extras':
      return config.extraIds;
  }
}

/**
 * Opciones ya elegidas en pasos ANTERIORES que impiden elegir esta.
 * Si la lista no está vacía, la opción se muestra deshabilitada con el motivo.
 */
export function blockedBy(config: CakeConfig, group: Group, optionId: string): CakeOption[] {
  const position = groups.indexOf(group);
  const blockers: CakeOption[] = [];
  for (const earlier of groups.slice(0, position)) {
    for (const id of selectedIn(config, earlier)) {
      if (conflict(id, optionId)) blockers.push(allOptions.get(id)!.option);
    }
  }
  return blockers;
}

export type Removal = { group: Group; option: CakeOption; because: CakeOption };

/**
 * Elige una opción. Si choca con algo elegido en pasos POSTERIORES, lo quita y
 * lo informa en "removed" para que la interfaz pida corregirlo.
 * No permite elegir una opción bloqueada por un paso anterior.
 */
export function choose(
  config: CakeConfig,
  group: Exclude<Group, 'extras'>,
  optionId: string,
): { config: CakeConfig; removed: Removal[] } {
  const entry = allOptions.get(optionId);
  if (!entry || entry.group !== group || blockedBy(config, group, optionId).length > 0) {
    return { config, removed: [] };
  }
  const next: CakeConfig = { ...config, extraIds: [...config.extraIds] };
  if (group === 'size') next.sizeId = optionId;
  if (group === 'flavor') next.flavorId = optionId;
  if (group === 'filling') next.fillingId = optionId;
  if (group === 'covering') next.coveringId = optionId;

  const removed: Removal[] = [];
  for (const later of groups.slice(groups.indexOf(group) + 1)) {
    for (const id of selectedIn(next, later)) {
      if (!conflict(optionId, id)) continue;
      removed.push({ group: later, option: allOptions.get(id)!.option, because: entry.option });
      if (later === 'flavor') next.flavorId = null;
      if (later === 'filling') next.fillingId = null;
      if (later === 'covering') next.coveringId = null;
      if (later === 'extras') next.extraIds = next.extraIds.filter((x) => x !== id);
    }
  }
  return { config: next, removed };
}

/** Añade o quita un extra. No añade extras bloqueados por pasos anteriores. */
export function toggleExtra(config: CakeConfig, extraId: string): CakeConfig {
  if (config.extraIds.includes(extraId)) {
    return { ...config, extraIds: config.extraIds.filter((id) => id !== extraId) };
  }
  const entry = allOptions.get(extraId);
  if (!entry || entry.group !== 'extras' || blockedBy(config, 'extras', extraId).length > 0) {
    return config;
  }
  return { ...config, extraIds: [...config.extraIds, extraId] };
}

/** Recorta el mensaje y las observaciones a su límite. */
export function setMessage(config: CakeConfig, message: string): CakeConfig {
  return { ...config, message: message.slice(0, messageMaxLength) };
}

export function setNotes(config: CakeConfig, notes: string): CakeConfig {
  return { ...config, notes: notes.slice(0, notesMaxLength) };
}

export const steps = [
  { id: 'size', title: 'Tamaño' },
  { id: 'flavor', title: 'Bizcocho' },
  { id: 'filling', title: 'Relleno' },
  { id: 'covering', title: 'Cobertura' },
  { id: 'extras', title: 'Extras' },
  { id: 'message', title: 'Mensaje' },
  { id: 'date', title: 'Fecha' },
  { id: 'delivery', title: 'Entrega' },
  { id: 'review', title: 'Revisión' },
] as const;

export type StepId = (typeof steps)[number]['id'];

/**
 * Devuelve el problema que impide dar por completo un paso, o null si está bien.
 * Los mensajes dicen qué falta y cómo resolverlo.
 */
export function stepIssue(
  config: CakeConfig,
  step: StepId,
  dateRules: DateRules,
  today: string,
): string | null {
  switch (step) {
    case 'size':
      return config.sizeId ? null : 'Elige un tamaño para continuar.';
    case 'flavor':
      return config.flavorId ? null : 'Elige un bizcocho para continuar.';
    case 'filling':
      return config.fillingId ? null : 'Elige un relleno para continuar.';
    case 'covering':
      return config.coveringId ? null : 'Elige una cobertura para continuar.';
    case 'extras':
    case 'message':
      return null;
    case 'date': {
      const result = validateDate(config.date, dateRules, today);
      return result.ok ? null : result.message;
    }
    case 'delivery':
      if (!config.deliveryMode) return 'Elige si retiras la torta o si te la llevamos.';
      if (config.deliveryMode === 'entrega') {
        if (!config.zoneId) return 'Elige la zona de entrega.';
        if (!deliveryZones.some((z) => z.id === config.zoneId)) return 'Elige una zona de la lista.';
      }
      return null;
    case 'review': {
      for (const s of steps) {
        if (s.id === 'review') continue;
        const issue = stepIssue(config, s.id, dateRules, today);
        if (issue) return `Falta completar el paso "${s.title}".`;
      }
      return null;
    }
  }
}

/** Primer paso con algo pendiente (o "review" si todo está completo). */
export function firstIncompleteStep(config: CakeConfig, dateRules: DateRules, today: string): StepId {
  for (const s of steps) {
    if (s.id !== 'review' && stepIssue(config, s.id, dateRules, today)) return s.id;
  }
  return 'review';
}
