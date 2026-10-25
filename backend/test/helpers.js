// Prepara el entorno y reemplaza src/config/db.js por un pool falso antes de cargar la app.
const path = require('path');

process.env.JWT_SECRET = 'secreto-de-prueba';
process.env.DATABASE_URL = 'postgres://prueba:prueba@localhost:5432/prueba';
delete process.env.CORS_ORIGINS;

// Cada test define cómo responde la base: recibe (sql, params) y devuelve { rows }.
const db = {
  responder: async () => ({ rows: [] }),
  consultas: [],
  liberado: 0
};

const ejecutar = async (sql, params) => {
  db.consultas.push({ sql, params });
  return db.responder(sql, params);
};

const poolFalso = {
  query: ejecutar,
  connect: async () => ({
    query: ejecutar,
    release: () => { db.liberado += 1; }
  }),
  end: async () => {}
};

const rutaDb = path.join(__dirname, '..', 'src', 'config', 'db.js');
require.cache[rutaDb] = {
  id: rutaDb,
  filename: rutaDb,
  loaded: true,
  exports: poolFalso
};

const reiniciarDb = () => {
  db.responder = async () => ({ rows: [] });
  db.consultas = [];
  db.liberado = 0;
};

const app = require('../src/app');

module.exports = { app, db, reiniciarDb };
