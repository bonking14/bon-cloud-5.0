const env = require('./src/config/env');
const app = require('./src/app');
const { aplicarEsquema } = require('./db/esquema');

// Antes de atender pedidos se pone la base al día (crea tablas y columnas que falten, sin
// tocar los datos). Así un despliegue nunca corre con una base desactualizada. Si falla, el
// servidor no arranca y Render deja funcionando la versión anterior.
aplicarEsquema()
  .then(() => {
    console.log('✅ Base de datos al día');
    app.listen(env.port, () => {
      console.log(`✅ Servidor corriendo en puerto ${env.port}`);
    });
  })
  .catch((err) => {
    console.error('❌ No se pudo actualizar la base de datos:', err.message);
    process.exit(1);
  });
