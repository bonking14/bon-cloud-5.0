const pool = require('../config/db');

const ROLES = ['estudiante', 'profesor', 'administrador'];
const POR_PAGINA = 25;

// Lista de usuarios con búsqueda por nombre o correo, de a 25
const listarUsuarios = async (req, res) => {
  const buscar = typeof req.query.buscar === 'string' ? req.query.buscar.trim().slice(0, 100) : '';
  const pagina = Math.max(1, parseInt(req.query.pagina, 10) || 1);
  // Los comodines que escriba el usuario se buscan como texto literal
  const patron = `%${buscar.toLowerCase().replace(/[\\%_]/g, '\\$&')}%`;
  const r = await pool.query(
    `SELECT id, nombre, email, rol, email_verificado, bloqueado, ultimo_login, creado_en,
            COUNT(*) OVER() AS total
       FROM usuarios
      WHERE LOWER(nombre) LIKE $1 OR LOWER(email) LIKE $1
      ORDER BY creado_en DESC, id DESC
      LIMIT $2 OFFSET $3`,
    [patron, POR_PAGINA, (pagina - 1) * POR_PAGINA]
  );
  res.json({
    usuarios: r.rows.map((u) => ({
      id: u.id, nombre: u.nombre, email: u.email, rol: u.rol, emailVerificado: Boolean(u.email_verificado),
      bloqueado: Boolean(u.bloqueado), ultimoLogin: u.ultimo_login, creadoEn: u.creado_en,
    })),
    total: r.rows.length ? Number(r.rows[0].total) : 0,
    pagina,
    porPagina: POR_PAGINA,
  });
};

const cambiarRol = async (req, res) => {
  const id = Number(req.params.id);
  const { rol } = req.body || {};
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Usuario inválido.' });
  if (!ROLES.includes(rol)) return res.status(400).json({ error: 'El rol debe ser estudiante, profesor o administrador.' });
  // Nadie se quita a sí mismo el rol: así siempre queda al menos un administrador
  if (id === req.usuario.id) return res.status(400).json({ error: 'No puedes cambiar tu propio rol.' });

  const r = await pool.query('UPDATE usuarios SET rol = $2 WHERE id = $1 RETURNING id, nombre, email, rol', [id, rol]);
  if (!r.rows.length) return res.status(404).json({ error: 'Usuario no encontrado.' });
  res.json({ mensaje: 'Rol actualizado.', usuario: r.rows[0] });
};

module.exports = { listarUsuarios, cambiarRol, ROLES };
