import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Versión para abrir con doble clic desde la compu (file://):
// todo el programa queda dentro de un solo index.html, sin servidor.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'dist-local', emptyOutDir: true },
});
