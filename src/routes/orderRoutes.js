const express = require('express');
const { autenticar } = require('../middleware/authenticate');

function crearOrderRoutes(orderController) {
  const router = express.Router();

  router.post('/', autenticar, orderController.crear);
  router.get('/mios', autenticar, orderController.listarMios);
  router.get('/comandos/historial', autenticar, orderController.historialComandos);
  router.get('/:id', autenticar, orderController.obtener);
  router.get('/:id/historial', autenticar, orderController.historialEstados);
  router.post('/:id/procesar', autenticar, orderController.procesar);
  router.post('/:id/descuento', autenticar, orderController.aplicarDescuento);
  router.post('/:id/cancelar', autenticar, orderController.cancelar);
  router.post('/:id/revertir', autenticar, orderController.revertir);

  return router;
}

module.exports = crearOrderRoutes;
