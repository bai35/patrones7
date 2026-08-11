const ApiError = require('../utils/ApiError');

// SRP: unico lugar del sistema que decide como se ve una respuesta de error.
// Todos los controladores simplemente lanzan (throw) un ApiError y terminan aqui.
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ mensaje: err.message });
  }

  // Errores de Mongoose por indice unico duplicado (email/documento repetido)
  if (err.code === 11000) {
    return res.status(409).json({ mensaje: 'Ya existe un registro con ese dato.' });
  }

  console.error(err);
  return res.status(500).json({ mensaje: 'Error interno del servidor.' });
}

module.exports = errorHandler;
