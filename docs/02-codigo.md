# BonCloud · Guía del código

Dónde está cada cosa y cómo cambiarla. El repositorio tiene dos proyectos independientes,
`web/` y `backend/`, más la carpeta `docs/`.

```
bon-cloud-5.0/
├── web/        la página (React + Vite)          → GitHub Pages
├── backend/    la API (Express + PostgreSQL)     → Render
├── docs/       esta documentación
└── .github/workflows/deploy-web.yml   publica la web en cada cambio
```

Tamaño aproximado: 13.800 líneas en `web/src` y 1.500 en el backend, sin contar pruebas del
backend ni dependencias.

## 1. Cómo correrlo en un computador

**Web** (no necesita la API para el modo invitado):

```bash
cd web
npm install
npm run dev
```

**API** (necesita una base PostgreSQL y un archivo `.env`; ver `backend/.env.example`):

```bash
cd backend
npm install
npm start
```

Para que la web local use la API local, se arranca así:

```bash
VITE_API_URL=http://localhost:4000/api npm run dev
```

**Pruebas:** `npm test` dentro de cada carpeta.

## 2. La web (`web/src`)

```
app/         App.jsx (todas las rutas), Layout.jsx (menú lateral), modulos.js (menú e inicio)
auth/        AuthContext.jsx (sesión y rol), api.js (llamadas a la API), ProtectedRoute.jsx
hooks/       ProgresoContext.jsx (lecciones aprobadas), tema, tamaño de letra, TRM
components/  piezas reutilizables: Modal, Buscador, Filtros, Calculadora, Toast...
data/        el contenido: lecciones, glosario, subpartidas, incoterms, vistos buenos
lib/         funciones puras: cálculos, PDF, CSV, NIT, normas citadas
features/    una carpeta por pantalla
styles/      hojas de estilo globales
```

### Pantallas (`features/`)

| Carpeta | Pantalla | Ruta |
|---|---|---|
| `landing/` | Ingreso, registro, recuperar contraseña | `/` |
| `dashboard/` | Inicio | `/inicio` |
| `curso/` | Ruta de Aprendizaje: mapa, lección, quiz | `/curso` |
| `examen/` | Examen final y verificación pública de certificados | `/examen`, `/verificar/:codigo` |
| `importacion/`, `exportacion/` | Calculadoras | `/importacion/:modalidad`, `/exportacion/:modalidad` |
| `incoterms/`, `subpartidas/`, `vistos-buenos/`, `glosario/` | Material de consulta | una ruta cada una |
| `formularios/` | Formularios DIAN | `/formularios/:id` |
| `simulador/` | Simulador logístico | `/simulador` |
| `grupos/` | Grupos del profesor, panel y «Mis grupos» | `/grupos`, `/grupos/:id` |
| `cuenta/` | Perfil, usuarios, licencias, restablecer, verificar correo | `/perfil`, `/admin/...` |
| `legal/` | Términos y política de datos | `/terminos`, `/privacidad` |

### Dónde cambiar el contenido

| Quiero cambiar... | Archivo |
|---|---|
| Una lección o su quiz | `data/lecciones.js` (y luego `npm run banco` en `backend/`) |
| El mapa de etapas de un módulo | `features/curso/MapaRuta.jsx` |
| Un término del glosario | `data/glosario.js` |
| Una subpartida | `data/subpartidas.js` |
| Un visto bueno o un Incoterm | `data/vistosBuenos.js`, `data/incoterms.js` |
| Qué va en una casilla de un formulario | `features/formularios/hojas/Form<número>.jsx` |
| Una fórmula de tributos | `lib/importacion.js`, `lib/formularios.js` |
| Los textos legales | `features/legal/textos.js` (subir `VERSION`) |
| Quién revisó el contenido | `data/revision.js` |
| El menú lateral | `app/modulos.js` y `app/Layout.jsx` |

### Cómo funcionan las lecciones

Cada lección de `data/lecciones.js` es un objeto con `id`, `modulo`, `titulo`, `objetivos`,
`contenido` (HTML), `etapaCaso`, `practica` (enlace a una herramienta) y `quiz` (preguntas
con cuatro opciones y el índice de la correcta). Los `id` deben ser consecutivos desde 1,
porque el progreso se guarda por `id`. Una prueba (`data/lecciones.test.js`) falla si algo
queda incompleto: términos del glosario que no existen, quizzes sin respuesta, lecciones
fuera del mapa.

### Cómo funcionan los formularios

