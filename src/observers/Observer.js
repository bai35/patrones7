// PATRON OBSERVER: contrato que deben cumplir todos los observadores.
// El Subject (InventoryNotifier) no sabe que hace cada observador con el
// evento, solo sabe que puede llamar a actualizar(evento).
class Observer {
  async actualizar(_evento) {
    throw new Error('actualizar() debe ser implementado por el observador concreto.');
  }
}

module.exports = Observer;
