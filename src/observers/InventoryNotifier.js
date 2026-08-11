// PATRON OBSERVER (Subject): mantiene la lista de observadores y los avisa
// cuando ocurre el evento "stock bajo". No sabe (ni le importa) quienes son
// los observadores concretos ni que hacen con el evento (Low Coupling).
class InventoryNotifier {
  constructor() {
    this.observadores = [];
  }

  suscribir(observador) {
    this.observadores.push(observador);
  }

  desuscribir(observador) {
    this.observadores = this.observadores.filter((o) => o !== observador);
  }

  // RF5: se dispara cuando el stock de un producto cae por debajo del minimo.
  async notificarStockBajo(producto) {
    await Promise.all(this.observadores.map((o) => o.actualizar({ producto })));
  }
}

module.exports = InventoryNotifier;
