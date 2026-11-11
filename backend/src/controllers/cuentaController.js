const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { errorPassword } = require('./authController');

const publico = (u) => ({
  id: u.id, nombre: u.nombre, email: u.email, rol: u.rol,
  emailVerificado: Boolean(u.email_verificado), creadoEn: u.creado_en,
});

// El id siempre sale del token (req.usuario), nunca de la URL ni del body.
const verCuenta = async (req, res) => {
  const r = await pool.query('SELECT id, nombre, email, rol, email_verificado, creado_en FROM usuarios WHERE id = $1', [req.usuario.id]);
  if (!r.rows.length) return res.status(404).json({ error: 'La cuenta ya no existe.' });
  res.json({ usuario: publico(r.rows[0]) });
};

const actualizarCuenta = async (req, res) => {
  const { nombre } = req.body || {};
  if (typeof nombre !== 'string' || !nombre.trim() || nombre.length > 100) {
    return res.status(400).json({ error: 'Escribe tu nombre (máximo 100 caracteres).' });
  }
  const r = await pool.query(
    'UPDATE usuarios SET nombre = $2 WHERE id = $1 RETURNING id, nombre, email, rol, email_verificado, creado_en',
    [req.usuario.id, nombre.trim()]
  );
  if (!r.rows.length) return res.status(404).json({ error: 'La cuenta ya no existe.' });
  res.json({ mensaje: 'Perfil actualizado.', usuario: publico(r.rows[0]) });
};

const cambiarPassword = async (req, res) => {
  const { actual, nueva } = req.body || {};
  if (typeof actual !== 'string' || !actual) return res.status(400).json({ error: 'Escribe tu contraseña actual.' });
  const malaClave = errorPassword(nueva);
  if (malaClave) return res.status(400).json({ error: malaClave });

  const r = await pool.query('SELECT password FROM usuarios WHERE id = $1', [req.usuario.id]);
  if (!r.rows.length) return res.status(404).json({ error: 'La cuenta ya no existe.' });
  if (!(await bcrypt.compare(actual, r.rows[0].password))) {
    return res.status(400).json({ error: 'La contraseña actual no coincide.' });
  }
  await pool.query('UPDATE usuarios SET password = $2 WHERE id = $1', [req.usuario.id, await bcrypt.hash(nueva, 12)]);
  res.json({ mensaje: 'Contraseña actualizada.' });
};

module.exports = { verCuenta, actualizarCuenta, cambiarPassword };
