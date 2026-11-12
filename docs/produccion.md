# Pasar BonCloud a producción

Lo que falta para vender el servicio y no puede hacerse desde el código. Está en el orden
recomendado.

## 1. Dominio propio

1. Compra el dominio (por ejemplo `boncloud.co`).
2. **Web:** en GitHub, *Settings → Pages → Custom domain*, escribe `www.tudominio` y crea en tu
   proveedor de dominio el registro `CNAME` que GitHub indica. Activa *Enforce HTTPS*.
   En `.github/workflows/deploy-web.yml` cambia `BASE_PATH` a `/`, porque con dominio propio
   la web ya no vive en `/bon-cloud-5.0/`.
3. **API:** en Render, *Settings → Custom Domains*, agrega `api.tudominio` y crea el `CNAME`.
4. **Variables en Render** (*Environment*):
   - `CORS_ORIGINS=https://www.tudominio`
   - `APP_URL=https://www.tudominio/` (con ella se arman los enlaces de los correos)
5. **Variable de la web:** en GitHub, *Settings → Secrets and variables → Actions → Variables*,
   `VITE_API_URL=https://api.tudominio/api`, y pásala al paso de build del workflow.

## 2. Correos a cualquier destinatario

Sin dominio verificado, Resend solo entrega a la dirección de tu propia cuenta.

1. En Resend, *Domains → Add Domain*, agrega tu dominio y crea los registros DNS que pide.
2. En Render: `EMAIL_FROM=BonCloud <no-responder@tudominio>`.
3. Prueba con «¿Olvidaste tu contraseña?» usando un correo que no sea el tuyo.
4. Cuando funcione, se puede exigir correo confirmado para unirse a un grupo.

## 3. Servidor que no se duerma

El plan gratuito de Render apaga el servidor sin tráfico: el primer ingreso tarda hasta un
minuto. Pasa el servicio a un plan pago (*Settings → Instance Type*).

## 4. Copias de seguridad

- La base gratuita de Render **se borra a los 30 días** si no se pasa a un plan pago, y no
  tiene copias automáticas. Pásala a un plan pago, que incluye copias diarias.
- Para sacar una copia a mano, con la *External Database URL* de Render:

  ```bash
  pg_dump "URL_EXTERNA" --no-owner --format=custom --file=boncloud-AAAA-MM-DD.dump
  ```

- Para restaurarla en una base vacía:

  ```bash
  pg_restore --no-owner --dbname="URL_DE_LA_BASE_NUEVA" boncloud-AAAA-MM-DD.dump
  ```

- Haz una restauración de prueba al menos una vez: una copia que nunca se ha restaurado no
  es una copia.

## 5. Monitoreo

- `GET /api/salud` responde `{ "ok": true }` solo si el servidor llega a la base de datos.
  Apúntale un monitor gratuito (UptimeRobot, Better Stack) cada 5 minutos, con aviso al correo.
- Los errores quedan en *Logs* de Render. Busca `❌`.

## 6. Licencias

- En «Licencias» crea cada institución con sus cupos y su vencimiento, y en «Usuarios» asigna
  sus profesores.
- Cuando todos los profesores tengan institución, pon `LICENCIA_OBLIGATORIA=true` en Render:
  desde ahí nadie crea grupos sin licencia vigente.

## 7. Antes de cobrar

- [ ] Un abogado revisó los términos y la política de datos (`web/src/features/legal/textos.js`)
      y confirmó el uso comercial de los diseños de formularios de la DIAN.
- [ ] `VITE_CONTACTO_EMAIL` tiene el correo para consultas sobre datos personales.
- [ ] Un profesional de aduanas revisó el contenido con `docs/revision-contenido.md` y quedó
      registrado en `web/src/data/revision.js`.
- [ ] El examen final tiene un banco de preguntas propio (hoy usa las de los quizzes, cuyas
      respuestas viajan al navegador).
