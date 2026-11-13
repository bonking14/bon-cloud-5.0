// Aplica db/schema.sql. El esquema es idempotente: se puede aplicar las veces que sea.
const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

// Todo va en UNA transacción, con un candado que se suelta solo al terminarla. Así funciona
// también detrás de un agrupador de conexiones (el «pooler» de Neon reparte cada transacción
// a una conexión distinta, y un candado de sesión podía quedarse tomado para siempre y dejar
// colgado el siguiente arranque). Si otro arranque tiene el candado, se espera máximo dos
// minutos y se falla con un mensaje claro, en vez de quedarse esperando sin fin.
const aplicarEsquema = async () => {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');
    await cliente.query("SET LOCAL lock_timeout = '120s'");
    await cliente.query('SELECT pg_advisory_xact_lock(20261111)');
    await cliente.query(sql);
    await cliente.query('COMMIT');
  } catch (err) {
    await cliente.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    cliente.release();
  }
};

module.exports = { aplicarEsquema };
