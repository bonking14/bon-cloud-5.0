// Enlaces de un solo uso (recuperar contraseña, verificar correo).
const crypto = require('crypto');
const pool = require('../config/db');

const huella = (token) => crypto.createHash('sha256').update(token).digest('hex');

// Crea un enlace nuevo e invalida los anteriores del mismo tipo que sigan sin usar
async function crearToken(usuarioId, tipo, minutos) {
  const token = crypto.randomBytes(32).toString('hex');
  await pool.query(
    'UPDATE tokens_cuenta SET usado_en = NOW() WHERE usuario_id = $1 AND tipo = $2 AND usado_en IS NULL',
    [usuarioId, tipo]
  );
  await pool.query(
    `INSERT INTO tokens_cuenta (usuario_id, tipo, token_hash, expira_en)
     VALUES ($1, $2, $3, NOW() + make_interval(mins => $4))`,
    [usuarioId, tipo, huella(token), minutos]
  );
  return token;
}

// Marca el enlace como usado y devuelve su usuario, o null si no existe, venció o ya se usó.
// Es una sola consulta: dos pedidos simultáneos con el mismo enlace no pueden pasar los dos.
async function consumirToken(token, tipo) {
  if (typeof token !== 'string' || !/^[0-9a-f]{64}$/.test(token)) return null;
  const r = await pool.query(
    `UPDATE tokens_cuenta SET usado_en = NOW()
      WHERE token_hash = $1 AND tipo = $2 AND usado_en IS NULL AND expira_en > NOW()
  RETURNING usuario_id`,
    [huella(token), tipo]
  );
  return r.rows.length ? r.rows[0].usuario_id : null;
}

module.exports = { crearToken, consumirToken, huella };
