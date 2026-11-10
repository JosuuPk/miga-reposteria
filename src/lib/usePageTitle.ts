import { useEffect } from 'react';
import { brand } from '../data/brand';

/** Pone el título de la pestaña del navegador para la página actual. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    const suffix = brand.isDemo ? `${brand.name} (demostración)` : brand.name;
    document.title = title ? `${title} | ${suffix}` : `${brand.name} | Tortas por encargo en ${brand.city}${brand.isDemo ? ' (demostración)' : ''}`;
  }, [title]);
}
