const PaymentGatewayAdapter = require('./PaymentGatewayAdapter');

// PATRON ADAPTER: adapta la forma particular en que "hablaria" el SDK de
// PayPal (aqui simulado) al contrato comun definido por PaymentGatewayAdapter.
class PayPalAdapter extends PaymentGatewayAdapter {
  constructor() {
    super('paypal');
  }

  async pagar(monto, datos) {
    // Aqui iria la llamada real al SDK/API de PayPal. Se simula la respuesta
    // para que el resto del sistema (Strategy de precios, Command de pedidos,
    // etc.) pueda integrarse sin depender de credenciales reales.
    if (!datos?.emailPaypal) {
      return { exito: false, referencia: null, mensaje: 'Falta el correo de PayPal del pagador.' };
    }
    return {
      exito: true,
      referencia: `PP-${Date.now()}`,
      mensaje: `Pago de S/ ${monto.toFixed(2)} procesado con PayPal.`
    };
  }
}

module.exports = PayPalAdapter;
