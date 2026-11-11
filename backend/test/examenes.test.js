const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app, db, reiniciarDb } = require('./helpers');
const banco = require('../data/banco.json');

const sesion = (id = 7) => `Bearer ${jwt.sign({ id, email: 'x@example.com', nombre: 'X' }, process.env.JWT_SECRET)}`;
const sql = (patron) => db.consultas.filter((c) => patron.test(c.sql));
const M1 = banco.modulos[0];
const porId = new Map(banco.preguntas.map((p) => [p.id, p]));

// Base simulada: progreso, exámenes y certificado del usuario
const base = ({ lecciones = M1.lecciones, examenes = [], certificado = null, alInsertar, alMarcar = () => [{ id: 1 }], examen = null, mejores = [] } = {}) => async (s, p) => {
  if (/FROM progreso_usuario WHERE usuario_id/.test(s)) return { rows: lecciones.map((id) => ({ leccion_id: id })) };
  if (/AS en_curso\s+FROM examenes/.test(s)) return { rows: examenes };
  if (/FROM certificados WHERE usuario_id/.test(s)) return { rows: certificado ? [certificado] : [] };
  if (/^INSERT INTO examenes/.test(s.trim())) { const fila = { id: 50, modulo: p[1], preguntas: JSON.parse(p[2]), expira_en: 'luego' }; alInsertar?.(fila); return { rows: [fila] }; }
  if (/FROM examenes WHERE id = \$1 AND usuario_id = \$2/.test(s)) return { rows: examen ? [examen] : [] };
  if (/^UPDATE examenes SET enviado_en/.test(s.trim())) return { rows: alMarcar() };
  if (/GROUP BY modulo/.test(s)) return { rows: mejores };
  if (/SELECT nombre FROM usuarios/.test(s)) return { rows: [{ nombre: 'Ana María' }] };
  if (/^INSERT INTO certificados/.test(s.trim())) return { rows: [{ codigo: p[1], nombre: p[2], nota: p[3], emitido_en: 'hoy' }] };
  return { rows: [] };
};

beforeEach(reiniciarDb);

describe('banco de preguntas', () => {
  test('está al día con los quizzes de la web (si falla: npm run banco)', async () => {
    const { construirBanco } = await import('../scripts/generar-banco.mjs');
    assert.deepEqual(banco, JSON.parse(JSON.stringify(construirBanco())));
  });
});

