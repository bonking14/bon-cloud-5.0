// 404 en JSON para cualquier ruta que no exista.
const noEncontrado = (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
};

// Manejador central: los controladores pasan el error con next(err) (Express 5 también
// captura los errores de funciones async).
// eslint-disable-next-line no-unused-vars
const manejarErrores = (err, req, res, next) => {
  // JSON mal formado en el body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es JSON válido.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'La petición es demasiado grande.' });
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
};

module.exports = { noEncontrado, manejarErrores };
