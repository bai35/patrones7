const Command = require('./Command');
const ApiError = require('../utils/ApiError');

// PATRON COMMAND (ConcreteCommand): encapsula la creacion de un pedido.
class CrearPedidoCommand extends Command {
  constructor(orderRepository, { usuarioId, productos }) {
    super();
    this.orderRepository = orderRepository;
    this.usuarioId = usuarioId;
    this.productos = productos;
  }

  async ejecutar() {
    if (!Array.isArray(this.productos) || this.productos.length === 0) {
      throw new ApiError(400, 'El pedido debe tener al menos un producto.');
    }

    const total = this.productos.reduce(
      (suma, item) => suma + item.cantidad * item.precioUnitario,
      0
    );

    return this.orderRepository.crear({
      usuario: this.usuarioId,
      productos: this.productos,
      estado: 'creado',
      total
    });
  }
}

module.exports = CrearPedidoCommand;
