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
    formularios/kit/       HojaOficial (dibuja la hoja oficial y pone los campos encima) y piezas del 001
    formularios/hojas/     un archivo por formulario: 001, 500, 560, 600 y 650 (tránsito)
    formularios/trazados/  trazado de cada formulario oficial, extraído del PDF de la DIAN
scripts/
  extraer_formulario.py    genera los trazados a partir de los PDF oficiales
```

### Formularios oficiales

Los formularios 500, 560, 600 y 650 reproducen la distribución y la numeración de los PDF que
publica la DIAN en `https://www.dian.gov.co/atencionciudadano/formulariosinstructivos/`
(`Formularios/<año>/Formulario_<número>_<año>.pdf`; aquí se usaron los de 2026). Si la DIAN
cambia un formulario, se descarga el PDF nuevo y se regenera su trazado:

```bash
pip install pdfplumber
python3 scripts/extraer_formulario.py Formulario_500_2026.pdf 1 > src/features/formularios/trazados/500.json
```

El número es la hoja del PDF. El 600 está dibujado con recuadros superpuestos y lleva `capas` al
final (`... Formulario_600_2026.pdf 3 capas > .../600-3.json`); en sus hojas 3 a 8 los campos
se generan solos a partir de los recuadros vacíos (`kit/recuadros.js`).

Cada archivo de `hojas/` dice qué va en cada casilla (nombre del dato, valor calculado, lista
de códigos o posición a mano). El 001 (RUT) todavía usa el diseño anterior: la DIAN no publica
su hoja en blanco en ese catálogo.

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
