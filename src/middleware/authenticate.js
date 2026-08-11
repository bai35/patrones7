const TokenService = require('../utils/TokenService');
const ApiError = require('../utils/ApiError');

// SRP: unica responsabilidad = verificar que la peticion trae un token valido.
function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'No autorizado. Token no proporcionado.'));
  }
  try {
    req.usuario = TokenService.verificar(authHeader.split(' ')[1]);
    next();
  } catch {
    next(new ApiError(401, 'Token invalido o expirado.'));
  }
}

function soloAdmin(req, res, next) {
  if (req.usuario?.rol !== 'admin') {
    return next(new ApiError(403, 'No tienes permisos para esta accion.'));
  }
  next();
}

module.exports = { autenticar, soloAdmin };
