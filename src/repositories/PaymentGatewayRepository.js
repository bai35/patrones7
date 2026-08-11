const PaymentGatewayConfig = require('../models/PaymentGatewayConfig');

// SRP: unico responsable de hablar con Mongoose para la coleccion de
// configuracion de pasarelas de pago.
class PaymentGatewayRepository {
  async listar() {
    return PaymentGatewayConfig.find().sort({ nombre: 1 });
  }

  async buscarPorNombre(nombre) {
    return PaymentGatewayConfig.findOne({ nombre });
  }

  async actualizarEstado(nombre, habilitada) {
    return PaymentGatewayConfig.findOneAndUpdate(
      { nombre },
      { habilitada },
      { new: true, upsert: true }
    );
  }
}

module.exports = PaymentGatewayRepository;
