const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app, db, reiniciarDb } = require('./helpers');

const token = jwt.sign({ id: 7, email: 'ana@example.com', nombre: 'Ana' }, process.env.JWT_SECRET);
const auth = { Authorization: `Bearer ${token}` };

beforeEach(reiniciarDb);

describe('/api/progreso', () => {
  test('sin token → 401', async () => {
    const res = await request(app).get('/api/progreso');
    assert.equal(res.status, 401);
  });

  test('token inválido → 403', async () => {
    const res = await request(app).get('/api/progreso').set('Authorization', 'Bearer no-es-un-token');
    assert.equal(res.status, 403);
  });

  test('token firmado con otro secreto → 403', async () => {
    const otro = jwt.sign({ id: 7 }, 'otro-secreto');
    const res = await request(app).post('/api/progreso').set('Authorization', `Bearer ${otro}`).send({});
    assert.equal(res.status, 403);
  });

  test('GET devuelve las lecciones del usuario del token', async () => {
    db.responder = async () => ({ rows: [{ leccion_id: 1 }, { leccion_id: 2 }, { leccion_id: 5 }] });
    const res = await request(app).get('/api/progreso').set(auth);
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { ok: true, progreso: { leccionesCompletadas: [1, 2, 5] } });
    assert.deepEqual(db.consultas[0].params, [7]);
  });

  test('GET sin progreso devuelve lista vacía', async () => {
    const res = await request(app).get('/api/progreso').set(auth);
    assert.deepEqual(res.body, { ok: true, progreso: { leccionesCompletadas: [] } });
  });

  test('POST con formato inválido → 400', async () => {
    for (const body of [{}, { progreso: {} }, { progreso: { leccionesCompletadas: 'x' } }]) {
      const res = await request(app).post('/api/progreso').set(auth).send(body);
      assert.equal(res.status, 400);
      assert.deepEqual(res.body, { ok: false, error: 'Formato de progreso inválido.' });
    }
    assert.equal(db.consultas.length, 0);
  });

  test('POST reemplaza el progreso dentro de una transacción', async () => {
    const res = await request(app)
      .post('/api/progreso')
      .set(auth)
      .send({ progreso: { leccionesCompletadas: [3, 1, 'x', 3, 2.5, -1] } });
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { ok: true, mensaje: 'Progreso guardado.' });

    const sqls = db.consultas.map((c) => c.sql.trim().split(/\s+/)[0]);
    assert.deepEqual(sqls, ['BEGIN', 'DELETE', 'INSERT', 'COMMIT']);
    assert.deepEqual(db.consultas[1].params, [7, [3, 1]]);
    assert.deepEqual(db.consultas[2].params, [7, [3, 1]]);
    assert.equal(db.liberado, 1);
  });

  test('POST hace ROLLBACK si falla la base', async () => {
    db.responder = async (sql) => {
      if (sql.trim().startsWith('INSERT')) throw new Error('fallo');
      return { rows: [] };
    };
    const original = console.error;
    console.error = () => {};
    try {
      const res = await request(app).post('/api/progreso').set(auth).send({ progreso: { leccionesCompletadas: [1] } });
      assert.equal(res.status, 500);
    } finally {
      console.error = original;
    }
    assert.ok(db.consultas.some((c) => c.sql === 'ROLLBACK'));
    assert.equal(db.liberado, 1);
  });
});

describe('errores generales', () => {
  test('ruta inexistente → 404 en JSON', async () => {
    const res = await request(app).get('/api/no-existe');
    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { error: 'Ruta no encontrada.' });
  });

  test('JSON mal formado → 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email":');
    assert.equal(res.status, 400);
  });
});
