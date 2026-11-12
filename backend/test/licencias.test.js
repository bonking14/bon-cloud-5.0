const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app, db, reiniciarDb } = require('./helpers');

const sesion = (id = 1) => `Bearer ${jwt.sign({ id, email: 'x@example.com', nombre: 'X' }, process.env.JWT_SECRET)}`;
const sql = (patron) => db.consultas.filter((c) => patron.test(c.sql));
const rol = (r, extra = () => null) => async (s, p) => extra(s, p) || (/^SELECT rol, bloqueado/.test(s.trim()) ? { rows: [{ rol: r, bloqueado: false }] } : { rows: [] });

beforeEach(reiniciarDb);

describe('instituciones (solo administrador)', () => {
  test('un profesor no puede ver ni crear instituciones', async () => {
    db.responder = rol('profesor');
    assert.equal((await request(app).get('/api/admin/instituciones').set('Authorization', sesion())).status, 403);
    assert.equal((await request(app).post('/api/admin/instituciones').set('Authorization', sesion()).send({ nombre: 'X', cupos: 5 })).status, 403);
  });

  test('crea validando nombre, cupos y fecha', async () => {
    db.responder = rol('administrador', (s, p) => (/^INSERT INTO instituciones/.test(s.trim()) ? { rows: [{ id: 4, nombre: p[0], cupos: p[1], vence_en: p[2], activa: true }] } : null));
    const crear = (d) => request(app).post('/api/admin/instituciones').set('Authorization', sesion()).send(d);
    for (const malo of [{ cupos: 5 }, { nombre: 'U', cupos: -1 }, { nombre: 'U', cupos: 2.5 }, { nombre: 'U', cupos: 5, venceEn: '31/12/2027' }, { nombre: 'U', cupos: 5, venceEn: '2027-13-45' }]) {
      assert.equal((await crear(malo)).status, 400);
    }
    const res = await crear({ nombre: ' Universidad del Caribe ', cupos: 120, venceEn: '2027-12-31' });
    assert.equal(res.status, 201);
    assert.deepEqual(sql(/^INSERT INTO instituciones/)[0].params, ['Universidad del Caribe', 120, '2027-12-31', null]);
  });

  test('editar puede quitar el vencimiento sin tocar lo demás', async () => {
    db.responder = rol('administrador', (s) => (/^UPDATE instituciones/.test(s.trim()) ? { rows: [{ id: 4, nombre: 'U', cupos: 10, vence_en: null, activa: true }] } : null));
    const res = await request(app).put('/api/admin/instituciones/4').set('Authorization', sesion()).send({ venceEn: null });
    assert.equal(res.status, 200);
    assert.deepEqual(sql(/^UPDATE instituciones/)[0].params, [4, null, null, true, null, null, null]);
  });

  test('asignar un profesor exige que la institución exista', async () => {
    db.responder = rol('administrador');
    const res = await request(app).put('/api/admin/usuarios/9/institucion').set('Authorization', sesion()).send({ institucionId: 99 });
    assert.equal(res.status, 404);
    assert.equal(sql(/^UPDATE usuarios SET institucion_id/).length, 0);
  });
});

describe('la licencia limita quién se une a un grupo', () => {
  const grupo = { id: 3, nombre: 'Comex', archivado: false, profesor_id: 7, profesor: 'Profe' };
  const base = (licencia, yaOcupaCupo = false) => async (s) => {
    if (/WHERE g\.codigo/.test(s)) return { rows: [grupo] };
    if (/FROM usuarios u JOIN instituciones i/.test(s)) return { rows: licencia ? [licencia] : [] };
    if (/SELECT 1 FROM grupo_miembros m JOIN grupos g/.test(s)) return { rows: yaOcupaCupo ? [{}] : [] };
    return { rows: [] };
  };
  const lic = (d) => ({ id: 4, nombre: 'Universidad del Caribe', cupos: 2, usados: '1', vence_en: null, activa: true, vencida: false, ...d });
  const unir = () => request(app).post('/api/mis-grupos').set('Authorization', sesion(20)).send({ codigo: 'ABC234' });
  const entro = () => sql(/^INSERT INTO grupo_miembros/).length === 1;

  test('profesor sin institución: no hay límite', async () => {
    db.responder = base(null);
    assert.equal((await unir()).status, 201);
    assert.ok(entro());
  });

  test('con cupos libres entra', async () => {
    db.responder = base(lic());
    assert.equal((await unir()).status, 201);
  });

  test('licencia vencida o desactivada: no entra', async () => {
    for (const d of [{ vencida: true }, { activa: false }]) {
      reiniciarDb();
      db.responder = base(lic(d));
      const res = await unir();
      assert.equal(res.status, 403);
      assert.match(res.body.error, /no está vigente/);
      assert.ok(!entro());
    }
  });

  test('sin cupos: no entra un estudiante nuevo, pero sí quien ya ocupa un cupo en otro grupo', async () => {
    db.responder = base(lic({ usados: '2' }));
    const res = await unir();
    assert.equal(res.status, 403);
    assert.match(res.body.error, /ya usó todos sus cupos \(2\)/);
    assert.ok(!entro());
    reiniciarDb();
    db.responder = base(lic({ usados: '2' }), true);
    assert.equal((await unir()).status, 201);
  });
});
