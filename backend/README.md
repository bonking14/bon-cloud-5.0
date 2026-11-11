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
| `RESEND_API_KEY` | No\*\* | Clave de [Resend](https://resend.com) para enviar correos. |
| `EMAIL_FROM` | No | Remitente. Por defecto `BonCloud <onboarding@resend.dev>`. |
| `APP_URL` | No | Dirección pública de la web, para armar los enlaces de los correos. Por defecto `https://bonking14.github.io/bon-cloud-5.0/`. |
| `ADMIN_EMAILS` | No | Correos, separados por comas, que pasan a administrador cuando confirman su dirección. |

\* Hace falta `DATABASE_URL` **o** las cuatro `DB_*`. Si falta algo obligatorio el servidor
no arranca y dice qué variable falta.

\*\* Sin `RESEND_API_KEY` el servidor funciona, pero no envía correos: escribe cada enlace
(recuperar contraseña, confirmar correo) en su registro. Sirve para desarrollo y para sacar un
enlace a mano desde los *Logs* de Render. Con la clave pero sin dominio propio verificado en
Resend, los correos solo llegan a la dirección de la cuenta de Resend.

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

No hace falta correr nada a mano: **el servidor aplica el esquema cada vez que arranca**, antes
de atender pedidos. Si no puede, no arranca y Render deja funcionando la versión anterior.

Para aplicarlo a mano (por ejemplo desde tu equipo):

`npm run db:migrate` ejecuta `db/schema.sql`. Se puede correr las veces que quieras: crea las
tablas que falten (`usuarios`, `progreso_usuario`, `tokens_cuenta`) y agrega a `usuarios` las
columnas nuevas (`bloqueado_hasta`, `creado_en`, `rol`, `email_verificado`, `email_verificado_en`)
sin tocar los datos que ya hay. Los usuarios existentes quedan como `estudiante`.

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
| `POST` | `/api/auth/forgot-password` | `{ email }`. Envía el enlace para restablecer (vence en 1 hora). Responde igual exista o no la cuenta. |
| `POST` | `/api/auth/reset-password` | `{ token, password }`. Cambia la contraseña con el enlace, que sirve una sola vez. |
| `POST` | `/api/auth/verify-email` | `{ token }`. Confirma el correo (el enlace vence en 48 horas). |
| `POST` | `/api/auth/resend-verification` | Requiere token. Reenvía el enlace de confirmación. |
| `GET` | `/api/cuenta` | Requiere token → `{ usuario: { id, nombre, email, rol, emailVerificado, creadoEn } }` |
| `PUT` | `/api/cuenta` | Requiere token. `{ nombre }`. |
| `PUT` | `/api/cuenta/password` | Requiere token. `{ actual, nueva }`. |
| `GET` | `/api/admin/usuarios` | Solo administrador. `?buscar=&pagina=` → 25 por página. |
| `PUT` | `/api/admin/usuarios/:id/rol` | Solo administrador. `{ rol }`: `estudiante`, `profesor` o `administrador`. Nadie cambia su propio rol. |

### Grupos y notas

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/intentos` | Requiere token. `{ leccionId, aciertos, total }`. Guarda un quiz terminado; el servidor decide si aprobó (70%). Tope de 120 por hora. |
| `GET` | `/api/mis-grupos` | Requiere token. Grupos a los que pertenece el estudiante. |
| `POST` | `/api/mis-grupos` | Requiere token. `{ codigo }`. Se une al grupo abierto con ese código. |
| `DELETE` | `/api/mis-grupos/:id` | Requiere token. Sale del grupo. |
| `GET` | `/api/grupos` | Profesor: sus grupos. Administrador: todos. |
| `POST` | `/api/grupos` | Profesor. `{ nombre }`. Crea el grupo con un código de 6 caracteres. |
| `GET` | `/api/grupos/:id` | Panel: cada estudiante con sus lecciones aprobadas y, por lección, mejor nota, intentos y fechas. |
| `PUT` | `/api/grupos/:id` | `{ nombre?, archivado? }`. Un grupo archivado no admite más estudiantes. |
| `DELETE` | `/api/grupos/:id` | Elimina el grupo y sus membresías. El progreso de los estudiantes se conserva. |
| `DELETE` | `/api/grupos/:id/miembros/:usuarioId` | Retira a un estudiante. |

Un profesor solo ve sus grupos y a los estudiantes que están en ellos; el grupo de otro
profesor responde `404`, igual que uno que no existe. La nota de los quizzes la calcula el
navegador: sirve para seguimiento, no para certificar.

### Examen final y certificado

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/examenes` | Requiere token. Estado de cada módulo (intentos, mejor nota, si puede presentar) y el certificado, si ya lo tiene. |
| `POST` | `/api/examenes` | Requiere token. `{ modulo }`. Empieza un examen (o devuelve el que está en curso): 10 preguntas al azar, 30 minutos. |
| `POST` | `/api/examenes/:id/responder` | Requiere token. `{ respuestas: [0..3 \| null, ...] }`. El servidor califica; se aprueba con 70. |
| `GET` | `/api/certificados/:codigo` | **Pública.** Comprueba un certificado: nombre, nota y fecha. |

Para presentar el examen de un módulo hay que tener aprobadas sus lecciones. Hay 3 intentos por
módulo, y un examen que vence sin enviarse cuenta como intento. Al aprobar todos los módulos se
emite un certificado por persona, con un código `BC-XXXXX-XXXXX`.

Las preguntas salen de `data/banco.json`, que se genera a partir de los quizzes de la web con
`npm run banco`. Hay que volver a generarlo cuando cambien las lecciones (una prueba falla si
queda desactualizado). Como esas preguntas son las mismas de los quizzes, que viajan al
navegador, quien sepa buscarlas puede ver las respuestas: para un examen con peso conviene un
banco de preguntas propio, que solo exista en el servidor.

### Roles

Todo registro nuevo es `estudiante`. Un administrador asciende a `profesor` o `administrador`
desde la web (menú **Usuarios**). El primer administrador sale de `ADMIN_EMAILS`: esa cuenta pasa
a administrador cuando confirma su correo (o restablece su contraseña con el enlace), no al
registrarse, para que registrarse con el correo de otra persona no dé permisos. Las rutas de
administrador leen el rol de la base en cada pedido, no del token.

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
   no existe, y el login falla porque faltan las columnas `bloqueado_hasta` y `rol`.
   Para no tener ese hueco, corre la migración **antes** de desplegar (desde tu equipo con la
   URL externa): el código viejo funciona igual con las columnas nuevas.
