const { test, describe, beforeEach, afterEach, mock } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { app, db, reiniciarDb } = require('./helpers');
const { huella } = require('../src/services/tokens');

const PASSWORD = 'Segura123!';
const NUEVA = 'OtraClave456!';
const hash = bcrypt.hashSync(PASSWORD, 4);
const TOKEN_ENLACE = 'a'.repeat(64);
const sesion = (datos = {}) => `Bearer ${jwt.sign({ id: 7, email: 'ana@example.com', nombre: 'Ana', rol: 'estudiante', ...datos }, process.env.JWT_SECRET)}`;
const sql = (patron) => db.consultas.filter((c) => patron.test(c.sql));

let registro;
beforeEach(() => {
  reiniciarDb();
  // Sin RESEND_API_KEY el correo se escribe en el registro: de ahí se lee el enlace
  registro = mock.method(console, 'log', () => {});
});
afterEach(() => mock.restoreAll());
const correoEscrito = () => registro.mock.calls.map((c) => c.arguments.join(' ')).join('\n');

describe('recuperar contraseña', () => {
  test('pedir el enlace responde igual exista o no la cuenta', async () => {
    const inexistente = await request(app).post('/api/auth/forgot-password').send({ email: 'nadie@example.com' });
    db.responder = async (s) => (/^SELECT/.test(s.trim()) ? { rows: [{ id: 7, nombre: 'Ana', email: 'ana@example.com', bloqueado: false }] } : { rows: [] });
    const existente = await request(app).post('/api/auth/forgot-password').send({ email: 'Ana@Example.com' });
    assert.equal(inexistente.status, 200);
    assert.deepEqual(inexistente.body, existente.body);
  });

  test('guarda solo la huella del enlace y lo manda al correo con la dirección de la web', async () => {
    db.responder = async (s) => (/^SELECT/.test(s.trim()) ? { rows: [{ id: 7, nombre: 'Ana', email: 'ana@example.com', bloqueado: false }] } : { rows: [] });
    await request(app).post('/api/auth/forgot-password').send({ email: 'ana@example.com' });
    const [insercion] = sql(/INSERT INTO tokens_cuenta/);
    const enlace = correoEscrito().match(/https:\/\/ejemplo\.test\/app\/#\/restablecer\?token=([0-9a-f]{64})/);
    assert.ok(enlace, 'el correo trae el enlace');
    assert.equal(insercion.params[2], huella(enlace[1]), 'en la base queda la huella');
    assert.notEqual(insercion.params[2], enlace[1], 'no el enlace');
    assert.equal(insercion.params[3], 60, 'vence en 60 minutos');
    assert.ok(sql(/UPDATE tokens_cuenta SET usado_en/).length, 'invalida los enlaces anteriores');
  });

  test('una cuenta bloqueada por un administrador no recibe enlace', async () => {
    db.responder = async (s) => (/^SELECT/.test(s.trim()) ? { rows: [{ id: 7, nombre: 'Ana', email: 'ana@example.com', bloqueado: true }] } : { rows: [] });
    const res = await request(app).post('/api/auth/forgot-password').send({ email: 'ana@example.com' });
    assert.equal(res.status, 200);
    assert.equal(sql(/INSERT INTO tokens_cuenta/).length, 0);
  });

  test('restablecer con un enlace vencido, usado o inventado → 400 y no cambia nada', async () => {
    for (const token of [TOKEN_ENLACE, 'corto', undefined, { $ne: '' }]) {
      const res = await request(app).post('/api/auth/reset-password').send({ token, password: NUEVA });
      assert.equal(res.status, 400);
      assert.match(res.body.error, /no es válido o ya venció/);
    }
    assert.equal(sql(/UPDATE usuarios/).length, 0);
  });

  test('restablecer exige una contraseña segura antes de gastar el enlace', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({ token: TOKEN_ENLACE, password: 'debil' });
    assert.equal(res.status, 400);
    assert.equal(db.consultas.length, 0);
  });

  test('restablecer con un enlace vigente cambia la clave, quita el bloqueo temporal y verifica el correo', async () => {
    db.responder = async (s) => (/UPDATE tokens_cuenta/.test(s) ? { rows: [{ usuario_id: 7 }] } : { rows: [] });
    const res = await request(app).post('/api/auth/reset-password').send({ token: TOKEN_ENLACE, password: NUEVA });
    assert.equal(res.status, 200);
    const [consumo] = sql(/UPDATE tokens_cuenta/);
    assert.match(consumo.sql, /usado_en IS NULL AND expira_en > NOW\(\)/, 'un solo uso y con vencimiento');
    assert.deepEqual(consumo.params, [huella(TOKEN_ENLACE), 'recuperar']);
    const [cambio] = sql(/UPDATE usuarios\s+SET password/);
    assert.ok(await bcrypt.compare(NUEVA, cambio.params[1]), 'guarda el hash de la clave nueva');
    assert.match(cambio.sql, /bloqueado_hasta = NULL/);
    assert.match(cambio.sql, /email_verificado = TRUE/);
    assert.doesNotMatch(cambio.sql, /bloqueado = /, 'no toca el bloqueo manual');
  });
});

