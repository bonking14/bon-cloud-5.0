// Ejecuta db/schema.sql contra la base de datos configurada en las variables de entorno.
const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

const migrar = async () => {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('✅ Esquema aplicado correctamente.');
};

migrar()
  .catch((err) => {
    console.error('❌ Error al aplicar el esquema:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
