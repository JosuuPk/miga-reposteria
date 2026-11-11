import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Añade las etiquetas de vista previa al compartir (og:image, og:url) solo cuando
 * se conoce la dirección pública del sitio (VITE_SITE_URL). Esas etiquetas
 * necesitan direcciones completas, así que sin esa variable no se añaden.
 */
function sharePreview(siteUrl: string | undefined): Plugin {
  return {
    name: 'miga-share-preview',
    transformIndexHtml() {
      const base = siteUrl?.trim().replace(/\/+$/, '');
      if (!base) return [];
      const meta = (attrs: Record<string, string>) => ({ tag: 'meta', attrs, injectTo: 'head' as const });
      return [
        meta({ property: 'og:url', content: `${base}/` }),
        meta({ property: 'og:image', content: `${base}/images/compartir.jpg` }),
        meta({ property: 'og:image:width', content: '1200' }),
        meta({ property: 'og:image:height', content: '630' }),
        meta({ name: 'twitter:card', content: 'summary_large_image' }),
        { tag: 'link', attrs: { rel: 'canonical', href: `${base}/` }, injectTo: 'head' as const },
      ];
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_');
  return {
    plugins: [react(), sharePreview(env.VITE_SITE_URL)],
    server: { port: 5173, strictPort: true },
  };
});
