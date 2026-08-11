// PATRON ADAPTER (target/interfaz comun).
// Cada pasarela de pago (PayPal, Yape, Plin) tiene su propio SDK/API con su
// propia forma de llamarse. Esta clase define el contrato UNICO que el resto
// del sistema conoce: pagar(monto, datos) -> { exito, referencia, mensaje }.
// PaymentService nunca habla directo con el SDK de PayPal ni de Yape, solo
// con esta abstraccion (DIP + Protected Variations).
class PaymentGatewayAdapter {
  constructor(nombre) {
    if (new.target === PaymentGatewayAdapter) {
      throw new Error('PaymentGatewayAdapter es abstracta, no se puede instanciar directamente.');
    }
    this.nombre = nombre;
  }

  // Debe ser sobreescrito por cada adaptador concreto (Liskov: cualquier
  // adaptador puede sustituir a otro sin romper a PaymentService).
  async pagar(_monto, _datos) {
    throw new Error(`pagar() no esta implementado en el adaptador "${this.nombre}".`);
  }
}

module.exports = PaymentGatewayAdapter;
