const Command = require('./Command');
const ApiError = require('../utils/ApiError');
const PedidoMemento = require('../mementos/PedidoMemento');

class AplicarDescuentoCommand extends Command {
  constructor(orderRepository, pedidoHistorial, pedidoId, porcentajeDescuento) {
    super();
    this.orderRepository = orderRepository;
    this.pedidoHistorial = pedidoHistorial;
    this.pedidoId = pedidoId;
    this.porcentajeDescuento = porcentajeDescuento;
  }

  async ejecutar() {
    const pedido = await this.orderRepository.buscarPorId(this.pedidoId);
    if (!pedido) throw new ApiError(404, 'Pedido no encontrado.');
    if (pedido.estado === 'cancelado') {
      throw new ApiError(400, 'No se puede aplicar descuento a un pedido cancelado.');
    }
    if (this.porcentajeDescuento < 0 || this.porcentajeDescuento > 100) {
      throw new ApiError(400, 'El descuento debe estar entre 0 y 100.');
    }

    this.pedidoHistorial.guardar(this.pedidoId, new PedidoMemento(pedido));

    const subtotal = pedido.productos.reduce(
      (suma, item) => suma + item.cantidad * item.precioUnitario,
      0
    );

    pedido.descuento = this.porcentajeDescuento;
    pedido.total = Number((subtotal * (1 - this.porcentajeDescuento / 100)).toFixed(2));
    return this.orderRepository.guardar(pedido);
  }
}

module.exports = AplicarDescuentoCommand;
