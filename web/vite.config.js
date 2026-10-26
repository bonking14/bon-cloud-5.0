import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages sirve el sitio en https://<usuario>.github.io/<repositorio>/.
// El workflow de despliegue pasa BASE_PATH con el nombre del repositorio.
export default defineConfig({
  base: process.env.BASE_PATH || '/boncloud/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    // Los tests de formularios cargan cada hoja con import(); con la suite completa
    // en paralelo pueden pasar de los 5 s por defecto
    testTimeout: 20000,
  },
});
