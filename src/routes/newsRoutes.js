const express = require('express');

function crearNewsRoutes(newsController) {
  const router = express.Router();
  router.get('/', newsController.listar);
  return router;
}

module.exports = crearNewsRoutes;
