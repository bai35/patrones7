const ApiError = require('../utils/ApiError');
const PrecioEstandarStrategy = require('../strategies/PrecioEstandarStrategy');
const PrecioDescuentoPorcentualStrategy = require('../strategies/PrecioDescuentoPorcentualStrategy');
const PrecioDinamicoStrategy = require('../strategies/PrecioDinamicoStrategy');

// PATRON STRATEGY (Context): elige que estrategia concreta usar segun la
// configuracion guardada, y delega el calculo en ella. Nunca implementa el
// calculo de precio el mismo (Information Expert lo delega correctamente:
// la estrategia es quien sabe calcular, este servicio solo la selecciona).
class PricingService {
  constructor(pricingConfigRepository, productRepository) {
    this.pricingConfigRepository = pricingConfigRepository;
    this.productRepository = productRepository;
  }

  async _obtenerEstrategiaActiva() {
    const config = await this.pricingConfigRepository.obtener();

    switch (config.estrategia) {
      case 'descuento_porcentual':
        return new PrecioDescuentoPorcentualStrategy(config.porcentajeDescuento);
      case 'dinamico':
        return new PrecioDinamicoStrategy(config.factorDemanda);
      case 'estandar':
      default:
        return new PrecioEstandarStrategy();
    }
  }

  async obtenerConfiguracion() {
    return this.pricingConfigRepository.obtener();
  }

  // RF10: cambiar la estrategia (y sus parametros) desde la configuracion.
  async cambiarEstrategia(datos) {
    const estrategiasValidas = ['estandar', 'descuento_porcentual', 'dinamico'];
    if (datos.estrategia && !estrategiasValidas.includes(datos.estrategia)) {
      throw new ApiError(400, 'Estrategia de precio invalida.');
    }
    return this.pricingConfigRepository.actualizar(datos);
  }

  // RF9: calcula el precio de un producto con la estrategia activa.
  async calcularPrecio(productoId) {
    const producto = await this.productRepository.buscarPorId(productoId);
    if (!producto) {
      throw new ApiError(404, 'Producto no encontrado.');
    }
    const estrategia = await this._obtenerEstrategiaActiva();
    return { producto: producto.nombre, precioBase: producto.precioBase, precioFinal: estrategia.calcular(producto) };
  }
}

module.exports = PricingService;
