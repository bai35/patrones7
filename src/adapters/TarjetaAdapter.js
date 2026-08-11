const PaymentGatewayAdapter = require('./PaymentGatewayAdapter');

// PATRON ADAPTER: adapta el cobro con tarjeta asociada a un banco peruano
// (BCP, Interbank, u otro) al mismo contrato pagar(monto, datos) que usan
// YapeAdapter y PlinAdapter. El resto del sistema sigue sin saber que un
// pago con tarjeta valida numero/CVV/vencimiento distinto a un pago con
// billetera movil.
const BANCOS_VALIDOS = ['bcp', 'interbank', 'otro'];
const PREFIJOS_REFERENCIA = { bcp: 'BCP', interbank: 'IBK', otro: 'TJ' };

class TarjetaAdapter extends PaymentGatewayAdapter {
  constructor() {
    super('tarjeta');
  }

  async pagar(monto, datos) {
    const banco = (datos?.banco || '').toLowerCase();
    const numeroTarjeta = (datos?.numeroTarjeta || '').replace(/\s+/g, '');
    const titular = datos?.titular || '';
    const vencimiento = datos?.vencimiento || '';
    const cvv = datos?.cvv || '';

    if (!BANCOS_VALIDOS.includes(banco)) {
      return { exito: false, referencia: null, mensaje: 'Selecciona un banco valido (BCP, Interbank u otro).' };
    }
    if (!titular.trim()) {
      return { exito: false, referencia: null, mensaje: 'Falta el nombre del titular de la tarjeta.' };
    }
    if (!/^\d{16}$/.test(numeroTarjeta)) {
      return { exito: false, referencia: null, mensaje: 'El numero de tarjeta debe tener 16 digitos.' };
    }
    if (!/^\d{2}\/\d{2}$/.test(vencimiento)) {
      return { exito: false, referencia: null, mensaje: 'La fecha de vencimiento debe tener el formato MM/AA.' };
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      return { exito: false, referencia: null, mensaje: 'El CVV debe tener 3 o 4 digitos.' };
    }

    const prefijo = PREFIJOS_REFERENCIA[banco];
    return {
      exito: true,
      referencia: `${prefijo}-${Date.now()}`,
      mensaje: `Pago de S/ ${monto.toFixed(2)} procesado con tarjeta (${banco === 'otro' ? 'banco' : banco.toUpperCase()}).`
    };
  }
}

module.exports = TarjetaAdapter;
