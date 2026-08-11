const express = require('express');
const { autenticar, soloAdmin } = require('../middleware/authenticate');

function crearPaymentRoutes(paymentController) {
  const router = express.Router();

  router.get('/', paymentController.listarPasarelas);
  router.patch('/:nombre', autenticar, soloAdmin, paymentController.cambiarEstado);
  router.post('/pagar', paymentController.procesarPago);

  return router;
}

module.exports = crearPaymentRoutes;
