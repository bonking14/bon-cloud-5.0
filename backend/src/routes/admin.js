const express = require('express');
const verificarToken = require('../middleware/auth');
const { requerirRol } = require('../middleware/roles');
const { listarUsuarios, cambiarRol } = require('../controllers/adminController');

const router = express.Router();

router.use(verificarToken, requerirRol('administrador'));
router.get('/usuarios', listarUsuarios);
router.put('/usuarios/:id/rol', cambiarRol);

module.exports = router;
