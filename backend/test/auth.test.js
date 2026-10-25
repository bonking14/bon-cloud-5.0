const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { app, db, reiniciarDb } = require('./helpers');

const PASSWORD = 'Segura123!';
const hash = bcrypt.hashSync(PASSWORD, 4);

const usuarioBase = {
  id: 7,
  nombre: 'Ana',
  email: 'ana@example.com',
  password: hash,
  bloqueado: false,
  bloqueo_temporal: false
};

beforeEach(reiniciarDb);

describe('POST /api/auth/register', () => {
  const valido = { nombre: 'Ana', email: 'ana@example.com', password: PASSWORD };

  test('rechaza nombre vacío', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...valido, nombre: '  ' });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /nombre/);
  });

  test('rechaza correo inválido', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...valido, email: 'no-es-correo' });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /correo/);
  });

  test('rechaza contraseña débil sin tocar la base', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...valido, password: 'debil' });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /mínimo 8 caracteres/);
    assert.equal(db.consultas.length, 0);
  });

  test('rechaza correo ya registrado', async () => {
    db.responder = async (sql) => (sql.startsWith('SELECT') ? { rows: [{ id: 1 }] } : { rows: [] });
    const res = await request(app).post('/api/auth/register').send(valido);
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'Este correo ya está registrado.');
  });

  test('registra con datos válidos', async () => {
    db.responder = async (sql, params) => {
      if (sql.startsWith('INSERT')) {
        return { rows: [{ id: 1, nombre: params[0], email: params[1] }] };
      }
      return { rows: [] };
    };
    const res = await request(app).post('/api/auth/register').send({ ...valido, email: 'Ana@Example.com' });
    assert.equal(res.status, 201);
    assert.deepEqual(res.body.usuario, { id: 1, nombre: 'Ana', email: 'ana@example.com' });
    const insert = db.consultas.find((c) => c.sql.startsWith('INSERT'));
    assert.notEqual(insert.params[2], PASSWORD, 'la contraseña se guarda cifrada');
  });
});

describe('POST /api/auth/login', () => {
  test('pide correo y contraseña', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'ana@example.com' });
    assert.equal(res.status, 400);
  });

  test('login correcto devuelve token y usuario', async () => {
    db.responder = async (sql) => (sql.trim().startsWith('SELECT') ? { rows: [usuarioBase] } : { rows: [] });
    const res = await request(app).post('/api/auth/login').send({ email: 'ana@example.com', password: PASSWORD });
    assert.equal(res.status, 200);
    assert.equal(res.body.mensaje, 'Login exitoso.');
    assert.deepEqual(res.body.usuario, { id: 7, nombre: 'Ana', email: 'ana@example.com' });
    const payload = jwt.verify(res.body.token, process.env.JWT_SECRET);
    assert.equal(payload.id, 7);
    assert.equal(payload.exp - payload.iat, 8 * 60 * 60, 'expira en 8h por defecto');
    assert.ok(db.consultas.some((c) => /bloqueado_hasta = NULL/.test(c.sql)), 'limpia el bloqueo temporal');
  });

  test('usuario inexistente → 401', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'x@example.com', password: PASSWORD });
    assert.equal(res.status, 401);
    assert.equal(res.body.error, 'Credenciales incorrectas.');
  });

  test('contraseña incorrecta → 401 con el conteo de intentos', async () => {
    db.responder = async (sql) => {
      if (sql.trim().startsWith('SELECT')) return { rows: [usuarioBase] };
      return { rows: [{ intentos_fallidos: 2, bloqueo_temporal: false }] };
    };
    const res = await request(app).post('/api/auth/login').send({ email: 'ana@example.com', password: 'Otra123!' });
    assert.equal(res.status, 401);
    assert.equal(res.body.error, 'Credenciales incorrectas. Intentos fallidos: 2/5');
  });

  test('el quinto fallo bloquea temporalmente → 403', async () => {
    db.responder = async (sql) => {
      if (sql.trim().startsWith('SELECT')) return { rows: [usuarioBase] };
      return { rows: [{ intentos_fallidos: 0, bloqueo_temporal: true }] };
    };
    const res = await request(app).post('/api/auth/login').send({ email: 'ana@example.com', password: 'Otra123!' });
    assert.equal(res.status, 403);
    assert.match(res.body.error, /15 minutos/);
  });

  test('mientras dura el bloqueo temporal rechaza aunque la contraseña sea correcta', async () => {
    db.responder = async () => ({ rows: [{ ...usuarioBase, bloqueo_temporal: true }] });
    const res = await request(app).post('/api/auth/login').send({ email: 'ana@example.com', password: PASSWORD });
    assert.equal(res.status, 403);
    assert.match(res.body.error, /temporalmente/);
    assert.equal(db.consultas.length, 1, 'no actualiza nada');
  });

  test('bloqueo manual → 403', async () => {
    db.responder = async () => ({ rows: [{ ...usuarioBase, bloqueado: true }] });
    const res = await request(app).post('/api/auth/login').send({ email: 'ana@example.com', password: PASSWORD });
    assert.equal(res.status, 403);
    assert.match(res.body.error, /administrador/);
  });

  test('error de base de datos → 500 en JSON', async () => {
    db.responder = async () => { throw new Error('se cayó la base'); };
    const original = console.error;
    console.error = () => {};
    try {
      const res = await request(app).post('/api/auth/login').send({ email: 'ana@example.com', password: PASSWORD });
      assert.equal(res.status, 500);
      assert.equal(res.body.error, 'Error interno del servidor.');
    } finally {
      console.error = original;
    }
  });
});
