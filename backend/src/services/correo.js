// Envío de correos con Resend (https://resend.com), llamando a su API directamente.
// Sin RESEND_API_KEY no se envía nada: el contenido se escribe en el registro del servidor,
// para poder probar en local y para que el servidor funcione antes de configurar el correo.
const env = require('../config/env');

const escapar = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Nunca lanza error: que falle el correo no debe tumbar el registro ni revelar si una cuenta existe.
async function enviar({ para, asunto, texto, html }) {
  if (!env.resendApiKey) {
    console.log(`✉️  (correo sin configurar) Para: ${para} · ${asunto}\n${texto}`);
    return { enviado: false };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.resendApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.emailRemitente, to: [para], subject: asunto, text: texto, html }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error(`❌ Resend respondió ${res.status} al enviar "${asunto}"`);
      return { enviado: false };
    }
    return { enviado: true };
  } catch (err) {
    console.error(`❌ No se pudo enviar "${asunto}": ${err.message}`);
    return { enviado: false };
  }
}

function plantilla({ saludo, parrafo, boton, enlace, nota }) {
  const texto = `${saludo}\n\n${parrafo}\n\n${enlace}\n\n${nota}\n\nBonCloud`;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#0f172a">
  <h2 style="color:#1d4ed8">BonCloud</h2>
  <p>${escapar(saludo)}</p>
  <p>${escapar(parrafo)}</p>
  <p><a href="${escapar(enlace)}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">${escapar(boton)}</a></p>
  <p style="font-size:13px;color:#475569">Si el botón no abre, copia este enlace en tu navegador:<br>${escapar(enlace)}</p>
  <p style="font-size:13px;color:#475569">${escapar(nota)}</p>
</div>`;
  return { texto, html };
}

const enlaceWeb = (ruta, token) => `${env.appUrl}#/${ruta}?token=${token}`;

function enviarRecuperacion(usuario, token) {
  return enviar({
    para: usuario.email,
    asunto: 'Restablece tu contraseña de BonCloud',
    ...plantilla({
      saludo: `Hola, ${usuario.nombre}:`,
      parrafo: 'Recibimos una solicitud para restablecer la contraseña de tu cuenta. El enlace vence en 1 hora y sirve una sola vez.',
      boton: 'Restablecer contraseña',
      enlace: enlaceWeb('restablecer', token),
      nota: 'Si no fuiste tú, ignora este correo: tu contraseña no cambia.',
    }),
  });
}

function enviarVerificacion(usuario, token) {
  return enviar({
    para: usuario.email,
    asunto: 'Confirma tu correo en BonCloud',
    ...plantilla({
      saludo: `Hola, ${usuario.nombre}:`,
      parrafo: 'Confirma que este correo es tuyo para terminar de activar tu cuenta. El enlace vence en 48 horas.',
      boton: 'Confirmar correo',
      enlace: enlaceWeb('verificar-correo', token),
      nota: 'Si no creaste una cuenta en BonCloud, ignora este correo.',
    }),
  });
}

module.exports = { enviar, enviarRecuperacion, enviarVerificacion };
