const Command = require('./Command');
const ApiError = require('../utils/ApiError');
const PedidoMemento = require('../mementos/PedidoMemento');

class CancelarPedidoCommand extends Command {
  constructor(orderRepository, pedidoHistorial, pedidoId) {
    super();
    this.orderRepository = orderRepository;
    this.pedidoHistorial = pedidoHistorial;
    this.pedidoId = pedidoId;
  }

  async ejecutar() {
    const pedido = await this.orderRepository.buscarPorId(this.pedidoId);
    if (!pedido) throw new ApiError(404, 'Pedido no encontrado.');
    if (pedido.estado === 'cancelado') {
      throw new ApiError(400, 'El pedido ya esta cancelado.');
    }

    this.pedidoHistorial.guardar(this.pedidoId, new PedidoMemento(pedido));

    pedido.estado = 'cancelado';
    return this.orderRepository.guardar(pedido);
  }
}

module.exports = CancelarPedidoCommand;
