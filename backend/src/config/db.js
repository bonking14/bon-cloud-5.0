const { Pool } = require('pg');
const env = require('./env');

// El Pool se conecta de forma perezosa en la primera consulta.
const pool = new Pool(env.db);

pool.on('error', (err) => {
  console.error('❌ Error inesperado en PostgreSQL:', err.message);
});

module.exports = pool;
