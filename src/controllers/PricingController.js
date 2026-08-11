const asyncHandler = require('../utils/asyncHandler');

class PricingController {
  constructor(pricingService) {
    this.pricingService = pricingService;
    this.obtenerConfiguracion = asyncHandler(this.obtenerConfiguracion.bind(this));
    this.cambiarEstrategia = asyncHandler(this.cambiarEstrategia.bind(this));
    this.calcularPrecio = asyncHandler(this.calcularPrecio.bind(this));
  }

  async obtenerConfiguracion(req, res) {
    const configuracion = await this.pricingService.obtenerConfiguracion();
    res.json({ configuracion });
  }

  async cambiarEstrategia(req, res) {
    const configuracion = await this.pricingService.cambiarEstrategia(req.body);
    res.json({ mensaje: 'Estrategia de precios actualizada.', configuracion });
  }

  async calcularPrecio(req, res) {
    const resultado = await this.pricingService.calcularPrecio(req.params.productoId);
    res.json(resultado);
  }
}

module.exports = PricingController;
