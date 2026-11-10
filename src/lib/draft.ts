// Borrador del configurador guardado en este navegador (localStorage).
// Se guarda solo la configuración del producto. Las observaciones NO se guardan:
// son texto libre y podrían contener datos personales.

import type { Product } from '../data/catalog';
import { CONFIG_VERSION, createConfig, restoreConfig, type CakeConfig } from './cakeConfig';

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function keyFor(productId: string): string {
  return `miga:borrador:v${CONFIG_VERSION}:${productId}`;
}

export function saveDraft(config: CakeConfig, now: number = Date.now()): void {
  try {
    const { notes: _notes, ...rest } = config;
    localStorage.setItem(keyFor(config.productId), JSON.stringify({ savedAt: now, config: rest }));
  } catch {
    // Sin almacenamiento (modo privado, cuota llena): el configurador sigue funcionando.
  }
}

/**
 * Devuelve el borrador validado, o null si no hay, está vencido, está dañado
 * o no tiene ningún avance respecto a una configuración nueva.
 */
export function loadDraft(product: Product, now: number = Date.now()): CakeConfig | null {
  try {
    const raw = localStorage.getItem(keyFor(product.id));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const { savedAt, config } = parsed as { savedAt?: unknown; config?: unknown };
    if (typeof savedAt !== 'number' || now - savedAt > MAX_AGE_MS || now < savedAt) {
      clearDraft(product.id);
      return null;
    }
    const restored = restoreConfig(config, product);
    if (!restored) return null;
    if (JSON.stringify(restored) === JSON.stringify(createConfig(product))) return null;
    return restored;
  } catch {
    return null;
  }
}

export function clearDraft(productId: string): void {
  try {
    localStorage.removeItem(keyFor(productId));
  } catch {
    // Nada que limpiar.
  }
}
