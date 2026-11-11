const pool = require('../config/db');

// Misma regla que la web: se aprueba con el 70% (redondeado hacia arriba)
const UMBRAL = 0.7;
const MAX_POR_HORA = 120;

// Guarda un quiz terminado. La nota la calcula el navegador: sirve para el seguimiento del
// profesor, no para certificar (el examen final se califica en el servidor).
const registrarIntento = async (req, res) => {
  const { leccionId, aciertos, total } = req.body || {};
  const entero = (n, min, max) => Number.isInteger(n) && n >= min && n <= max;
  if (!entero(leccionId, 1, 10000) || !entero(total, 1, 100) || !entero(aciertos, 0, total)) {
    return res.status(400).json({ error: 'Datos del intento inválidos.' });
  }
  const aprobado = aciertos >= Math.ceil(total * UMBRAL);
  // El tope por hora va en la misma consulta: nadie llena la tabla con un script
  const r = await pool.query(
    `INSERT INTO intentos_quiz (usuario_id, leccion_id, aciertos, total, aprobado)
     SELECT $1, $2, $3, $4, $5
      WHERE (SELECT COUNT(*) FROM intentos_quiz WHERE usuario_id = $1 AND creado_en > NOW() - INTERVAL '1 hour') < $6
  RETURNING id`,
    [req.usuario.id, leccionId, aciertos, total, aprobado, MAX_POR_HORA]
  );
  if (!r.rows.length) return res.status(429).json({ error: 'Demasiados intentos en la última hora.' });
  res.status(201).json({ ok: true, aprobado });
};

module.exports = { registrarIntento, UMBRAL };
