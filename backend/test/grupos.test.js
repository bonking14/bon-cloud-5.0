const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app, db, reiniciarDb } = require('./helpers');

const sesion = (id = 7) => `Bearer ${jwt.sign({ id, email: 'x@example.com', nombre: 'X' }, process.env.JWT_SECRET)}`;
const sql = (patron) => db.consultas.filter((c) => patron.test(c.sql));
const GRUPO = { id: 3, nombre: 'Comex 2026', profesor_id: 7, codigo: 'ABC234', archivado: false, creado_en: '2026-11-01T00:00:00.000Z' };

// Responde según el rol que la base dice que tiene quien pide
const base = (rol, extra = () => null) => async (s, p) => {
  const propio = extra(s, p);
  if (propio) return propio;
  if (/^SELECT rol, bloqueado/.test(s.trim())) return { rows: [{ rol, bloqueado: false }] };
  if (/FROM grupos WHERE id = \$1/.test(s)) return { rows: p[0] === GRUPO.id ? [GRUPO] : [] };
  return { rows: [] };
};

beforeEach(reiniciarDb);

describe('intentos de quiz', () => {
  test('pide sesión y valida los números', async () => {
    assert.equal((await request(app).post('/api/intentos').send({ leccionId: 1, aciertos: 3, total: 4 })).status, 401);
    for (const cuerpo of [{}, { leccionId: 0, aciertos: 1, total: 4 }, { leccionId: 1, aciertos: 5, total: 4 }, { leccionId: 1, aciertos: -1, total: 4 }, { leccionId: 1, aciertos: 1.5, total: 4 }, { leccionId: '1', aciertos: 1, total: 4 }]) {
      assert.equal((await request(app).post('/api/intentos').set('Authorization', sesion()).send(cuerpo)).status, 400);
    }
    assert.equal(db.consultas.length, 0);
  });

  test('el servidor decide si aprobó (70%) y guarda con el usuario del token', async () => {
    db.responder = async () => ({ rows: [{ id: 1 }] });
    const pedir = (aciertos, total) => request(app).post('/api/intentos').set('Authorization', sesion()).send({ leccionId: 12, aciertos, total, aprobado: true, usuarioId: 99 });
    assert.equal((await pedir(2, 4)).body.aprobado, false);
    assert.equal((await pedir(3, 4)).body.aprobado, true);
    assert.deepEqual(db.consultas[0].params.slice(0, 5), [7, 12, 2, 4, false]);
  });

  test('con el tope por hora alcanzado responde 429', async () => {
    const res = await request(app).post('/api/intentos').set('Authorization', sesion()).send({ leccionId: 1, aciertos: 4, total: 4 });
    assert.equal(res.status, 429);
  });
});

