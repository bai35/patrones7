const PaymentGatewayAdapter = require('./PaymentGatewayAdapter');

// PATRON ADAPTER: idem, adaptando Plin al mismo contrato pagar().
class PlinAdapter extends PaymentGatewayAdapter {
  constructor() {
    super('plin');
  }

  async pagar(monto, datos) {
    if (!datos?.numeroCelular) {
      return { exito: false, referencia: null, mensaje: 'Falta el numero de celular Plin.' };
    }
    return {
      exito: true,
      referencia: `PL-${Date.now()}`,
      mensaje: `Pago de S/ ${monto.toFixed(2)} procesado con Plin.`
    };
  }
}

module.exports = PlinAdapter;
