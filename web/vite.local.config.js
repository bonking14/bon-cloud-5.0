import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// El código de jsPDF trae textos como "</body>" dentro de sus strings. Herramientas como
// Live Server meten su script en el primer "</body>" que encuentran y rompen el JS.
// En JavaScript "<\/body>" vale lo mismo, así que se escapan dentro del script inline.
function escaparEtiquetasEnScripts() {
  let archivo;
  return {
    name: 'escapar-etiquetas-en-scripts',
    apply: 'build',
    configResolved(config) {
      archivo = path.resolve(config.root, config.build.outDir, 'index.html');
    },
    // Al final de todo, cuando el plugin de un solo archivo ya incrustó el JS
    closeBundle() {
      const html = fs.readFileSync(archivo, 'utf8').replace(
        /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/g,
        (_m, abre, codigo, cierra) => abre + codigo.replace(/<\/(body|html|head)/gi, '<\\/$1') + cierra,
      );
      fs.writeFileSync(archivo, html);
    },
  };
}

// Versión para abrir con doble clic desde la compu (file://):
// todo el programa queda dentro de un solo index.html, sin servidor.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile(), escaparEtiquetasEnScripts()],
  build: { outDir: 'dist-local', emptyOutDir: true },
});