Es la parte más particular del código.

1. `scripts/extraer_formulario.py` lee el PDF oficial de la DIAN y produce un *trazado*: un
   archivo JSON con las líneas, sombreados, textos y la celda de cada casilla. Están en
   `features/formularios/trazados/`.
2. `kit/HojaOficial.jsx` dibuja ese trazado en SVG y pone encima un campo por cada casilla.
3. Cada `hojas/Form<número>.jsx` dice qué va en cada casilla: un dato con nombre, un valor
   calculado, una lista de códigos o una posición a mano.
4. `EditorFormulario.jsx` guarda los valores, carga el caso de práctica, valida los
   obligatorios e imprime.

El RUT es la excepción: como la DIAN no publica su hoja en blanco, su trazado se arma a mano
en `trazados/rut.js`. En las hojas 3 a 8 del formulario 600 los campos se generan solos a
partir de los recuadros vacíos (`kit/recuadros.js`).

### Sesión y progreso

- `auth/AuthContext.jsx` guarda el token y los datos del usuario en el navegador, expone
  `usuario`, `rol`, `tokenApi` y refresca el rol al cargar.
- `hooks/ProgresoContext.jsx` guarda las lecciones aprobadas en el navegador (una clave por
  persona) y, si hay sesión real, las sincroniza con la API.
- El invitado no tiene token: su avance vive solo en el navegador y se borra al salir.

## 3. La API (`backend/`)

```
server.js            arranca: pone la base al día y escucha
src/app.js           arma Express: seguridad, límites y rutas
src/config/          env.js (variables), db.js (conexión)
src/middleware/      auth.js (token), roles.js (permisos), errores.js
src/routes/          una por área: qué dirección llama a qué función
src/controllers/     la lógica de cada área
src/services/        correo.js, tokens.js, licencias.js
db/schema.sql        todas las tablas (idempotente)
db/esquema.js        aplica el esquema con candado y transacción
data/banco.json      preguntas del examen (generado)
scripts/generar-banco.mjs   genera banco.json desde las lecciones de la web
test/                pruebas, con una base de datos simulada
```

### Rutas principales

| Área | Rutas | Quién |
|---|---|---|
| Cuenta | `/api/auth/*` (registro, ingreso, recuperar, verificar), `/api/cuenta/*` | Todos |
| Progreso y notas | `/api/progreso`, `/api/intentos` | Usuario con sesión |
| Grupos del estudiante | `/api/mis-grupos` | Usuario con sesión |
| Grupos del profesor | `/api/grupos/*` | Profesor y administrador |
| Examen | `/api/examenes/*` | Usuario con sesión |
| Certificado | `/api/certificados/:codigo` | Público |
| Administración | `/api/admin/usuarios`, `/api/admin/instituciones` | Administrador |
| Salud | `/api/salud` | Público |

El detalle de cada ruta está en `backend/README.md`.

### Cómo agregar algo

- **Una tabla o columna:** se agrega al final de `db/schema.sql` con `IF NOT EXISTS`. Se
  crea sola en el siguiente arranque. Nunca se edita una sentencia que ya corrió en
  producción.
- **Una ruta:** función en un controlador, línea en el archivo de rutas y prueba en `test/`.
- **Una pantalla:** componente en `features/`, ruta en `app/App.jsx` y, si va en el menú,
  enlace en `app/Layout.jsx` o `app/modulos.js`.

## 4. Convenciones

- El código y los comentarios están en español. Los comentarios explican el porqué.
- Los cálculos van en `lib/` como funciones puras, con pruebas, separados de las pantallas.
- Cada cambio va en una rama y solo pasa a `main` con las pruebas en verde. Publicar en
  `main` despliega de inmediato.
- Los secretos (claves, contraseñas) van en variables de entorno, nunca en el código.

## 5. Tareas frecuentes

| Tarea | Cómo |
|---|---|
| Cambiar una lección | Editar `data/lecciones.js`, correr `npm run banco` en `backend/`, pruebas, publicar |
| Actualizar un formulario de la DIAN | Descargar el PDF nuevo y regenerar su trazado (ver `web/README.md`) |
| Regenerar la lista de revisión del experto | `node scripts/lista-revision.mjs` en `web/` |
| Nombrar un administrador | Agregar su correo a `ADMIN_EMAILS` en Render; pasa a administrador al verificar su correo |
| Sacar un enlace de correo que no llegó | Buscarlo en los *Logs* de Render |
