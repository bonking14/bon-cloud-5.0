// Aplica el esquema a mano (npm run db:migrate). El servidor también lo aplica al arrancar.
const pool = require('../src/config/db');
const { aplicarEsquema } = require('./esquema');

aplicarEsquema()
  .then(() => console.log('✅ Esquema aplicado correctamente.'))
  .catch((err) => {
    console.error('❌ Error al aplicar el esquema:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