describe('examen final', () => {
  test('pide sesión', async () => {
    assert.equal((await request(app).get('/api/examenes')).status, 401);
    assert.equal((await request(app).post('/api/examenes').send({ modulo: 1 })).status, 401);
    assert.equal((await request(app).post('/api/examenes/1/responder').send({ respuestas: [] })).status, 401);
  });

  test('no deja empezar sin terminar las lecciones del módulo', async () => {
    db.responder = base({ lecciones: M1.lecciones.slice(0, 3) });
    const res = await request(app).post('/api/examenes').set('Authorization', sesion()).send({ modulo: 1 });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /Te faltan 5 lecciones/);
    assert.equal(sql(/^INSERT INTO examenes/).length, 0);
  });

  test('entrega 10 preguntas del módulo sin la respuesta correcta ni la explicación', async () => {
    let guardado;
    db.responder = base({ alInsertar: (f) => { guardado = f; } });
    const res = await request(app).post('/api/examenes').set('Authorization', sesion()).send({ modulo: 1 });
    assert.equal(res.status, 201);
    assert.equal(res.body.examen.preguntas.length, 10);
    assert.doesNotMatch(JSON.stringify(res.body), /correcta|explicacion/);
    // Lo guardado: preguntas distintas, todas del módulo, con las opciones en un orden propio
    assert.equal(new Set(guardado.preguntas.map((p) => p.id)).size, 10);
    guardado.preguntas.forEach(({ id, orden }, i) => {
      assert.equal(porId.get(id).modulo, 1);
      assert.deepEqual([...orden].sort(), [0, 1, 2, 3]);
      assert.deepEqual(res.body.examen.preguntas[i].opciones, orden.map((k) => porId.get(id).opciones[k]));
    });
    assert.equal(sql(/^INSERT INTO examenes/)[0].params[4], 30, 'dura 30 minutos');
  });

  test('con uno en curso devuelve el mismo, sin gastar otro intento', async () => {
    const enCurso = { id: 9, modulo: 1, preguntas: [{ id: 'L1-1', orden: [2, 0, 3, 1] }], expira_en: 'luego' };
    db.responder = base({ examenes: [{ id: 9, modulo: 1, en_curso: true }], examen: enCurso });
    const res = await request(app).post('/api/examenes').set('Authorization', sesion()).send({ modulo: 1 });
    assert.equal(res.body.examen.id, 9);
    assert.equal(sql(/^INSERT INTO examenes/).length, 0);
  });

  test('tres intentos como máximo; un examen vencido sin enviar cuenta como intento', async () => {
    const usados = [
      { id: 1, modulo: 1, enviado_en: 'x', aciertos: 3, total: 10, aprobado: false, en_curso: false },
      { id: 2, modulo: 1, enviado_en: 'x', aciertos: 5, total: 10, aprobado: false, en_curso: false },
      { id: 3, modulo: 1, enviado_en: null, en_curso: false },
    ];
    db.responder = base({ examenes: usados });
    const res = await request(app).post('/api/examenes').set('Authorization', sesion()).send({ modulo: 1 });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /Ya usaste los 3 intentos/);
    const estado = await request(app).get('/api/examenes').set('Authorization', sesion());
    assert.deepEqual({ ...estado.body.modulos[0], titulo: undefined }, { modulo: 1, titulo: undefined, preguntas: 10, minutos: 30, leccionesCompletas: true, leccionesFaltantes: 0, intentosUsados: 3, maxIntentos: 3, aprobado: false, mejorNota: 50, enCurso: null });
  });

  test('califica según el orden barajado que le tocó a cada quien', async () => {
    const ids = ['L1-1', 'L1-2', 'L1-3', 'L1-4', 'L2-1', 'L2-2', 'L2-3', 'L2-4', 'L3-1', 'L3-2'];
    const examen = { id: 50, modulo: 1, total: 10, preguntas: ids.map((id) => ({ id, orden: [3, 1, 0, 2] })) };
    db.responder = base({ examen });
    // Posición, dentro del orden barajado, donde quedó la opción correcta de cada pregunta
    const correctas = examen.preguntas.map(({ id, orden }) => orden.indexOf(porId.get(id).correcta));
    const respuestas = correctas.map((c, i) => (i < 7 ? c : (c + 1) % 4)); // 7 buenas, 3 malas
    const res = await request(app).post('/api/examenes/50/responder').set('Authorization', sesion()).send({ respuestas });
    assert.equal(res.status, 200);
    assert.deepEqual([res.body.aciertos, res.body.total, res.body.nota, res.body.aprobado], [7, 10, 70, true]);
    assert.deepEqual(res.body.revision.map((r) => r.acierto), [true, true, true, true, true, true, true, false, false, false]);
    assert.deepEqual(sql(/^UPDATE examenes SET enviado_en/)[0].params.slice(0, 4), [50, 7, 7, true]);
  });

  test('respuestas en blanco, fuera de rango o basura cuentan como malas', async () => {
    db.responder = base({ examen: { id: 50, modulo: 1, total: 4, preguntas: ['L1-1', 'L1-2', 'L1-3', 'L1-4'].map((id) => ({ id, orden: [0, 1, 2, 3] })) } });
    const res = await request(app).post('/api/examenes/50/responder').set('Authorization', sesion()).send({ respuestas: [null, 9, '0', { a: 1 }] });
    assert.equal(res.body.aciertos, 0);
    assert.equal(res.body.aprobado, false);
  });

  test('no se puede enviar dos veces ni fuera de tiempo, ni el examen de otro', async () => {
    const examen = { id: 50, modulo: 1, total: 1, preguntas: [{ id: 'L1-1', orden: [0, 1, 2, 3] }] };
    db.responder = base({ examen, alMarcar: () => [] });
    const tarde = await request(app).post('/api/examenes/50/responder').set('Authorization', sesion()).send({ respuestas: [0] });
    assert.equal(tarde.status, 400);
    assert.match(tarde.body.error, /ya se envió o se le acabó el tiempo/);
    assert.match(sql(/^UPDATE examenes SET enviado_en/)[0].sql, /enviado_en IS NULL AND expira_en/);
    db.responder = base({ examen: null });
    assert.equal((await request(app).post('/api/examenes/50/responder').set('Authorization', sesion(8)).send({ respuestas: [0] })).status, 404);
  });

  test('con todos los módulos aprobados se emite el certificado, con el promedio de las mejores notas', async () => {
    const examen = { id: 50, modulo: 3, total: 1, preguntas: [{ id: 'L12-1', orden: [0, 1, 2, 3] }] };
    db.responder = base({ examen, mejores: [{ modulo: 1, mejor: 0.8 }, { modulo: 2, mejor: 0.75 }, { modulo: 3, mejor: 1 }] });
    const res = await request(app).post('/api/examenes/50/responder').set('Authorization', sesion()).send({ respuestas: [porId.get('L12-1').correcta] });
    assert.equal(res.body.aprobado, true);
    assert.match(res.body.certificado.codigo, /^BC-[A-Z2-9]{5}-[A-Z2-9]{5}$/);
    assert.equal(res.body.certificado.nombre, 'Ana María');
    assert.equal(res.body.certificado.nota, 85);
    assert.match(sql(/^INSERT INTO certificados/)[0].sql, /ON CONFLICT \(usuario_id\)/, 'un certificado por persona');
  });

  test('con módulos pendientes no hay certificado', async () => {
    const examen = { id: 50, modulo: 1, total: 1, preguntas: [{ id: 'L1-1', orden: [0, 1, 2, 3] }] };
    db.responder = base({ examen, mejores: [{ modulo: 1, mejor: 1 }] });
    const res = await request(app).post('/api/examenes/50/responder').set('Authorization', sesion()).send({ respuestas: [porId.get('L1-1').correcta] });
    assert.equal(res.body.certificado, null);
    assert.equal(sql(/^INSERT INTO certificados/).length, 0);
  });
});

describe('verificación pública del certificado', () => {
  test('no pide sesión, acepta el código con o sin guiones y no revela el correo', async () => {
    db.responder = async (s, p) => (/FROM certificados WHERE codigo/.test(s) && p[0] === 'BC-ABCDE-FGH23' ? { rows: [{ codigo: p[0], nombre: 'Ana María', nota: 85, emitido_en: 'hoy', email: 'NO' }] } : { rows: [] });
    for (const c of ['BC-ABCDE-FGH23', 'bcabcdefgh23']) {
      const res = await request(app).get(`/api/certificados/${c}`);
      assert.equal(res.status, 200);
      assert.deepEqual(res.body, { valido: true, codigo: 'BC-ABCDE-FGH23', nombre: 'Ana María', nota: 85, emitidoEn: 'hoy', modulos: banco.modulos.map((m) => m.titulo) });
    }
  });

  test('un código que no existe responde 404', async () => {
    const res = await request(app).get('/api/certificados/BC-ZZZZZ-ZZZZZ');
    assert.equal(res.status, 404);
    assert.equal(res.body.valido, false);
    assert.equal((await request(app).get('/api/certificados/x')).status, 404);
  });
});
