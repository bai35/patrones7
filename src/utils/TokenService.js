const jwt = require('jsonwebtoken');

// SRP: unica responsabilidad = emitir y verificar tokens.
// AuthService e el middleware de autenticacion dependen de esta abstraccion,
// no directamente de la libreria jsonwebtoken (DIP).
class TokenService {
  static generar(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
  }

  static verificar(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = TokenService;
