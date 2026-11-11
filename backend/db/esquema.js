// Aplica db/schema.sql. El esquema es idempotente: se puede aplicar las veces que sea.
const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

const aplicarEsquema = async () => {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const cliente = await pool.connect();
  try {
    // Candado para que dos arranques simultáneos no apliquen el esquema a la vez
    await cliente.query('SELECT pg_advisory_lock(20261111)');
    await cliente.query(sql);
  } finally {
    await cliente.query('SELECT pg_advisory_unlock(20261111)').catch(() => {});
    cliente.release();
  }
};

module.exports = { aplicarEsquema };
