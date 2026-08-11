const express = require('express');
const { autenticar, soloAdmin } = require('../middleware/authenticate');

function crearPricingRoutes(pricingController) {
  const router = express.Router();

  router.get('/configuracion', pricingController.obtenerConfiguracion);
  router.put('/configuracion', autenticar, soloAdmin, pricingController.cambiarEstrategia);
  router.get('/:productoId', pricingController.calcularPrecio);

  return router;
}

module.exports = crearPricingRoutes;
