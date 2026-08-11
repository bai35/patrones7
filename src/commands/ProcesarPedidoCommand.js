const Command = require('./Command');
const ApiError = require('../utils/ApiError');
const PedidoMemento = require('../mementos/PedidoMemento');

// PATRON COMMAND + MEMENTO: antes de mutar el pedido, guarda un snapshot de
// como estaba (RF7 + RF8), para que ese cambio pueda revertirse despues.
class ProcesarPedidoCommand extends Command {
  constructor(orderRepository, pedidoHistorial, pedidoId) {
    super();
    this.orderRepository = orderRepository;
    this.pedidoHistorial = pedidoHistorial;
    this.pedidoId = pedidoId;
  }

  async ejecutar() {
    const pedido = await this.orderRepository.buscarPorId(this.pedidoId);
    if (!pedido) throw new ApiError(404, 'Pedido no encontrado.');
    if (pedido.estado !== 'creado') {
      throw new ApiError(400, `No se puede procesar un pedido en estado "${pedido.estado}".`);
    }

    this.pedidoHistorial.guardar(this.pedidoId, new PedidoMemento(pedido));

    pedido.estado = 'procesado';
    return this.orderRepository.guardar(pedido);
  }
}

module.exports = ProcesarPedidoCommand;
