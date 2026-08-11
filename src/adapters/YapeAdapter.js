const PaymentGatewayAdapter = require('./PaymentGatewayAdapter');

// PATRON ADAPTER: misma idea que PayPalAdapter, pero adaptando la forma
// particular de cobrar por Yape (numero de celular + codigo QR/OTP).
class YapeAdapter extends PaymentGatewayAdapter {
  constructor() {
    super('yape');
  }

  async pagar(monto, datos) {
    if (!datos?.numeroCelular) {
      return { exito: false, referencia: null, mensaje: 'Falta el numero de celular Yape.' };
    }
    return {
      exito: true,
      referencia: `YP-${Date.now()}`,
      mensaje: `Pago de S/ ${monto.toFixed(2)} procesado con Yape.`
    };
  }
}

module.exports = YapeAdapter;
