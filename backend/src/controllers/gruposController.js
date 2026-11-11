const crypto = require('crypto');
const pool = require('../config/db');

// Sin 0/O ni 1/I/L, que se confunden al dictar o copiar el código
const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const LARGO_CODIGO = 6;
const MAX_GRUPOS_POR_PROFESOR = 50;

const nuevoCodigo = () => Array.from(crypto.randomBytes(LARGO_CODIGO), (b) => ALFABETO[b % ALFABETO.length]).join('');
const normalizarCodigo = (c) => String(c).toUpperCase().replace(/[^A-Z0-9]/g, '');
const nombreValido = (n) => typeof n === 'string' && n.trim() && n.trim().length <= 100;
const idDe = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };

// Devuelve el grupo si es del profesor que pide (o si pide un administrador); si no, responde
// 404 tanto si no existe como si es de otro, para no revelar qué grupos hay.
const grupoPropio = async (req, res) => {
  const id = idDe(req.params.id);
  const r = id ? await pool.query('SELECT id, nombre, profesor_id, codigo, archivado, creado_en FROM grupos WHERE id = $1', [id]) : { rows: [] };
  const g = r.rows[0];
  if (!g || (g.profesor_id !== req.usuario.id && req.usuario.rol !== 'administrador')) {
    res.status(404).json({ error: 'Grupo no encontrado.' });
    return null;
  }
  return g;
};

const publico = (g) => ({ id: g.id, nombre: g.nombre, codigo: g.codigo, archivado: g.archivado, creadoEn: g.creado_en });

// ── Profesor ──
const listarGrupos = async (req, res) => {
  const todos = req.usuario.rol === 'administrador';
  const r = await pool.query(
    `SELECT g.id, g.nombre, g.codigo, g.archivado, g.creado_en, p.nombre AS profesor,
            (SELECT COUNT(*) FROM grupo_miembros m WHERE m.grupo_id = g.id) AS miembros
       FROM grupos g JOIN usuarios p ON p.id = g.profesor_id
      WHERE $1 OR g.profesor_id = $2
      ORDER BY g.archivado, g.creado_en DESC`,
    [todos, req.usuario.id]
  );
  res.json({ grupos: r.rows.map((g) => ({ ...publico(g), profesor: g.profesor, miembros: Number(g.miembros) })) });
};

const crearGrupo = async (req, res) => {
  const { nombre } = req.body || {};
  if (!nombreValido(nombre)) return res.status(400).json({ error: 'Escribe el nombre del grupo (máximo 100 caracteres).' });
  const cuantos = await pool.query('SELECT COUNT(*) AS n FROM grupos WHERE profesor_id = $1', [req.usuario.id]);
  if (Number(cuantos.rows[0]?.n) >= MAX_GRUPOS_POR_PROFESOR) {
    return res.status(400).json({ error: `Llegaste al máximo de ${MAX_GRUPOS_POR_PROFESOR} grupos. Archiva o elimina alguno.` });
  }
  // El código es aleatorio; si choca con uno existente (muy improbable) se prueba otro
  for (let intento = 0; intento < 5; intento++) {
    try {
      const r = await pool.query(
        'INSERT INTO grupos (nombre, profesor_id, codigo) VALUES ($1, $2, $3) RETURNING id, nombre, codigo, archivado, creado_en',
        [nombre.trim(), req.usuario.id, nuevoCodigo()]
      );
      return res.status(201).json({ mensaje: 'Grupo creado.', grupo: { ...publico(r.rows[0]), miembros: 0 } });
    } catch (err) {
      if (err.code !== '23505') throw err;
    }
  }
  res.status(500).json({ error: 'No se pudo generar el código del grupo. Intenta de nuevo.' });
};

const actualizarGrupo = async (req, res) => {
  const g = await grupoPropio(req, res);
  if (!g) return;
  const { nombre, archivado } = req.body || {};
  if (nombre !== undefined && !nombreValido(nombre)) return res.status(400).json({ error: 'Escribe el nombre del grupo (máximo 100 caracteres).' });
  if (archivado !== undefined && typeof archivado !== 'boolean') return res.status(400).json({ error: 'Dato inválido.' });
  const r = await pool.query(
    'UPDATE grupos SET nombre = COALESCE($2, nombre), archivado = COALESCE($3, archivado) WHERE id = $1 RETURNING id, nombre, codigo, archivado, creado_en',
    [g.id, nombre === undefined ? null : nombre.trim(), archivado === undefined ? null : archivado]
  );
  res.json({ mensaje: 'Grupo actualizado.', grupo: publico(r.rows[0]) });
};

const eliminarGrupo = async (req, res) => {
  const g = await grupoPropio(req, res);
  if (!g) return;
  // Se borran el grupo y sus membresías; el progreso y las notas son de cada estudiante y se conservan
  await pool.query('DELETE FROM grupos WHERE id = $1', [g.id]);
  res.json({ mensaje: 'Grupo eliminado.' });
};

