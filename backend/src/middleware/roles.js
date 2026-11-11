const pool = require('../config/db');

// Solo deja pasar a los roles indicados. El rol se lee de la base en cada pedido, no del
// token: así, quitarle el rol a alguien surte efecto de inmediato y no cuando venza su sesión.
const requerirRol = (...roles) => async (req, res, next) => {
  const r = await pool.query('SELECT rol, bloqueado FROM usuarios WHERE id = $1', [req.usuario.id]);
  const usuario = r.rows[0];
  if (!usuario || usuario.bloqueado || !roles.includes(usuario.rol)) {
    return res.status(403).json({ error: 'No tienes permiso para esta acción.' });
  }
  req.usuario.rol = usuario.rol;
  next();
};

module.exports = { requerirRol };