describe('grupos del profesor', () => {
  test('un estudiante no puede crear, listar ni ver grupos', async () => {
    db.responder = base('estudiante');
    const a = sesion();
    assert.equal((await request(app).get('/api/grupos').set('Authorization', a)).status, 403);
    assert.equal((await request(app).post('/api/grupos').set('Authorization', a).send({ nombre: 'X' })).status, 403);
    assert.equal((await request(app).get('/api/grupos/3').set('Authorization', a)).status, 403);
    assert.equal((await request(app).get('/api/grupos')).status, 401);
  });

  test('crea el grupo con un código de 6 caracteres sin letras confusas', async () => {
    db.responder = base('profesor', (s, p) => (/^INSERT INTO grupos/.test(s) ? { rows: [{ id: 3, nombre: p[0], codigo: p[2], archivado: false, creado_en: null }] } : /COUNT\(\*\) AS n FROM grupos/.test(s) ? { rows: [{ n: '2' }] } : null));
    const res = await request(app).post('/api/grupos').set('Authorization', sesion()).send({ nombre: '  Comex 2026 ' });
    assert.equal(res.status, 201);
    assert.equal(res.body.grupo.nombre, 'Comex 2026');
    assert.match(res.body.grupo.codigo, /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/);
    assert.equal(sql(/^INSERT INTO grupos/)[0].params[1], 7, 'el dueño es quien lo crea');
  });

  test('si el código choca con otro, prueba con uno nuevo', async () => {
    let vez = 0;
    db.responder = base('profesor', (s, p) => {
      if (!/^INSERT INTO grupos/.test(s)) return null;
      vez += 1;
      if (vez === 1) throw Object.assign(new Error('duplicado'), { code: '23505' });
      return { rows: [{ id: 3, nombre: p[0], codigo: p[2], archivado: false, creado_en: null }] };
    });
    const res = await request(app).post('/api/grupos').set('Authorization', sesion()).send({ nombre: 'Comex' });
    assert.equal(res.status, 201);
    assert.equal(vez, 2);
  });

  test('un profesor no ve ni modifica el grupo de otro: responde 404, igual que si no existiera', async () => {
    db.responder = base('profesor');
    const otro = sesion(8);
    for (const pedido of [
      request(app).get('/api/grupos/3'), request(app).put('/api/grupos/3').send({ nombre: 'Mío' }),
      request(app).delete('/api/grupos/3'), request(app).delete('/api/grupos/3/miembros/9'), request(app).get('/api/grupos/999'),
    ]) {
      const res = await pedido.set('Authorization', otro);
      assert.equal(res.status, 404);
      assert.equal(res.body.error, 'Grupo no encontrado.');
    }
    assert.equal(sql(/^(UPDATE|DELETE)/).length, 0, 'no cambió nada');
  });

  test('el administrador sí ve el grupo de cualquier profesor', async () => {
    db.responder = base('administrador');
    assert.equal((await request(app).get('/api/grupos/3').set('Authorization', sesion(1))).status, 200);
  });

  test('el panel arma a cada estudiante con sus lecciones aprobadas y su mejor nota', async () => {
    db.responder = base('profesor', (s) => {
      if (/FROM grupo_miembros m JOIN usuarios u/.test(s)) return { rows: [{ id: 20, nombre: 'Ana', email: 'ana@example.com', ultimo_login: null, unido_en: 'u', password: 'NO' }, { id: 21, nombre: 'Luis', email: 'luis@example.com', ultimo_login: null, unido_en: 'u' }] };
      if (/FROM progreso_usuario p/.test(s)) return { rows: [{ usuario_id: 20, leccion_id: 1, completada_en: 'f1' }, { usuario_id: 99, leccion_id: 1, completada_en: 'x' }] };
      if (/FROM intentos_quiz i/.test(s)) return { rows: [{ usuario_id: 20, leccion_id: 1, intentos: '3', ultimo: 'f2', mejor_aciertos: 4, mejor_total: 4 }, { usuario_id: 20, leccion_id: 2, intentos: '1', ultimo: 'f3', mejor_aciertos: 1, mejor_total: 4 }] };
      return null;
    });
    const res = await request(app).get('/api/grupos/3').set('Authorization', sesion());
    assert.equal(res.body.grupo.codigo, 'ABC234');
    const [ana, luis] = res.body.estudiantes;
    assert.deepEqual(ana.lecciones, {
      1: { aprobada: true, aprobadaEn: 'f1', intentos: 3, mejorAciertos: 4, mejorTotal: 4, ultimoIntento: 'f2' },
      2: { aprobada: false, intentos: 1, mejorAciertos: 1, mejorTotal: 4, ultimoIntento: 'f3' },
    });
    assert.deepEqual(luis.lecciones, {});
    assert.equal(ana.password, undefined);
    // Las tres consultas se limitan a los miembros de este grupo
    for (const c of sql(/grupo_miembros/)) assert.deepEqual(c.params, [3]);
  });

  test('archivar y renombrar validan los datos', async () => {
    db.responder = base('profesor', (s, p) => (/^UPDATE grupos/.test(s) ? { rows: [{ ...GRUPO, nombre: p[1] ?? GRUPO.nombre, archivado: p[2] ?? false }] } : null));
    const a = sesion();
    assert.equal((await request(app).put('/api/grupos/3').set('Authorization', a).send({ archivado: 'si' })).status, 400);
    assert.equal((await request(app).put('/api/grupos/3').set('Authorization', a).send({ nombre: ' ' })).status, 400);
    const res = await request(app).put('/api/grupos/3').set('Authorization', a).send({ archivado: true });
    assert.equal(res.body.grupo.archivado, true);
    assert.deepEqual(sql(/^UPDATE grupos/)[0].params, [3, null, true]);
  });
});

describe('grupos del estudiante', () => {
  const conGrupo = (g) => async (s) => (/FROM grupos g JOIN usuarios p ON p.id = g.profesor_id WHERE g.codigo/.test(s) ? { rows: g ? [g] : [] } : { rows: [] });
  const unir = (codigo, quien = sesion(20)) => request(app).post('/api/mis-grupos').set('Authorization', quien).send({ codigo });

  test('se une con el código, sin importar mayúsculas, espacios o guiones', async () => {
    db.responder = conGrupo({ id: 3, nombre: 'Comex 2026', archivado: false, profesor_id: 7, profesor: 'Profe' });
    const res = await unir(' abc-234 ');
    assert.equal(res.status, 201);
    assert.equal(res.body.grupo.profesor, 'Profe');
    assert.deepEqual(sql(/WHERE g\.codigo/)[0].params, ['ABC234']);
    const [alta] = sql(/^INSERT INTO grupo_miembros/);
    assert.deepEqual(alta.params, [3, 20]);
    assert.match(alta.sql, /ON CONFLICT DO NOTHING/, 'unirse dos veces no falla');
  });

  test('código inexistente, de grupo archivado o mal formado', async () => {
    assert.equal((await unir('ABC')).status, 400);
    db.responder = conGrupo(null);
    assert.equal((await unir('ZZZ999')).status, 404);
    db.responder = conGrupo({ id: 3, nombre: 'Viejo', archivado: true, profesor_id: 7, profesor: 'Profe' });
    assert.equal((await unir('ABC234')).status, 404);
    assert.equal(sql(/^INSERT INTO grupo_miembros/).length, 0);
  });

  test('el profesor no se une a su propio grupo', async () => {
    db.responder = conGrupo({ id: 3, nombre: 'Comex', archivado: false, profesor_id: 7, profesor: 'Profe' });
    assert.equal((await unir('ABC234', sesion(7))).status, 400);
  });

  test('salir solo borra la membresía propia', async () => {
    db.responder = async (s) => (/^DELETE FROM grupo_miembros/.test(s) ? { rows: [{ grupo_id: 3 }] } : { rows: [] });
    const res = await request(app).delete('/api/mis-grupos/3').set('Authorization', sesion(20));
    assert.equal(res.status, 200);
    assert.deepEqual(sql(/^DELETE FROM grupo_miembros/)[0].params, [3, 20]);
  });

  test('las rutas nuevas no tapan el 404 de las rutas que no existen', async () => {
    assert.equal((await request(app).get('/api/no-existe')).status, 404);
  });
});
