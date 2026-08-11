const ApiError = require('../utils/ApiError');
const PayPalAdapter = require('../adapters/PayPalAdapter');
const YapeAdapter = require('../adapters/YapeAdapter');
const PlinAdapter = require('../adapters/PlinAdapter');
const TarjetaAdapter = require('../adapters/TarjetaAdapter');

// PATRON ADAPTER (cliente del adaptador): PaymentService solo conoce el
// contrato comun `pagar(monto, datos)`. No sabe (ni le importa) que PayPal,
// Yape y Plin tienen APIs distintas entre si; eso lo resuelve cada Adapter.
//
// Information Expert: esta clase tiene lo necesario (el repositorio de
// configuracion + el mapa de adaptadores) para decidir si un pago puede
// procesarse o no.
class PaymentService {
  constructor(paymentGatewayRepository) {
    this.paymentGatewayRepository = paymentGatewayRepository;

    // Registro de adaptadores disponibles. Agregar una pasarela nueva
    // (ej. "PagoEfectivo") solo implica crear su Adapter y añadirlo aqui,
    // sin tocar el resto del servicio (OCP).
    this.adaptadores = {
      paypal: new PayPalAdapter(),
      yape: new YapeAdapter(),
      plin: new PlinAdapter(),
      tarjeta: new TarjetaAdapter()
    };
  }

  async listarPasarelas() {
    const configuradas = await this.paymentGatewayRepository.listar();
    const nombresConfigurados = new Set(configuradas.map((c) => c.nombre));

    // Cualquier pasarela que tenga adaptador pero aun no tenga registro en
    // la BD se muestra como habilitada por defecto.
    const faltantes = Object.keys(this.adaptadores)
      .filter((nombre) => !nombresConfigurados.has(nombre))
      .map((nombre) => ({ nombre, habilitada: true }));

    return [...configuradas, ...faltantes];
  }

  async cambiarEstado(nombre, habilitada) {
    if (!this.adaptadores[nombre]) {
      throw new ApiError(404, `La pasarela "${nombre}" no existe.`);
    }
    return this.paymentGatewayRepository.actualizarEstado(nombre, habilitada);
  }

  async procesarPago(nombre, monto, datos) {
    const adaptador = this.adaptadores[nombre];
    if (!adaptador) {
      throw new ApiError(404, `La pasarela "${nombre}" no existe.`);
    }
    if (!monto || monto <= 0) {
      throw new ApiError(400, 'El monto a pagar debe ser mayor a 0.');
    }

    const configuracion = await this.paymentGatewayRepository.buscarPorNombre(nombre);
    const habilitada = configuracion ? configuracion.habilitada : true;
    if (!habilitada) {
      throw new ApiError(403, `La pasarela "${nombre}" esta deshabilitada por el administrador.`);
    }

    // Aqui esta el corazon del Adapter: sin importar cual sea "nombre",
    // siempre se llama de la misma forma: adaptador.pagar(monto, datos).
    return adaptador.pagar(monto, datos);
  }
}

module.exports = PaymentService;