describe('verificar correo', () => {
  test('registrarse envía el enlace de confirmación', async () => {
    db.responder = async (s, p) => (/^INSERT INTO usuarios/.test(s.trim()) ? { rows: [{ id: 9, nombre: p[0], email: p[1] }] } : { rows: [] });
    const res = await request(app).post('/api/auth/register').send({ nombre: 'Luis', email: 'luis@example.com', password: PASSWORD });
    assert.equal(res.status, 201);
    assert.match(correoEscrito(), /#\/verificar-correo\?token=[0-9a-f]{64}/);
    assert.equal(sql(/INSERT INTO tokens_cuenta/)[0].params[1], 'verificar');
  });

  test('el enlace de recuperar no sirve para verificar ni al revés (se consume por tipo)', async () => {
    await request(app).post('/api/auth/verify-email').send({ token: TOKEN_ENLACE });
    assert.equal(sql(/UPDATE tokens_cuenta/)[0].params[1], 'verificar');
  });

  test('un correo de ADMIN_EMAILS pasa a administrador solo al verificarse', async () => {
    db.responder = async (s) => (/UPDATE tokens_cuenta/.test(s) ? { rows: [{ usuario_id: 3 }] } : { rows: [] });
    const res = await request(app).post('/api/auth/verify-email').send({ token: TOKEN_ENLACE });
    assert.equal(res.status, 200);
    const [promocion] = sql(/SET rol = 'administrador'/);
    assert.match(promocion.sql, /AND email_verificado AND/, 'exige el correo verificado');
    assert.deepEqual(promocion.params, [3, ['jefe@example.com']]);
  });

  test('registrarse con un correo de ADMIN_EMAILS no da el rol', async () => {
    db.responder = async (s, p) => (/^INSERT INTO usuarios/.test(s.trim()) ? { rows: [{ id: 9, nombre: p[0], email: p[1] }] } : { rows: [] });
    await request(app).post('/api/auth/register').send({ nombre: 'Impostor', email: 'jefe@example.com', password: PASSWORD });
    assert.equal(sql(/administrador/).length, 0);
  });

  test('reenviar el enlace pide sesión y no reenvía si ya está verificado', async () => {
    assert.equal((await request(app).post('/api/auth/resend-verification')).status, 401);
    db.responder = async () => ({ rows: [{ id: 7, nombre: 'Ana', email: 'ana@example.com', email_verificado: true }] });
    const res = await request(app).post('/api/auth/resend-verification').set('Authorization', sesion());
    assert.match(res.body.mensaje, /ya está confirmado/);
    assert.equal(sql(/INSERT INTO tokens_cuenta/).length, 0);
  });
});

describe('perfil', () => {
  const fila = { id: 7, nombre: 'Ana', email: 'ana@example.com', rol: 'profesor', email_verificado: true, creado_en: '2026-01-01T00:00:00.000Z', password: hash };

  test('sin sesión → 401', async () => {
    assert.equal((await request(app).get('/api/cuenta')).status, 401);
    assert.equal((await request(app).put('/api/cuenta').send({ nombre: 'X' })).status, 401);
  });

  test('ver el perfil usa el id del token y no devuelve la contraseña', async () => {
    db.responder = async () => ({ rows: [fila] });
    const res = await request(app).get('/api/cuenta?id=1').set('Authorization', sesion());
    assert.deepEqual(res.body.usuario, { id: 7, nombre: 'Ana', email: 'ana@example.com', rol: 'profesor', emailVerificado: true, creadoEn: fila.creado_en });
    assert.deepEqual(db.consultas[0].params, [7]);
  });

  test('cambiar el nombre no deja cambiar el rol ni el correo', async () => {
    db.responder = async (s, p) => ({ rows: [{ ...fila, nombre: p[1] }] });
    const res = await request(app).put('/api/cuenta').set('Authorization', sesion()).send({ nombre: '  Ana María ', rol: 'administrador', email: 'otra@example.com' });
    assert.equal(res.body.usuario.nombre, 'Ana María');
    assert.match(db.consultas[0].sql, /^UPDATE usuarios SET nombre = \$2 WHERE id = \$1/);
    assert.deepEqual(db.consultas[0].params, [7, 'Ana María']);
  });

  test('cambiar la contraseña exige la actual', async () => {
    db.responder = async () => ({ rows: [fila] });
    const mal = await request(app).put('/api/cuenta/password').set('Authorization', sesion()).send({ actual: 'NoEs123!', nueva: NUEVA });
    assert.equal(mal.status, 400);
    assert.match(mal.body.error, /actual no coincide/);
    assert.equal(sql(/UPDATE usuarios SET password/).length, 0);
    const bien = await request(app).put('/api/cuenta/password').set('Authorization', sesion()).send({ actual: PASSWORD, nueva: NUEVA });
    assert.equal(bien.status, 200);
    assert.ok(await bcrypt.compare(NUEVA, sql(/UPDATE usuarios SET password/)[0].params[1]));
  });
});

describe('administración de usuarios', () => {
  const conRol = (rol, bloqueado = false) => async (s, p) => {
    if (/^SELECT rol, bloqueado/.test(s.trim())) return { rows: [{ rol, bloqueado }] };
    if (/^UPDATE usuarios SET rol/.test(s.trim())) return { rows: [{ id: p[0], nombre: 'Luis', email: 'luis@example.com', rol: p[1] }] };
    return { rows: [{ id: 9, nombre: 'Luis', email: 'luis@example.com', rol: 'estudiante', email_verificado: false, bloqueado: false, ultimo_login: null, creado_en: null, total: '41' }] };
  };

  test('sin sesión → 401; estudiante o profesor → 403', async () => {
    assert.equal((await request(app).get('/api/admin/usuarios')).status, 401);
    for (const rol of ['estudiante', 'profesor']) {
      db.responder = conRol(rol);
      assert.equal((await request(app).get('/api/admin/usuarios').set('Authorization', sesion())).status, 403);
      assert.equal((await request(app).put('/api/admin/usuarios/9/rol').set('Authorization', sesion()).send({ rol: 'profesor' })).status, 403);
    }
  });

  test('el rol se lee de la base, no del token: un token que dice administrador no basta', async () => {
    db.responder = conRol('estudiante');
    const res = await request(app).get('/api/admin/usuarios').set('Authorization', sesion({ rol: 'administrador' }));
    assert.equal(res.status, 403);
  });

  test('un administrador bloqueado pierde el acceso', async () => {
    db.responder = conRol('administrador', true);
    assert.equal((await request(app).get('/api/admin/usuarios').set('Authorization', sesion())).status, 403);
  });

  test('lista con búsqueda y paginación; los comodines se buscan como texto', async () => {
    db.responder = conRol('administrador');
    const res = await request(app).get('/api/admin/usuarios?buscar=LU_s%25&pagina=2').set('Authorization', sesion());
    assert.equal(res.status, 200);
    assert.equal(res.body.total, 41);
    assert.equal(res.body.pagina, 2);
    assert.equal(res.body.usuarios[0].password, undefined);
    assert.deepEqual(sql(/FROM usuarios\s+WHERE LOWER\(nombre\)/)[0].params, ['%lu\\_s\\%%', 25, 25]);
  });

  test('cambia el rol de otro usuario, valida el rol y no deja cambiar el propio', async () => {
    db.responder = conRol('administrador');
    const pedir = (id, rol) => request(app).put(`/api/admin/usuarios/${id}/rol`).set('Authorization', sesion()).send({ rol });
    const ok = await pedir(9, 'profesor');
    assert.equal(ok.status, 200);
    assert.equal(ok.body.usuario.rol, 'profesor');
    assert.equal((await pedir(9, 'superusuario')).status, 400);
    assert.equal((await pedir('abc', 'profesor')).status, 400);
    const propio = await pedir(7, 'estudiante');
    assert.equal(propio.status, 400);
    assert.match(propio.body.error, /propio rol/);
  });
});
