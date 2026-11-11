// Único punto donde se carga .env. El resto del código lee la configuración desde aquí.
require('dotenv').config({ quiet: true });

const ORIGENES_POR_DEFECTO = [
  'https://bonking14.github.io',
  'http://localhost:4000',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:5503',
  'http://localhost:5503'
];

const faltantes = [];

if (!process.env.JWT_SECRET) faltantes.push('JWT_SECRET');

if (!process.env.DATABASE_URL) {
  const dbSueltas = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  const sinValor = dbSueltas.filter((nombre) => !process.env[nombre]);
  if (sinValor.length > 0) {
    faltantes.push(`DATABASE_URL (o bien ${sinValor.join(', ')})`);
  }
}

if (faltantes.length > 0) {
  console.error('❌ Faltan variables de entorno obligatorias:');
  faltantes.forEach((nombre) => console.error(`   - ${nombre}`));
  console.error('Revisa backend/README.md para ver cómo configurarlas.');
  process.exit(1);
}

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : ORIGENES_POR_DEFECTO;

const lista = (valor) => (valor || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);

module.exports = {
  // Correo (Resend). Sin clave el servidor arranca igual y escribe los enlaces en el registro.
  resendApiKey: process.env.RESEND_API_KEY || '',
  emailRemitente: process.env.EMAIL_FROM || 'BonCloud <onboarding@resend.dev>',
  // Dirección pública de la web: con ella se arman los enlaces de los correos
  appUrl: (process.env.APP_URL || 'https://bonking14.github.io/bon-cloud-5.0/').replace(/\/?$/, '/'),
  // Correos que pasan a administrador cuando verifican su dirección
  adminEmails: lista(process.env.ADMIN_EMAILS),
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  corsOrigins,
  db: process.env.DATABASE_URL
    ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
    : {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    }
};
