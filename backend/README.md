# BonCloud API

API de BonCloud: registro, inicio de sesión con JWT y progreso del curso guardado en PostgreSQL.
Express 5 + `pg` + `bcryptjs` + `jsonwebtoken`. En producción corre en Render
(`https://boncloud-api.onrender.com`).

## Estructura

```
backend/
├── server.js                 # solo arranca el servidor (app.listen)
├── src/
│   ├── app.js                # crea y exporta la app de Express (la usan los tests)
│   ├── config/env.js         # carga .env una sola vez y valida las variables
│   ├── config/db.js          # Pool de PostgreSQL
│   ├── middleware/auth.js    # verificarToken (JWT)
│   ├── middleware/errores.js # 404 y manejador de errores en JSON
│   ├── controllers/          # authController, progresoController
│   └── routes/               # /api/auth, /api/progreso
├── db/schema.sql             # esquema idempotente
├── db/migrate.js             # npm run db:migrate
└── test/                     # node:test + supertest, con la base simulada
```

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `JWT_SECRET` | Sí | Clave para firmar los tokens. Un texto largo y aleatorio. |
| `DATABASE_URL` | Sí\* | URL de conexión a PostgreSQL (la que da Render). Usa SSL. |
| `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Sí\* | Alternativa a `DATABASE_URL` para desarrollo local. `DB_PORT` es opcional (5432). |
| `JWT_EXPIRES_IN` | No | Duración del token. Por defecto `8h`. |
| `CORS_ORIGINS` | No | Orígenes permitidos, separados por comas. Por defecto: `https://bonking14.github.io` y los `localhost` de desarrollo (4000, 5500, 5503). |
| `PORT` | No | Puerto. Por defecto `4000` (Render pone el suyo). |

\* Hace falta `DATABASE_URL` **o** las cuatro `DB_*`. Si falta algo obligatorio el servidor
no arranca y dice qué variable falta.

Para desarrollo local copia `.env.example` como `.env` y llénalo.

## Correr en local

```bash
cd backend
npm install
cp .env.example .env   # y edítalo
npm run db:migrate     # crea o actualiza las tablas
npm start              # http://localhost:4000
```

## Migrar la base de datos

`npm run db:migrate` ejecuta `db/schema.sql`. Se puede correr las veces que quieras: crea las
tablas que falten (`usuarios`, `progreso_usuario`) y agrega a `usuarios` las columnas nuevas
(`bloqueado_hasta`, `creado_en`) sin tocar los datos que ya hay.

## Tests

```bash
npm test
```

No necesitan base de datos: reemplazan `src/config/db.js` por un pool falso.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | `{ nombre, email, password }` → `201 { mensaje, usuario }` |
| `POST` | `/api/auth/login` | `{ email, password }` → `{ mensaje, token, usuario }` |
| `GET` | `/api/progreso` | Requiere `Authorization: Bearer <token>` → `{ ok, progreso: { leccionesCompletadas } }` |
| `POST` | `/api/progreso` | Requiere token. Body `{ progreso: { leccionesCompletadas: [1, 2, ...] } }`. Reemplaza el progreso guardado. |

Bloqueo de cuentas: después de 5 contraseñas incorrectas la cuenta queda bloqueada 15 minutos
(`403`) y el contador vuelve a cero. La columna `bloqueado = true` es un bloqueo manual que solo
quita un administrador desde la base de datos.

## Pasos en Render (una sola vez)

1. **Environment** del servicio: revisa que existan `JWT_SECRET` y `DATABASE_URL`. Si quieres
   controlar CORS desde ahí, agrega `CORS_ORIGINS`, por ejemplo
   `https://bonking14.github.io` (sin barra final). Si no la agregas se usan los orígenes por
   defecto, que ya incluyen GitHub Pages.
2. Despliega la nueva versión. El comando de arranque sigue siendo `npm start`.
3. Corre la migración una vez: en el servicio, **Shell** → `npm run db:migrate`
   (o desde tu equipo, con la `DATABASE_URL` externa de Render en tu `.env`).
   Hasta que la corras, `/api/progreso` responde `500` porque la tabla `progreso_usuario`
   no existe, y el login falla porque falta la columna `bloqueado_hasta`.
   Para no tener ese hueco, corre la migración **antes** de desplegar (desde tu equipo con la
   URL externa): el código viejo funciona igual con las columnas nuevas.
