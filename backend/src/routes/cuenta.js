const express = require('express');
const verificarToken = require('../middleware/auth');
const { verCuenta, actualizarCuenta, cambiarPassword } = require('../controllers/cuentaController');

const router = express.Router();

router.use(verificarToken);
router.get('/', verCuenta);
router.put('/', actualizarCuenta);
router.put('/password', cambiarPassword);

module.exports = router;
