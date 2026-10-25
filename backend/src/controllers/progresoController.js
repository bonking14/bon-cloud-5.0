const pool = require('../config/db');

const INT_MAX = 2147483647;

// El id del usuario siempre sale del token (req.usuario), nunca de la URL ni del body.
const obtenerProgreso = async (req, res) => {
  const result = await pool.query(
    'SELECT leccion_id FROM progreso_usuario WHERE usuario_id = $1 ORDER BY leccion_id',
    [req.usuario.id]
  );

  res.json({
    ok: true,
    progreso: { leccionesCompletadas: result.rows.map((fila) => fila.leccion_id) }
  });
};

// Reemplaza el conjunto de lecciones completadas del usuario por el que llega.
// Las que ya estaban conservan su fecha de completada_en.
const guardarProgreso = async (req, res) => {
  const { progreso } = req.body || {};
  if (!progreso || !Array.isArray(progreso.leccionesCompletadas)) {
    return res.status(400).json({ ok: false, error: 'Formato de progreso inválido.' });
  }

  const lecciones = [...new Set(
    progreso.leccionesCompletadas.filter((id) => Number.isInteger(id) && id >= 0 && id <= INT_MAX)
  )];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'DELETE FROM progreso_usuario WHERE usuario_id = $1 AND NOT (leccion_id = ANY($2::int[]))',
      [req.usuario.id, lecciones]
    );
    await client.query(
      `INSERT INTO progreso_usuario (usuario_id, leccion_id)
       SELECT $1, UNNEST($2::int[])
       ON CONFLICT (usuario_id, leccion_id) DO NOTHING`,
      [req.usuario.id, lecciones]
    );
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }

  res.json({ ok: true, mensaje: 'Progreso guardado.' });
};

module.exports = { obtenerProgreso, guardarProgreso };
