import { brand } from '../data/brand';
import './DemoNotice.css';

export function DemoNotice() {
  if (!brand.isDemo) return null;
  return (
    <p className="aviso-demo">
      Sitio de demostración. {brand.name} es una marca conceptual: productos, precios e imágenes
      son provisionales.
    </p>
  );
}
