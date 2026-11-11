const crypto = require('crypto');
const pool = require('../config/db');
const banco = require('../../data/banco.json');

const PREGUNTAS_POR_EXAMEN = 10;
const MINUTOS = 30;
const MAX_INTENTOS = 3;
const UMBRAL = 0.7;
const GRACIA_SEGUNDOS = 30; // margen para que el envío no falle por un reloj o una red lentos
const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const porId = new Map(banco.preguntas.map((p) => [p.id, p]));
const moduloDe = (id) => banco.modulos.find((m) => m.id === id);
const barajar = (lista) => {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const nuevoCodigo = () => {
  const c = Array.from(crypto.randomBytes(10), (b) => ALFABETO[b % ALFABETO.length]).join('');
  return `BC-${c.slice(0, 5)}-${c.slice(5)}`;
};
const nota = (aciertos, total) => Math.round((aciertos / total) * 100);

// Lo que ve el estudiante: enunciados y opciones en el orden que le tocó, sin la respuesta
const paraPresentar = (examen) => ({
  id: examen.id,
  modulo: examen.modulo,
  expiraEn: examen.expira_en,
  preguntas: examen.preguntas.map(({ id, orden }) => {
    const p = porId.get(id);
    return { pregunta: p.pregunta, opciones: orden.map((i) => p.opciones[i]) };
  }),
});

// Estado de cada módulo para el usuario: si puede presentar, cuántos intentos lleva y su mejor nota
async function estadoDe(usuarioId) {
  const [progreso, examenes, cert] = await Promise.all([
    pool.query('SELECT leccion_id FROM progreso_usuario WHERE usuario_id = $1', [usuarioId]),
    pool.query(
      `SELECT id, modulo, aciertos, total, aprobado, enviado_en, expira_en,
              (enviado_en IS NULL AND expira_en > NOW()) AS en_curso
         FROM examenes WHERE usuario_id = $1 ORDER BY id`,
      [usuarioId]
    ),
    pool.query('SELECT codigo, nombre, nota, emitido_en FROM certificados WHERE usuario_id = $1', [usuarioId]),
  ]);
  const hechas = new Set(progreso.rows.map((r) => r.leccion_id));
  const modulos = banco.modulos.map((m) => {
    const suyos = examenes.rows.filter((e) => e.modulo === m.id);
    const enCurso = suyos.find((e) => e.en_curso);
    // Un examen que venció sin enviarse cuenta como intento usado
    const usados = suyos.filter((e) => !e.en_curso).length;
    const enviados = suyos.filter((e) => e.enviado_en);
    const aprobado = enviados.some((e) => e.aprobado);
    const disponibles = banco.preguntas.filter((p) => p.modulo === m.id).length;
    return {
      modulo: m.id, titulo: m.titulo,
      preguntas: Math.min(PREGUNTAS_POR_EXAMEN, disponibles), minutos: MINUTOS,
      leccionesCompletas: m.lecciones.every((id) => hechas.has(id)),
      leccionesFaltantes: m.lecciones.filter((id) => !hechas.has(id)).length,
      intentosUsados: usados, maxIntentos: MAX_INTENTOS, aprobado,
      mejorNota: enviados.length ? Math.max(...enviados.map((e) => nota(e.aciertos, e.total))) : null,
      enCurso: enCurso ? enCurso.id : null,
    };
  });
  const c = cert.rows[0];
  return { modulos, certificado: c ? { codigo: c.codigo, nombre: c.nombre, nota: c.nota, emitidoEn: c.emitido_en } : null };
}

const verEstado = async (req, res) => res.json(await estadoDe(req.usuario.id));

// Empieza un examen o devuelve el que está en curso (con las mismas preguntas)
const iniciar = async (req, res) => {
  const m = moduloDe((req.body || {}).modulo);
  if (!m) return res.status(400).json({ error: 'Módulo inválido.' });
  const estado = (await estadoDe(req.usuario.id)).modulos.find((x) => x.modulo === m.id);

  if (estado.enCurso) {
    const r = await pool.query('SELECT id, modulo, preguntas, expira_en FROM examenes WHERE id = $1 AND usuario_id = $2', [estado.enCurso, req.usuario.id]);
    return res.json({ examen: paraPresentar(r.rows[0]) });
  }
  if (estado.aprobado) return res.status(400).json({ error: 'Ya aprobaste el examen de este módulo.' });
  if (!estado.leccionesCompletas) return res.status(400).json({ error: `Te faltan ${estado.leccionesFaltantes} lecciones de este módulo para presentar el examen.` });
  if (estado.intentosUsados >= MAX_INTENTOS) return res.status(400).json({ error: `Ya usaste los ${MAX_INTENTOS} intentos de este módulo. Habla con tu profesor o con el administrador.` });

  const elegidas = barajar(banco.preguntas.filter((p) => p.modulo === m.id)).slice(0, estado.preguntas)
    .map((p) => ({ id: p.id, orden: barajar(p.opciones.map((_, i) => i)) }));
  const r = await pool.query(
    `INSERT INTO examenes (usuario_id, modulo, preguntas, total, expira_en)
     VALUES ($1, $2, $3::jsonb, $4, NOW() + make_interval(mins => $5))
  RETURNING id, modulo, preguntas, expira_en`,
    [req.usuario.id, m.id, JSON.stringify(elegidas), elegidas.length, MINUTOS]
  );
  res.status(201).json({ examen: paraPresentar(r.rows[0]) });
};

// Califica. Una sola consulta marca el examen como enviado: no se puede enviar dos veces
// ni después de que venza.
const responder = async (req, res) => {
  const id = Number(req.params.id);
  const { respuestas } = req.body || {};
  if (!Number.isInteger(id) || !Array.isArray(respuestas) || respuestas.length > 100) return res.status(400).json({ error: 'Respuestas inválidas.' });

  const r = await pool.query('SELECT id, modulo, preguntas, total FROM examenes WHERE id = $1 AND usuario_id = $2', [id, req.usuario.id]);
  const examen = r.rows[0];
  if (!examen) return res.status(404).json({ error: 'Examen no encontrado.' });

  // La opción que eligió está en el orden barajado: `orden` la devuelve a su posición original
  const revision = examen.preguntas.map(({ id: pid, orden }, i) => {
    const p = porId.get(pid);
    const elegida = Number.isInteger(respuestas[i]) && respuestas[i] >= 0 && respuestas[i] < orden.length ? orden[respuestas[i]] : null;
    return { pregunta: p.pregunta, acierto: elegida === p.correcta, respondida: elegida !== null, explicacion: p.explicacion };
  });
  const aciertos = revision.filter((x) => x.acierto).length;
  const aprobado = aciertos >= Math.ceil(examen.total * UMBRAL);

  const marcado = await pool.query(
    `UPDATE examenes SET enviado_en = NOW(), aciertos = $3, aprobado = $4
      WHERE id = $1 AND usuario_id = $2 AND enviado_en IS NULL AND expira_en + make_interval(secs => $5) > NOW()
  RETURNING id`,
    [id, req.usuario.id, aciertos, aprobado, GRACIA_SEGUNDOS]
  );
  if (!marcado.rows.length) return res.status(400).json({ error: 'Este examen ya se envió o se le acabó el tiempo.' });

  const certificado = aprobado ? await emitirSiCorresponde(req.usuario.id) : null;
  res.json({ aciertos, total: examen.total, nota: nota(aciertos, examen.total), aprobado, revision, certificado });
};

// Con todos los módulos aprobados se emite el certificado (uno por persona)
async function emitirSiCorresponde(usuarioId) {
  const r = await pool.query(
    `SELECT modulo, MAX(aciertos::float / total) AS mejor FROM examenes
      WHERE usuario_id = $1 AND aprobado GROUP BY modulo`,
    [usuarioId]
  );
  if (r.rows.length < banco.modulos.length) return null;
  const promedio = Math.round((r.rows.reduce((s, x) => s + Number(x.mejor), 0) / r.rows.length) * 100);
  const u = await pool.query('SELECT nombre FROM usuarios WHERE id = $1', [usuarioId]);
  for (let intento = 0; intento < 5; intento++) {
    try {
      const c = await pool.query(
        `INSERT INTO certificados (usuario_id, codigo, nombre, nota) VALUES ($1, $2, $3, $4)
         ON CONFLICT (usuario_id) DO UPDATE SET usuario_id = EXCLUDED.usuario_id
      RETURNING codigo, nombre, nota, emitido_en`,
        [usuarioId, nuevoCodigo(), u.rows[0].nombre, promedio]
      );
      const x = c.rows[0];
      return { codigo: x.codigo, nombre: x.nombre, nota: x.nota, emitidoEn: x.emitido_en };
    } catch (err) {
      if (err.code !== '23505') throw err; // el código chocó con otro: se prueba uno nuevo
    }
  }
  return null;
}

// Público: cualquiera con el código comprueba que el certificado existe y a nombre de quién
const verificarCertificado = async (req, res) => {
  const codigo = String(req.params.codigo || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (codigo.length !== 12) return res.status(404).json({ valido: false, error: 'No existe un certificado con ese código.' });
  const formato = `${codigo.slice(0, 2)}-${codigo.slice(2, 7)}-${codigo.slice(7)}`;
  const r = await pool.query('SELECT codigo, nombre, nota, emitido_en FROM certificados WHERE codigo = $1', [formato]);
  if (!r.rows.length) return res.status(404).json({ valido: false, error: 'No existe un certificado con ese código.' });
  const c = r.rows[0];
  res.json({ valido: true, codigo: c.codigo, nombre: c.nombre, nota: c.nota, emitidoEn: c.emitido_en, modulos: banco.modulos.map((m) => m.titulo) });
};

module.exports = { verEstado, iniciar, responder, verificarCertificado, PREGUNTAS_POR_EXAMEN, MAX_INTENTOS, MINUTOS };
