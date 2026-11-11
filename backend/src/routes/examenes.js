const express = require('express');
const verificarToken = require('../middleware/auth');
const { verEstado, iniciar, responder, verificarCertificado } = require('../controllers/examenesController');

const router = express.Router();

// Pública: la abre quien recibe un certificado y quiere comprobarlo
router.get('/certificados/:codigo', verificarCertificado);

router.get('/examenes', verificarToken, verEstado);
router.post('/examenes', verificarToken, iniciar);
router.post('/examenes/:id/responder', verificarToken, responder);

module.exports = router;
