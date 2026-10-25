# BonCloud web (React + Vite)

Frontend de BonCloud: plataforma educativa de comercio exterior del Puerto de Cartagena.

## Comandos

```bash
npm install
npm run dev      # http://localhost:5173/boncloud/
npm test         # tests de cálculos, quiz, sesión y PDF
npm run build    # genera dist/ para GitHub Pages
```

La URL de la API se configura con `VITE_API_URL` (ver `.env.example`). Por defecto usa
`https://boncloud-api.onrender.com/api`. Para probar el login en local, el backend
debe aceptar el origen `http://localhost:5173` en `CORS_ORIGINS`.

## Estructura

```
src/
  app/         App (rutas), Layout (sidebar único), modulos.js (menú e inicio)
  auth/        sesión, cliente de la API y protección de rutas
  hooks/       tema, tamaño de letra, TRM oficial, progreso del curso
  lib/         cálculos puros y testeados: importación, exportación, simulador, NIT, PDF
  data/        contenido: glosario, subpartidas, incoterms, vistos buenos, lecciones
  components/  piezas reutilizables: Modal, Buscador, Filtros, Calculadora, Toast...
  features/    una carpeta por página
    formularios/kit/    piezas de los formularios DIAN (celdas, casillas con ayuda, tabla de ítems)
    formularios/hojas/  un archivo por formulario: 001, 500, 560, 600 y DTA
```

### Dónde editar el contenido

| Quiero cambiar... | Archivo |
|---|---|
| Un término del glosario | `src/data/glosario.js` |
| Una lección o su quiz | `src/data/lecciones.js` |
| Una subpartida (también la usan los formularios 500 y 600) | `src/data/subpartidas.js` |
| Un formulario DIAN, su caso de práctica o la ayuda de una casilla | `src/features/formularios/hojas/` |
| Cálculos de los formularios | `src/lib/formularios.js` (tests en `src/lib/formularios.test.js`) |
| Un módulo del menú | `src/app/modulos.js` |
| Fórmulas de tributos | `src/lib/importacion.js` (tiene tests en `src/lib/calculos.test.js`) |

## Publicación

`.github/workflows/deploy-web.yml` corre los tests, compila y publica `dist/` en GitHub Pages
en cada push a `main` que toque `web/`. En el repositorio, **Settings → Pages → Source** debe
estar en **GitHub Actions**.