// Panel: cada estudiante del grupo con sus lecciones aprobadas y sus notas por lección
const verGrupo = async (req, res) => {
  const g = await grupoPropio(req, res);
  if (!g) return;
  const [miembros, progreso, intentos] = await Promise.all([
    pool.query(
      `SELECT u.id, u.nombre, u.email, u.ultimo_login, m.unido_en
         FROM grupo_miembros m JOIN usuarios u ON u.id = m.usuario_id
        WHERE m.grupo_id = $1 ORDER BY LOWER(u.nombre), u.id`,
      [g.id]
    ),
    pool.query(
      `SELECT p.usuario_id, p.leccion_id, p.completada_en
         FROM progreso_usuario p JOIN grupo_miembros m ON m.usuario_id = p.usuario_id
        WHERE m.grupo_id = $1`,
      [g.id]
    ),
    pool.query(
      `SELECT i.usuario_id, i.leccion_id, COUNT(*) AS intentos, MAX(i.creado_en) AS ultimo,
              (ARRAY_AGG(i.aciertos ORDER BY i.aciertos::float / i.total DESC, i.creado_en))[1] AS mejor_aciertos,
              (ARRAY_AGG(i.total ORDER BY i.aciertos::float / i.total DESC, i.creado_en))[1] AS mejor_total
         FROM intentos_quiz i JOIN grupo_miembros m ON m.usuario_id = i.usuario_id
        WHERE m.grupo_id = $1
        GROUP BY i.usuario_id, i.leccion_id`,
      [g.id]
    ),
  ]);
  const porUsuario = new Map(miembros.rows.map((u) => [u.id, {
    id: u.id, nombre: u.nombre, email: u.email, unidoEn: u.unido_en, ultimoIngreso: u.ultimo_login, lecciones: {},
  }]));
  const leccion = (usuarioId, leccionId) => {
    const u = porUsuario.get(usuarioId);
    if (!u) return null;
    u.lecciones[leccionId] = u.lecciones[leccionId] || { aprobada: false };
    return u.lecciones[leccionId];
  };
  progreso.rows.forEach((p) => { const l = leccion(p.usuario_id, p.leccion_id); if (l) { l.aprobada = true; l.aprobadaEn = p.completada_en; } });
  intentos.rows.forEach((i) => {
    const l = leccion(i.usuario_id, i.leccion_id);
    if (l) Object.assign(l, { intentos: Number(i.intentos), mejorAciertos: i.mejor_aciertos, mejorTotal: i.mejor_total, ultimoIntento: i.ultimo });
  });
  res.json({ grupo: publico(g), estudiantes: [...porUsuario.values()] });
};

const sacarMiembro = async (req, res) => {
  const g = await grupoPropio(req, res);
  if (!g) return;
  const usuarioId = idDe(req.params.usuarioId);
  const r = usuarioId ? await pool.query('DELETE FROM grupo_miembros WHERE grupo_id = $1 AND usuario_id = $2 RETURNING usuario_id', [g.id, usuarioId]) : { rows: [] };
  if (!r.rows.length) return res.status(404).json({ error: 'Ese estudiante no está en el grupo.' });
  res.json({ mensaje: 'Estudiante retirado del grupo.' });
};

// ── Estudiante ──
const misGrupos = async (req, res) => {
  const r = await pool.query(
    `SELECT g.id, g.nombre, g.archivado, p.nombre AS profesor, m.unido_en
       FROM grupo_miembros m JOIN grupos g ON g.id = m.grupo_id JOIN usuarios p ON p.id = g.profesor_id
      WHERE m.usuario_id = $1 ORDER BY m.unido_en DESC`,
    [req.usuario.id]
  );
  res.json({ grupos: r.rows.map((g) => ({ id: g.id, nombre: g.nombre, archivado: g.archivado, profesor: g.profesor, unidoEn: g.unido_en })) });
};

const unirse = async (req, res) => {
  const codigo = normalizarCodigo((req.body || {}).codigo ?? '');
  if (codigo.length !== LARGO_CODIGO) return res.status(400).json({ error: `El código tiene ${LARGO_CODIGO} letras o números.` });
  const r = await pool.query(
    `SELECT g.id, g.nombre, g.archivado, g.profesor_id, p.nombre AS profesor
       FROM grupos g JOIN usuarios p ON p.id = g.profesor_id WHERE g.codigo = $1`,
    [codigo]
  );
  const g = r.rows[0];
  if (!g || g.archivado) return res.status(404).json({ error: 'No hay un grupo abierto con ese código. Revísalo con tu profesor.' });
  if (g.profesor_id === req.usuario.id) return res.status(400).json({ error: 'Ese grupo es tuyo: no necesitas unirte.' });
  await pool.query('INSERT INTO grupo_miembros (grupo_id, usuario_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [g.id, req.usuario.id]);
  res.status(201).json({ mensaje: `Te uniste a ${g.nombre}.`, grupo: { id: g.id, nombre: g.nombre, profesor: g.profesor, archivado: false } });
};

const salir = async (req, res) => {
  const id = idDe(req.params.id);
  const r = id ? await pool.query('DELETE FROM grupo_miembros WHERE grupo_id = $1 AND usuario_id = $2 RETURNING grupo_id', [id, req.usuario.id]) : { rows: [] };
  if (!r.rows.length) return res.status(404).json({ error: 'No estás en ese grupo.' });
  res.json({ mensaje: 'Saliste del grupo.' });
};

module.exports = { listarGrupos, crearGrupo, actualizarGrupo, eliminarGrupo, verGrupo, sacarMiembro, misGrupos, unirse, salir };
