const express = require('express');
const { autenticar, soloAdmin } = require('../middleware/authenticate');

function crearProductRoutes(productController) {
  const router = express.Router();

  router.get('/', productController.listar);
  router.get('/catalogo', productController.listarCatalogo);
  router.post('/', autenticar, soloAdmin, productController.crear);
  router.patch('/:id/stock', autenticar, soloAdmin, productController.actualizarStock);

  return router;
}

module.exports = crearProductRoutes;
