import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import staticPages from './scripts/static-pages.js';
import { routes, SITE_URL } from './src/data/routes.js';

export default defineConfig({
  plugins: [react(), staticPages(routes, SITE_URL)],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Three.js loads lazily with the home page hero, so it gets its own chunk.
        manualChunks: { gsap: ['gsap', 'lenis'] },
      },
    },
  },
});
