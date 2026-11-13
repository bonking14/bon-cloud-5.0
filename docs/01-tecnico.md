# BonCloud · Documento técnico

Estado del sistema a noviembre de 2026. Explica cómo está construido, cómo se protege, cómo
se despliega y cómo se prueba. Para el detalle archivo por archivo, ver `02-codigo.md`; para
los servicios externos, `04-servicios.md`.

## 1. Arquitectura en una página

BonCloud son tres piezas que se hablan por internet:

```
 Navegador del usuario
        │
        │ 1. descarga la web (archivos estáticos)
        ▼
 ┌──────────────────┐
 │  Web (React)     │  GitHub Pages
 │  bonking14.github.io/bon-cloud-5.0
 └────────┬─────────┘
          │ 2. pide y guarda datos (HTTPS + JSON)
          ▼
 ┌──────────────────┐        ┌──────────────┐
 │  API (Express)   │───────▶│  Resend      │  correos
 │  boncloud-api.onrender.com│  └──────────────┘
 └────────┬─────────┘
          │ 3. consultas SQL
          ▼
 ┌──────────────────┐
 │  PostgreSQL      │  Neon
 └──────────────────┘
```

- **Web:** una aplicación de una sola página hecha con React. Todo el contenido educativo
  (lecciones, glosario, subpartidas, formularios, calculadoras) vive en la web y funciona sin
  servidor. Por eso el modo invitado no necesita la API.
- **API:** un servidor Node.js con Express. Solo se usa para lo que necesita guardarse o
  controlarse: cuentas, progreso, grupos, notas, exámenes, certificados y licencias.
- **Base de datos:** PostgreSQL. La API es la única que se conecta a ella.

## 2. Tecnologías

| Capa | Tecnología | Para qué |
|---|---|---|
| Web | React 18, React Router 7 (HashRouter) | Interfaz y navegación |
| Web | Vite 8 | Compilar y servir en desarrollo |
| Web | jsPDF, jspdf-autotable, qrcode | PDF de constancias, informes y certificados con QR |
| Web | Vitest, Testing Library, jsdom | Pruebas |
| API | Node.js 22, Express 5 | Servidor |
| API | pg | Conexión a PostgreSQL |
| API | bcryptjs, jsonwebtoken | Contraseñas y sesiones |
| API | helmet, cors, express-rate-limit | Seguridad |
| API | node:test, supertest | Pruebas |
| Datos | PostgreSQL 16 | Almacenamiento |

No hay framework de CSS ni gestor de estado externo: estilos propios y contextos de React.

## 3. Modelo de datos

Todas las tablas se definen en `backend/db/schema.sql`. Al borrar un usuario se borra en
cascada todo lo suyo.

| Tabla | Qué guarda |
|---|---|
| `usuarios` | Cuenta: nombre, correo, contraseña cifrada, rol, verificación de correo, bloqueo por intentos, aceptación de términos, institución |
| `progreso_usuario` | Lecciones aprobadas por cada usuario |
| `tokens_cuenta` | Enlaces de un solo uso (recuperar contraseña, verificar correo); solo su huella SHA-256 |
| `grupos` | Grupos de un profesor, con su código de ingreso |
| `grupo_miembros` | Qué estudiante está en qué grupo |
| `intentos_quiz` | Cada quiz terminado: lección, aciertos, total y si aprobó |
| `examenes` | Cada examen final: preguntas que le tocaron, orden de opciones, vencimiento y nota |
| `certificados` | Un certificado por persona: código público, nombre y nota al emitirlo |
| `instituciones` | Licencias: cupos, vencimiento y estado |

**Migraciones.** No hay archivos de migración numerados. `schema.sql` es *idempotente*: usa
`CREATE TABLE IF NOT EXISTS` y `ADD COLUMN IF NOT EXISTS`, así que se puede aplicar las veces
que sea sin dañar datos. El servidor lo aplica en cada arranque, dentro de una transacción y
con un candado, antes de atender pedidos (`backend/db/esquema.js`). Si falla, el servidor no
arranca y la plataforma de alojamiento conserva la versión anterior.

## 4. Seguridad

**Contraseñas.** Se guardan con bcrypt (costo 12). Nunca se guardan ni se devuelven en claro.
Regla: mínimo 8 caracteres, una mayúscula, un número y un símbolo.

**Sesiones.** Al iniciar sesión la API entrega un token JWT firmado que vence en 8 horas. La
web lo guarda en el navegador y lo envía en cada pedido. No hay cookies.

**Bloqueo por intentos.** Cinco contraseñas incorrectas bloquean la cuenta 15 minutos.

**Roles.** Estudiante, profesor y administrador. Las rutas restringidas leen el rol de la
base de datos en cada pedido, no del token, de modo que quitar un rol surte efecto de
inmediato. Nadie cambia su propio rol.

**Aislamiento entre usuarios.** El identificador del usuario siempre sale del token, nunca de
la dirección ni del cuerpo del pedido. Un profesor solo ve sus grupos; el de otro responde
«no encontrado», igual que uno inexistente.

