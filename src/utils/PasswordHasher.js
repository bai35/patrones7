const bcrypt = require('bcryptjs');

// SRP: la unica responsabilidad de esta clase es todo lo relacionado a contrasenas.
// Si mañana cambias bcrypt por argon2, solo se toca este archivo (OCP / DIP).
class PasswordHasher {
  static async hash(passwordPlano) {
    return bcrypt.hash(passwordPlano, 10);
  }

  static async comparar(passwordPlano, passwordHash) {
    return bcrypt.compare(passwordPlano, passwordHash);
  }
}

module.exports = PasswordHasher;
