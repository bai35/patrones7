// PATRON COMMAND: encapsula una accion sobre un pedido (crear, procesar,
// aplicar descuento, cancelar) como un objeto, para poder ejecutarla y
// registrarla en un historial de forma uniforme (RF7).
class Command {
  async ejecutar() {
    throw new Error('ejecutar() debe ser implementado por el comando concreto.');
  }
}

module.exports = Command;
