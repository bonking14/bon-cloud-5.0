# BonCloud · Servicios que usa

Qué servicios externos hacen funcionar a BonCloud, para qué sirve cada uno, qué pasa si
falla y qué límites tiene. Hoy todos están en su plan gratuito.

## 1. Mapa

| Servicio | Para qué | Cuenta donde se administra |
|---|---|---|
| **GitHub** | Guarda el código y su historial | github.com/bonking14/bon-cloud-5.0 |
| **GitHub Actions** | Prueba, compila y publica la web en cada cambio | El mismo repositorio, pestaña *Actions* |
| **GitHub Pages** | Sirve la web al público | El mismo repositorio, *Settings → Pages* |
| **Render** | Ejecuta la API | dashboard.render.com, servicio `boncloud-api` |
| **Neon** | Base de datos PostgreSQL | console.neon.tech |
| **Resend** | Envía los correos | resend.com |
| **datos.gov.co** | Tasa de cambio oficial (TRM) | Público, sin cuenta |
| **Google Fonts** | Tipos de letra de la página | Público, sin cuenta |

## 2. Qué hace cada uno

### GitHub, Actions y Pages

El código vive en GitHub. Cada vez que se publica un cambio en la rama `main` que toque la
carpeta `web/`, GitHub Actions instala, corre las 76 pruebas, compila y entrega el resultado
a GitHub Pages, que lo sirve en `https://bonking14.github.io/bon-cloud-5.0/`.

- **Si falla:** la web no carga. Es poco frecuente.
- **Si una prueba falla:** no se publica y queda la versión anterior.

### Render

Ejecuta la API en `https://boncloud-api.onrender.com`. Vigila la rama `main` y se actualiza
solo. Guarda las variables de entorno, entre ellas las claves.

- **Si falla:** siguen funcionando el modo invitado y todo el contenido, pero no se puede
  iniciar sesión, guardar progreso, usar grupos ni presentar exámenes.
- **Plan gratuito:** el servidor se apaga tras un rato sin tráfico y tarda cerca de un
  minuto en despertar con el primer pedido. La propia página de Render lo advierte.

### Neon

Aloja la base de datos. La API se conecta con la dirección guardada en `DATABASE_URL`.

- **Si falla:** igual que si fallara Render.
- **Plan gratuito** (documentación de Neon consultada en noviembre de 2026):
  - 1 GB de almacenamiento y 100 horas de cómputo al mes por proyecto.
  - Se duerme tras 5 minutos sin uso; despierta sola.
  - Si se acaban las horas, se suspende hasta el mes siguiente. Si se llena, deja de aceptar
    escrituras. No borra datos.
  - Permite volver atrás solo 6 horas. No equivale a una copia de seguridad.

Los datos de BonCloud son pequeños (texto y números): 1 GB alcanza para decenas de miles de
estudiantes. El límite que llegará primero es el de horas de cómputo si hay uso continuo.

### Resend

Envía dos correos: confirmar el correo y restablecer la contraseña. La API usa la clave
guardada en `RESEND_API_KEY`.

- **Si falla o no hay clave:** todo funciona, pero el enlace no se envía; queda escrito en
  los *Logs* de Render.
- **Limitación actual:** sin un dominio propio verificado, Resend solo entrega correos a la
  dirección de la cuenta. Los estudiantes no los reciben.

### datos.gov.co

La página de inicio y las calculadoras consultan la TRM oficial que publica el portal de
datos abiertos del Estado. La consulta la hace el navegador, no la API.

- **Si falla:** se usa un valor de respaldo de 4.000 y la página lo indica.

### Google Fonts

Provee los tipos de letra Inter y Archivo Black.

- **Si falla:** la página se ve con los tipos de letra del sistema.

## 3. Cómo viaja un pedido

Ejemplo: un estudiante termina un quiz.

1. El navegador ya descargó la web desde GitHub Pages.
2. La web calcula la nota y la envía a la API en Render, con el token de sesión.
3. La API comprueba el token, valida los números y decide si aprobó.
4. La API guarda el intento en Neon.
5. Cuando el profesor abre su panel, la API lee de Neon y devuelve el resumen.

Ninguna clave ni contraseña pasa por el navegador, salvo la contraseña del usuario al
iniciar sesión, que viaja cifrada por HTTPS.

## 4. Dónde está cada clave

| Dato | Dónde se guarda | Quién lo ve |
|---|---|---|
| Contraseña de la base de datos | Dentro de `DATABASE_URL`, en Render | Solo quien entra a Render |
| Clave de firma de sesiones | `JWT_SECRET`, en Render | Igual |
| Clave de Resend | `RESEND_API_KEY`, en Render | Igual |
| Contraseñas de usuarios | En Neon, cifradas de forma irreversible | Nadie |

Ninguna clave está en el código ni en GitHub. Si alguna se filtra, se cambia en el servicio
que la emitió y se actualiza en Render.

## 5. Costos

Hoy el costo mensual es **cero**. Para vender el servicio hay que pagar tres cosas, cuyos
precios cambian y deben consultarse en la página de cada proveedor:

| Qué | Por qué | Dónde ver el precio |
|---|---|---|
| Plan pago de Render | Que el servidor no se duerma | render.com/pricing |
| Plan pago de Neon | Copias de seguridad de 7 días o más y más horas de cómputo | neon.com/pricing |
| Dominio propio | Imagen, y poder enviar correos a cualquiera | Cualquier registrador |

GitHub Pages, GitHub Actions (para repositorios públicos) y Resend (para el volumen actual)
pueden seguir en su plan gratuito.

## 6. Qué pasa si un proveedor desaparece

Ninguno es difícil de reemplazar, porque el sistema usa piezas estándar:

- La web son archivos estáticos: se pueden alojar en cualquier parte.
- La API es Node.js sin nada propio de Render.
- La base es PostgreSQL común: se exporta con `pg_dump` y se importa en otro proveedor.
- El envío de correos está en un solo archivo (`backend/src/services/correo.js`).

Lo único que no se puede recuperar si se pierde son **los datos**, y por eso las copias de
seguridad son el pendiente más importante. Ver `docs/produccion.md`.
