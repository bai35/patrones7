const express = require('express');
const loginLimiter = require('../middleware/rateLimiter');
const { autenticar } = require('../middleware/authenticate');

// Factory de rutas: recibe el controlador ya construido (inyeccion de dependencias)
// en vez de instanciarlo aqui dentro. Esto mantiene bajo acoplamiento entre capas.
function crearAuthRoutes(authController) {
  const router = express.Router();

  router.post('/registro', authController.registrar);
  router.post('/login', loginLimiter, authController.iniciarSesion);
  router.get('/perfil', autenticar, authController.obtenerPerfil);
  router.put('/perfil', autenticar, authController.actualizarPerfil);

  return router;
}

module.exports = crearAuthRoutes;
