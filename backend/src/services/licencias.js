// Licencias por institución. Un profesor asignado a una institución solo puede recibir
// estudiantes mientras la licencia esté activa, vigente y con cupos.
const pool = require('../config/db');

// Licencia del profesor con su uso, o null si no pertenece a ninguna institución
async function licenciaDe(profesorId) {
  const r = await pool.query(
    `SELECT i.id, i.nombre, i.cupos, i.vence_en, i.activa,
            (i.vence_en IS NOT NULL AND i.vence_en < CURRENT_DATE) AS vencida,
            (SELECT COUNT(DISTINCT m.usuario_id)
               FROM grupo_miembros m JOIN grupos g ON g.id = m.grupo_id JOIN usuarios p ON p.id = g.profesor_id
              WHERE p.institucion_id = i.id) AS usados
       FROM usuarios u JOIN instituciones i ON i.id = u.institucion_id
      WHERE u.id = $1`,
    [profesorId]
  );
  const l = r.rows[0];
  if (!l) return null;
  return { id: l.id, nombre: l.nombre, cupos: l.cupos, usados: Number(l.usados), venceEn: l.vence_en, activa: l.activa, vencida: l.vencida, vigente: l.activa && !l.vencida };
}

// Motivo por el que un estudiante no puede entrar a un grupo de ese profesor, o '' si puede
async function impedimento(profesorId, estudianteId) {
  const l = await licenciaDe(profesorId);
  if (!l) return '';
  if (!l.vigente) return `La licencia de ${l.nombre} no está vigente. Avísale a tu profesor.`;
  if (l.usados < l.cupos) return '';
  // Sin cupos libres solo entra quien ya ocupa uno en otro grupo de la misma institución
  const ya = await pool.query(
    `SELECT 1 FROM grupo_miembros m JOIN grupos g ON g.id = m.grupo_id JOIN usuarios p ON p.id = g.profesor_id
      WHERE m.usuario_id = $1 AND p.institucion_id = $2 LIMIT 1`,
    [estudianteId, l.id]
  );
  return ya.rows.length ? '' : `${l.nombre} ya usó todos sus cupos (${l.cupos}). Avísale a tu profesor.`;
}

module.exports = { licenciaDe, impedimento };
