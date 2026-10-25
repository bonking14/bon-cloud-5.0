const express = require('express');
const verificarToken = require('../middleware/auth');
const { obtenerProgreso, guardarProgreso } = require('../controllers/progresoController');

const router = express.Router();

router.use(verificarToken);
router.get('/', obtenerProgreso);
router.post('/', guardarProgreso);

module.exports = router;
