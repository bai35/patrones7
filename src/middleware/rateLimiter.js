const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { mensaje: 'Demasiados intentos. Intenta de nuevo en unos minutos.' }
});

module.exports = loginLimiter;
