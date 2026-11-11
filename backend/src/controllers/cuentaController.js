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

// Derecho a conocer los datos: todo lo que BonCloud guarda de la persona, en un solo archivo
const exportarDatos = async (req, res) => {
  const id = req.usuario.id;
  const q = (sql) => pool.query(sql, [id]).then((r) => r.rows);
  const [cuenta, progreso, intentos, examenes, certificados, grupos, gruposPropios] = await Promise.all([
    q('SELECT id, nombre, email, rol, email_verificado, creado_en, ultimo_login, terminos_aceptados_en, terminos_version FROM usuarios WHERE id = $1'),
    q('SELECT leccion_id, completada_en FROM progreso_usuario WHERE usuario_id = $1 ORDER BY leccion_id'),
    q('SELECT leccion_id, aciertos, total, aprobado, creado_en FROM intentos_quiz WHERE usuario_id = $1 ORDER BY id'),
    q('SELECT modulo, iniciado_en, enviado_en, aciertos, total, aprobado FROM examenes WHERE usuario_id = $1 ORDER BY id'),
    q('SELECT codigo, nombre, nota, emitido_en FROM certificados WHERE usuario_id = $1'),
    q('SELECT g.nombre, m.unido_en FROM grupo_miembros m JOIN grupos g ON g.id = m.grupo_id WHERE m.usuario_id = $1'),
    q('SELECT nombre, codigo, archivado, creado_en FROM grupos WHERE profesor_id = $1'),
  ]);
  if (!cuenta.length) return res.status(404).json({ error: 'La cuenta ya no existe.' });
  res.json({ generadoEn: new Date().toISOString(), cuenta: cuenta[0], progreso, intentosDeQuiz: intentos, examenes, certificados, gruposALosQuePertenece: grupos, gruposQueDirige: gruposPropios });
};

// Derecho a suprimir: borra la cuenta y, en cascada, su progreso, notas, exámenes, certificado,
// membresías y los grupos que dirige. Pide la contraseña y no tiene vuelta atrás.
const eliminarCuenta = async (req, res) => {
  const { password } = req.body || {};
  if (typeof password !== 'string' || !password) return res.status(400).json({ error: 'Escribe tu contraseña para confirmar.' });
  const r = await pool.query('SELECT password, rol FROM usuarios WHERE id = $1', [req.usuario.id]);
  if (!r.rows.length) return res.status(404).json({ error: 'La cuenta ya no existe.' });
  if (!(await bcrypt.compare(password, r.rows[0].password))) return res.status(400).json({ error: 'La contraseña no coincide.' });
  if (r.rows[0].rol === 'administrador') {
    const otros = await pool.query("SELECT COUNT(*) AS n FROM usuarios WHERE rol = 'administrador' AND id <> $1", [req.usuario.id]);
    if (Number(otros.rows[0]?.n) === 0) return res.status(400).json({ error: 'Eres el único administrador. Nombra a otro antes de eliminar tu cuenta.' });
  }
  await pool.query('DELETE FROM usuarios WHERE id = $1', [req.usuario.id]);
  res.json({ mensaje: 'Tu cuenta y tus datos fueron eliminados.' });
};

module.exports = { verCuenta, actualizarCuenta, cambiarPassword, exportarDatos, eliminarCuenta };
