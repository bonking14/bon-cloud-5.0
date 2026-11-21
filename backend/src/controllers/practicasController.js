const pool = require('../config/db');

// Prácticas que se pueden registrar. El identificador viaja desde la web.
const PRACTICAS = ['sigloxxii-importacion', 'sigloxxii-rop', 'sigloxxii-correccion'];
const MAX_POR_HORA = 30;

// Guarda una práctica terminada en un simulador. La web avisa que el estudiante llegó al
// final: sirve para el seguimiento del profesor, no para certificar.
const registrarPractica = async (req, res) => {
  const { practica, errores, conSolucion } = req.body || {};
  if (!PRACTICAS.includes(practica) || !Number.isInteger(errores) || errores < 0 || errores > 1000 || typeof conSolucion !== 'boolean') {
    return res.status(400).json({ error: 'Datos de la práctica inválidos.' });
  }
  // El tope por hora va en la misma consulta: nadie llena la tabla con un script
  const r = await pool.query(
    `INSERT INTO practicas (usuario_id, practica, errores, con_solucion)
     SELECT $1, $2, $3, $4
      WHERE (SELECT COUNT(*) FROM practicas WHERE usuario_id = $1 AND completada_en > NOW() - INTERVAL '1 hour') < $5
  RETURNING id`,
    [req.usuario.id, practica, errores, conSolucion, MAX_POR_HORA]
  );
  if (!r.rows.length) return res.status(429).json({ error: 'Demasiadas prácticas en la última hora.' });
  res.status(201).json({ ok: true });
};

module.exports = { registrarPractica, PRACTICAS };
