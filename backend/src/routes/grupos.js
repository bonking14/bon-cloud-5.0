const express = require('express');
const rateLimit = require('express-rate-limit');
const verificarToken = require('../middleware/auth');
const { requerirRol } = require('../middleware/roles');
const g = require('../controllers/gruposController');
const { registrarIntento } = require('../controllers/intentosController');

// Rutas del estudiante: sus grupos y sus intentos de quiz. El token se pide en cada ruta y
// no con router.use, porque este router cuelga de /api y no debe atrapar las demás rutas.
const estudiante = express.Router();
// Pocos intentos por cuarto de hora: el código no se puede adivinar probando
const limiteCodigo = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Demasiados intentos. Espera 15 minutos.' } });
estudiante.get('/mis-grupos', verificarToken, g.misGrupos);
estudiante.post('/mis-grupos', verificarToken, limiteCodigo, g.unirse);
estudiante.delete('/mis-grupos/:id', verificarToken, g.salir);
estudiante.post('/intentos', verificarToken, registrarIntento);

// Rutas del profesor (y del administrador, que ve todos los grupos)
const profesor = express.Router();
profesor.use(verificarToken, requerirRol('profesor', 'administrador'));
profesor.get('/', g.listarGrupos);
profesor.post('/', g.crearGrupo);
profesor.get('/:id', g.verGrupo);
profesor.put('/:id', g.actualizarGrupo);
profesor.delete('/:id', g.eliminarGrupo);
profesor.delete('/:id/miembros/:usuarioId', g.sacarMiembro);

module.exports = { estudiante, profesor };
