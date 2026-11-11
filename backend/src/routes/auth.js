const express = require('express');
const rateLimit = require('express-rate-limit');
const verificarToken = require('../middleware/auth');
const { register, login, forgotPassword, resetPassword, verifyEmail, resendVerification } = require('../controllers/authController');

const router = express.Router();

// Las rutas que envían correo tienen un límite más bajo (cada una el suyo), para que no
// sirvan para llenarle el buzón a nadie
const limiteCorreos = () => rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiadas solicitudes. Espera 15 minutos.' }
});

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', limiteCorreos(), forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', verificarToken, limiteCorreos(), resendVerification);

module.exports = router;
