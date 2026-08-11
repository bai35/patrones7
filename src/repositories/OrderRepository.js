const Order = require('../models/Order');

class OrderRepository {
  async crear(datos) {
    return Order.create(datos);
  }

  async buscarPorId(id) {
    return Order.findById(id);
  }

  async guardar(pedido) {
    return pedido.save();
  }

  async listarTodos() {
    return Order.find();
  }

  async listarPorUsuario(usuarioId) {
    return Order.find({ usuario: usuarioId })
      .sort({ createdAt: -1 })
      .populate('productos.producto', 'nombre icono');
  }
}

module.exports = OrderRepository;