**Enlaces de correo.** Son de un solo uso, vencen (1 hora para recuperar contraseña, 48 para
verificar) y en la base queda solo su huella. Pedir recuperación responde igual exista o no
la cuenta.

**Límites de uso.** 100 pedidos de autenticación y 300 generales cada 15 minutos por
dirección IP; 5 envíos de correo y 10 intentos de código de grupo en el mismo lapso; 120
quizzes por hora por usuario.

**Examen.** El servidor elige las preguntas, baraja las opciones, guarda qué le tocó a cada
quien, controla el tiempo y califica. El navegador nunca recibe las respuestas del examen.
Limitación conocida: las preguntas salen del mismo banco de los quizzes, cuyas respuestas sí
viajan al navegador (ver sección 8).

**Otros.** Cabeceras de seguridad con helmet, CORS restringido a los orígenes de la web,
cuerpo de pedidos limitado a 100 kB, consultas SQL siempre parametrizadas.

## 5. Despliegue

Todo sale de la rama `main` del repositorio `bonking14/bon-cloud-5.0`.

- **Web:** el flujo `.github/workflows/deploy-web.yml` corre en cada cambio dentro de `web/`:
  instala, ejecuta las pruebas, compila y publica en GitHub Pages. Si una prueba falla, no
  publica.
- **API:** Render vigila `main` y redespliega solo (Auto-Deploy). Al arrancar pone la base al
  día. Tarda entre uno y varios minutos.
- **Base de datos:** no se despliega; la actualiza la API al arrancar.

Como la web y la API se actualizan por separado, durante unos minutos puede haber una web
nueva hablando con una API vieja. Las funciones nuevas darán error hasta que la API termine.

**Variables de entorno de la API** (en Render):

| Variable | Obligatoria | Uso |
|---|---|---|
| `DATABASE_URL` | Sí | Conexión a PostgreSQL |
| `JWT_SECRET` | Sí | Firma de las sesiones |
| `RESEND_API_KEY` | No | Envío de correos; sin ella los enlaces van al registro |
| `EMAIL_FROM` | No | Remitente de los correos |
| `APP_URL` | No | Dirección de la web, para los enlaces de los correos |
| `ADMIN_EMAILS` | No | Correos que pasan a administrador al verificarse |
| `CORS_ORIGINS` | No | Orígenes permitidos |
| `LICENCIA_OBLIGATORIA` | No | Exigir licencia vigente para crear grupos |
| `JWT_EXPIRES_IN`, `PORT` | No | Duración de la sesión y puerto |

**Variables de la web** (al compilar): `VITE_API_URL`, `VITE_CONTACTO_EMAIL`, `BASE_PATH`.

## 6. Pruebas

- **API:** 84 pruebas (`npm test` en `backend/`). Usan una base de datos simulada, así que no
  necesitan PostgreSQL. Cubren validaciones, permisos, calificación y licencias.
- **Web:** 76 pruebas (`npm test` en `web/`). Cubren cálculos, quizzes, sesión, formularios,
  integridad del contenido y las pantallas de cuenta.
- **Recorridos manuales:** cada entrega grande se probó además en un navegador automatizado
  contra una base PostgreSQL real. Esos recorridos no están guardados en el repositorio.

Lo que no tiene pruebas automáticas: el envío real de correos, el despliegue y la apariencia.

## 7. Operación

- **Salud:** `GET /api/salud` responde `{"ok":true}` solo si la API llega a la base de datos.
- **Registros:** en Render, pestaña *Logs*. Los errores empiezan por `❌`.
- **Copias de seguridad:** hoy no hay copias automáticas más allá de las 6 horas de historial
  del plan gratuito de Neon. Ver `docs/produccion.md`.
- **Arranque en frío:** en los planes gratuitos, tanto Render como Neon se duermen sin
  tráfico. El primer ingreso del día puede tardar hasta un minuto.

## 8. Limitaciones conocidas

1. **Banco de preguntas del examen compartido con los quizzes.** Un estudiante con
   conocimientos técnicos puede hallar las respuestas en el código de la web. Hace falta un
   banco propio, validado por un experto, que solo exista en el servidor.
2. **Nota de los quizzes calculada en el navegador.** Sirve para seguimiento, no para
   certificar.
3. **Correos solo al dueño de la cuenta de Resend**, hasta verificar un dominio propio.
4. **Sin copias de seguridad automáticas** ni monitoreo de caídas.
5. **Sesión en el almacenamiento del navegador.** Es lo habitual en aplicaciones de este
   tipo, pero un script malicioso inyectado podría leerla; la web no carga código de terceros
   salvo las fuentes de Google.
6. **Textos legales sin revisión jurídica** y contenido sin firma de un profesional de
   aduanas.
7. **RUT reconstruido.** La DIAN no publica su hoja en blanco; las casillas son las del
   instructivo oficial, pero la distribución es aproximada.
8. **Sin pasarela de pago.** Las licencias se registran a mano.
