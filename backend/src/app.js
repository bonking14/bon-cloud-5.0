const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');

const authRoutes = require('./routes/auth');
const progresoRoutes = require('./routes/progreso');
const cuentaRoutes = require('./routes/cuenta');
const adminRoutes = require('./routes/admin');
const grupos = require('./routes/grupos');
const examenesRoutes = require('./routes/examenes');
const { noEncontrado, manejarErrores } = require('./middleware/errores');

const app = express();

app.use(helmet());

// Render pone un proxy delante: sin esto el rate limit vería una sola IP
app.set('trust proxy', 1);

app.use(cors({
  origin: env.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiados intentos. Espera 15 minutos.' }
}));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use(express.json({ limit: '100kb' }));

app.get('/', (req, res) => {
  res.json({ mensaje: 'BonCloud API corriendo' });
});

// Para el monitoreo: responde 200 solo si el servidor llega a la base de datos
app.get('/api/salud', async (req, res) => {
  try {
    await require('./config/db').query('SELECT 1');
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false, error: 'Sin conexión con la base de datos.' });
  }
});

// El simulador logístico calcula en el navegador (js/simulador.js): no hay endpoint /api/simulador.
app.use('/api/auth', authRoutes);
app.use('/api/progreso', progresoRoutes);
app.use('/api/cuenta', cuentaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/grupos', grupos.profesor);
app.use('/api', grupos.estudiante);
app.use('/api', examenesRoutes);

app.use(noEncontrado);
app.use(manejarErrores);

module.exports = app;
