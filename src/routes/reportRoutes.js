const express = require('express');
const { autenticar } = require('../middleware/authenticate');

function crearReportRoutes(reportController) {
  const router = express.Router();

  // "autenticar" solo confirma que el token es valido y llena req.usuario.
  // La verificacion de ROL especifica (Gerente/Contador) la hace el Proxy,
  // no este middleware, siguiendo el patron Proxy pedido en el RF3/RF4.
  router.get('/completo', autenticar, reportController.obtenerReporteCompleto);

  return router;
}

module.exports = crearReportRoutes;
