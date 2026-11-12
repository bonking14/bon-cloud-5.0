const pool = require('../config/db');

const idDe = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
const fechaValida = (f) => f === null || (typeof f === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(f) && !Number.isNaN(Date.parse(f)));
const publico = (i) => ({
  id: i.id, nombre: i.nombre, cupos: i.cupos, venceEn: i.vence_en, activa: i.activa, notas: i.notas || '',
  vencida: Boolean(i.vencida), profesores: Number(i.profesores ?? 0), usados: Number(i.usados ?? 0),
});
const CAMPOS = `i.id, i.nombre, i.cupos, to_char(i.vence_en, 'YYYY-MM-DD') AS vence_en, i.activa, i.notas,
  (i.vence_en IS NOT NULL AND i.vence_en < CURRENT_DATE) AS vencida`;

// Revisa los datos de crear o editar; devuelve el mensaje de error o ''
const errorDatos = ({ nombre, cupos, venceEn, activa, notas }, completo) => {
  if ((completo || nombre !== undefined) && (typeof nombre !== 'string' || !nombre.trim() || nombre.length > 150)) return 'Escribe el nombre de la institución (máximo 150 caracteres).';
  if ((completo || cupos !== undefined) && (!Number.isInteger(cupos) || cupos < 0 || cupos > 100000)) return 'Los cupos deben ser un número entero entre 0 y 100000.';
  if (venceEn !== undefined && !fechaValida(venceEn)) return 'La fecha de vencimiento debe tener el formato AAAA-MM-DD, o ir vacía si no vence.';
  if (activa !== undefined && typeof activa !== 'boolean') return 'Dato inválido.';
  if (notas !== undefined && (typeof notas !== 'string' || notas.length > 500)) return 'Las notas admiten máximo 500 caracteres.';
  return '';
};

const listar = async (req, res) => {
  const r = await pool.query(
    `SELECT ${CAMPOS},
            (SELECT COUNT(*) FROM usuarios u WHERE u.institucion_id = i.id) AS profesores,
            (SELECT COUNT(DISTINCT m.usuario_id) FROM grupo_miembros m JOIN grupos g ON g.id = m.grupo_id
               JOIN usuarios p ON p.id = g.profesor_id WHERE p.institucion_id = i.id) AS usados
       FROM instituciones i ORDER BY i.activa DESC, LOWER(i.nombre)`
  );
  res.json({ instituciones: r.rows.map(publico) });
};

const crear = async (req, res) => {
  const d = req.body || {};
  const error = errorDatos(d, true);
  if (error) return res.status(400).json({ error });
  const r = await pool.query(
    `INSERT INTO instituciones AS i (nombre, cupos, vence_en, notas) VALUES ($1, $2, $3, $4) RETURNING ${CAMPOS}`,
    [d.nombre.trim(), d.cupos, d.venceEn ?? null, d.notas?.trim() || null]
  );
  res.status(201).json({ mensaje: 'Institución creada.', institucion: publico(r.rows[0]) });
};

const actualizar = async (req, res) => {
  const id = idDe(req.params.id);
  const d = req.body || {};
  const error = id ? errorDatos(d, false) : 'Institución inválida.';
  if (error) return res.status(400).json({ error });
  // venceEn puede venir en null para quitar el vencimiento: por eso lleva su propia bandera
  const r = await pool.query(
    `UPDATE instituciones AS i SET
            nombre = COALESCE($2, nombre), cupos = COALESCE($3, cupos),
            vence_en = CASE WHEN $4 THEN $5::date ELSE vence_en END,
            activa = COALESCE($6, activa), notas = COALESCE($7, notas)
      WHERE id = $1 RETURNING ${CAMPOS}`,
    [id, d.nombre?.trim() ?? null, d.cupos ?? null, d.venceEn !== undefined, d.venceEn ?? null, d.activa ?? null, d.notas ?? null]
  );
  if (!r.rows.length) return res.status(404).json({ error: 'Institución no encontrada.' });
  res.json({ mensaje: 'Institución actualizada.', institucion: publico(r.rows[0]) });
};

const eliminar = async (req, res) => {
  const id = idDe(req.params.id);
  // Sus profesores quedan sin institución (y sin límite de cupos); sus grupos no se tocan
  const r = id ? await pool.query('DELETE FROM instituciones WHERE id = $1 RETURNING id', [id]) : { rows: [] };
  if (!r.rows.length) return res.status(404).json({ error: 'Institución no encontrada.' });
  res.json({ mensaje: 'Institución eliminada.' });
};

// Asigna (o quita, con null) la institución de un usuario
const asignar = async (req, res) => {
  const usuarioId = idDe(req.params.id);
  const { institucionId } = req.body || {};
  const destino = institucionId === null ? null : idDe(institucionId);
  if (!usuarioId || (institucionId !== null && !destino)) return res.status(400).json({ error: 'Datos inválidos.' });
  if (destino) {
    const existe = await pool.query('SELECT 1 FROM instituciones WHERE id = $1', [destino]);
    if (!existe.rows.length) return res.status(404).json({ error: 'Institución no encontrada.' });
  }
  const r = await pool.query('UPDATE usuarios SET institucion_id = $2 WHERE id = $1 RETURNING id', [usuarioId, destino]);
  if (!r.rows.length) return res.status(404).json({ error: 'Usuario no encontrado.' });
  res.json({ mensaje: destino ? 'Institución asignada.' : 'Institución retirada.' });
};

module.exports = { listar, crear, actualizar, eliminar, asignar };
