const express = require('express');
const verificarToken = require('../middleware/auth');
const { requerirRol } = require('../middleware/roles');
const { listarUsuarios, cambiarRol } = require('../controllers/adminController');
const inst = require('../controllers/institucionesController');

const router = express.Router();

router.use(verificarToken, requerirRol('administrador'));
router.get('/usuarios', listarUsuarios);
router.put('/usuarios/:id/rol', cambiarRol);
router.put('/usuarios/:id/institucion', inst.asignar);
router.get('/instituciones', inst.listar);
router.post('/instituciones', inst.crear);
router.put('/instituciones/:id', inst.actualizar);
router.delete('/instituciones/:id', inst.eliminar);

module.exports = router;
