import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from the ROOT of https://andrewandelfida.github.io/ (an organisation
// GitHub Pages site), so the base path is "/" and every asset, font, image and
// internal reference stays root-relative. Do not change this to a sub-path —
// the printed QR code encodes the root URL.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        // Leaflet is dynamically imported by the map section and must stay in
        // its own chunk so it never lands in the critical path.
        manualChunks: undefined,
      },
    },
  },
});
