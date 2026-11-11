const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const env = require('../config/env');
const { crearToken, consumirToken } = require('../services/tokens');
const { enviarRecuperacion, enviarVerificacion } = require('../services/correo');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_SEGURA = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
const MAX_INTENTOS = 5;
const MINUTOS_BLOQUEO = 15;
const MINUTOS_RECUPERAR = 60;
const MINUTOS_VERIFICAR = 48 * 60;

// Devuelve el mensaje de error de una contraseña nueva, o '' si sirve
const errorPassword = (password) => {
  if (typeof password !== 'string' || password.length > 72) return 'La contraseña no es válida (máximo 72 caracteres).';
  if (!PASSWORD_SEGURA.test(password)) return 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo (!@#$%^&*).';
  return '';
};

const enviarEnlaceVerificacion = async (usuario) => {
  const token = await crearToken(usuario.id, 'verificar', MINUTOS_VERIFICAR);
  await enviarVerificacion(usuario, token);
};

// REGISTRO
const register = async (req, res) => {
  const { nombre, email, password, aceptaTerminos, versionTerminos } = req.body || {};
  // La web exige marcar la casilla; aquí queda la constancia de cuándo y de qué versión
  const acepto = aceptaTerminos === true;
  const version = acepto && typeof versionTerminos === 'string' ? versionTerminos.slice(0, 20) : null;

  if (typeof nombre !== 'string' || !nombre.trim() || nombre.length > 100) {
    return res.status(400).json({ error: 'Escribe tu nombre (máximo 100 caracteres).' });
  }
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Escribe un correo electrónico válido.' });
  }
  const malaClave = errorPassword(password);
  if (malaClave) return res.status(400).json({ error: malaClave });

  const emailNormalizado = email.trim().toLowerCase();

  const existe = await pool.query('SELECT id FROM usuarios WHERE LOWER(email) = $1', [emailNormalizado]);
  if (existe.rows.length > 0) {
    return res.status(400).json({ error: 'Este correo ya está registrado.' });
  }

  const hash = await bcrypt.hash(password, 12);

  let result;
  try {
    result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, terminos_aceptados_en, terminos_version)
       VALUES ($1, $2, $3, CASE WHEN $4 THEN NOW() END, $5) RETURNING id, nombre, email`,
      [nombre.trim(), emailNormalizado, hash, acepto, version]
    );
  } catch (err) {
    // Dos registros simultáneos con el mismo correo: lo frena la restricción UNIQUE
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Este correo ya está registrado.' });
    }
    throw err;
  }

  // Todo registro nuevo es estudiante; el correo queda por confirmar
  await enviarEnlaceVerificacion(result.rows[0]);

  res.status(201).json({
    mensaje: 'Usuario registrado exitosamente.',
    usuario: result.rows[0]
  });
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ error: 'Escribe tu correo y tu contraseña.' });
  }

  const result = await pool.query(
    `SELECT id, nombre, email, password, bloqueado, rol, email_verificado,
            COALESCE(bloqueado_hasta > NOW(), false) AS bloqueo_temporal
       FROM usuarios
      WHERE LOWER(email) = $1`,
    [email.trim().toLowerCase()]
  );
  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Credenciales incorrectas.' });
  }

  const usuario = result.rows[0];

  // Bloqueo manual (lo pone un administrador en la base de datos)
  if (usuario.bloqueado) {
    return res.status(403).json({ error: 'Cuenta bloqueada. Contacta al administrador.' });
  }

  if (usuario.bloqueo_temporal) {
    return res.status(403).json({
      error: `Cuenta bloqueada temporalmente por intentos fallidos. Intenta de nuevo en ${MINUTOS_BLOQUEO} minutos.`
    });
  }

  const valida = await bcrypt.compare(password, usuario.password);

  if (!valida) {
    // Suma el intento en la misma consulta; al llegar al máximo bloquea por un rato
    // y reinicia el contador.
    const fallo = await pool.query(
      `UPDATE usuarios
          SET intentos_fallidos = CASE WHEN intentos_fallidos + 1 >= $2 THEN 0 ELSE intentos_fallidos + 1 END,
              bloqueado_hasta = CASE WHEN intentos_fallidos + 1 >= $2
                                     THEN NOW() + make_interval(mins => $3)
                                     ELSE bloqueado_hasta END
        WHERE id = $1
    RETURNING intentos_fallidos, COALESCE(bloqueado_hasta > NOW(), false) AS bloqueo_temporal`,
      [usuario.id, MAX_INTENTOS, MINUTOS_BLOQUEO]
    );
    const { intentos_fallidos: intentos, bloqueo_temporal: bloqueado } = fallo.rows[0];

    if (bloqueado) {
      return res.status(403).json({
        error: `Cuenta bloqueada por ${MINUTOS_BLOQUEO} minutos tras ${MAX_INTENTOS} intentos fallidos.`
      });
    }

    return res.status(401).json({
      error: `Credenciales incorrectas. Intentos fallidos: ${intentos}/${MAX_INTENTOS}`
    });
  }

  await pool.query(
    'UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL, ultimo_login = NOW() WHERE id = $1',
    [usuario.id]
  );

  const rol = usuario.rol || 'estudiante';
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  res.json({
    mensaje: 'Login exitoso.',
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol,
      emailVerificado: Boolean(usuario.email_verificado)
    }
  });
};

// RECUPERAR CONTRASEÑA: pide el enlace. Responde igual exista o no la cuenta,
// para no revelar qué correos están registrados.
const MENSAJE_RECUPERAR = 'Si ese correo está registrado, te enviamos un enlace para restablecer la contraseña.';
const forgotPassword = async (req, res) => {
  const { email } = req.body || {};
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Escribe un correo electrónico válido.' });
  }
  const r = await pool.query(
    'SELECT id, nombre, email, bloqueado FROM usuarios WHERE LOWER(email) = $1',
    [email.trim().toLowerCase()]
  );
  const usuario = r.rows[0];
  if (usuario && !usuario.bloqueado) {
    const token = await crearToken(usuario.id, 'recuperar', MINUTOS_RECUPERAR);
    await enviarRecuperacion(usuario, token);
  }
  res.json({ mensaje: MENSAJE_RECUPERAR });
};

// RESTABLECER CONTRASEÑA con el enlace del correo
const resetPassword = async (req, res) => {
  const { token, password } = req.body || {};
  const malaClave = errorPassword(password);
  if (malaClave) return res.status(400).json({ error: malaClave });

  const usuarioId = await consumirToken(token, 'recuperar');
  if (!usuarioId) {
    return res.status(400).json({ error: 'El enlace no es válido o ya venció. Pide uno nuevo.' });
  }
  const hash = await bcrypt.hash(password, 12);
  // Quien abre el enlace demostró que el correo es suyo: queda verificado, y se levanta
  // el bloqueo temporal por intentos fallidos (no el bloqueo manual de un administrador).
  await pool.query(
    `UPDATE usuarios
        SET password = $2, intentos_fallidos = 0, bloqueado_hasta = NULL,
            email_verificado = TRUE, email_verificado_en = COALESCE(email_verificado_en, NOW())
      WHERE id = $1`,
    [usuarioId, hash]
  );
  await promoverSiEsAdmin(usuarioId);
  res.json({ mensaje: 'Contraseña actualizada. Ya puedes iniciar sesión.' });
};

// Los correos de ADMIN_EMAILS pasan a administrador, pero solo después de demostrar que el
// correo es suyo: registrarse con el correo de otro no da ningún permiso.
const promoverSiEsAdmin = async (usuarioId) => {
  if (!env.adminEmails.length) return;
  await pool.query(
    `UPDATE usuarios SET rol = 'administrador'
      WHERE id = $1 AND email_verificado AND rol <> 'administrador' AND LOWER(email) = ANY($2::text[])`,
    [usuarioId, env.adminEmails]
  );
};

// VERIFICAR CORREO con el enlace
const verifyEmail = async (req, res) => {
  const usuarioId = await consumirToken((req.body || {}).token, 'verificar');
  if (!usuarioId) {
    return res.status(400).json({ error: 'El enlace no es válido o ya venció. Pide uno nuevo desde tu perfil.' });
  }
  await pool.query(
    'UPDATE usuarios SET email_verificado = TRUE, email_verificado_en = COALESCE(email_verificado_en, NOW()) WHERE id = $1',
    [usuarioId]
  );
  await promoverSiEsAdmin(usuarioId);
  res.json({ mensaje: 'Correo confirmado. Si tenías la sesión abierta, vuelve a iniciarla para ver los cambios.' });
};

// Reenvía el enlace de verificación al usuario de la sesión
const resendVerification = async (req, res) => {
  const r = await pool.query('SELECT id, nombre, email, email_verificado FROM usuarios WHERE id = $1', [req.usuario.id]);
  const usuario = r.rows[0];
  if (!usuario) return res.status(404).json({ error: 'La cuenta ya no existe.' });
  if (usuario.email_verificado) return res.json({ mensaje: 'Tu correo ya está confirmado.' });
  await enviarEnlaceVerificacion(usuario);
  res.json({ mensaje: 'Te enviamos un nuevo enlace de confirmación.' });
};

module.exports = { register, login, forgotPassword, resetPassword, verifyEmail, resendVerification, errorPassword };
