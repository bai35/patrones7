const express = require('express');
const { autenticar } = require('../middleware/authenticate');

function crearNotificationRoutes(notificationController) {
  const router = express.Router();
  router.get('/', autenticar, notificationController.listarMias);
  return router;
}

module.exports = crearNotificationRoutes;
