const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const env = require('../config/env');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_SEGURA = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
const MAX_INTENTOS = 5;
const MINUTOS_BLOQUEO = 15;

// REGISTRO
const register = async (req, res) => {
  const { nombre, email, password } = req.body || {};

  if (typeof nombre !== 'string' || !nombre.trim() || nombre.length > 100) {
    return res.status(400).json({ error: 'Escribe tu nombre (máximo 100 caracteres).' });
  }
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Escribe un correo electrónico válido.' });
  }
  if (typeof password !== 'string' || password.length > 72) {
    return res.status(400).json({ error: 'La contraseña no es válida (máximo 72 caracteres).' });
  }
  if (!PASSWORD_SEGURA.test(password)) {
    return res.status(400).json({
      error: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo (!@#$%^&*).'
    });
  }

  const emailNormalizado = email.trim().toLowerCase();

  const existe = await pool.query('SELECT id FROM usuarios WHERE LOWER(email) = $1', [emailNormalizado]);
  if (existe.rows.length > 0) {
    return res.status(400).json({ error: 'Este correo ya está registrado.' });
  }

  const hash = await bcrypt.hash(password, 12);

  let result;
  try {
    result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
      [nombre.trim(), emailNormalizado, hash]
    );
  } catch (err) {
    // Dos registros simultáneos con el mismo correo: lo frena la restricción UNIQUE
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Este correo ya está registrado.' });
    }
    throw err;
  }

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
    `SELECT id, nombre, email, password, bloqueado,
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

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  res.json({
    mensaje: 'Login exitoso.',
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email
    }
  });
};

module.exports = { register, login };
