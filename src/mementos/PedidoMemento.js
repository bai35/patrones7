// PATRON MEMENTO: guarda una "fotografia" del estado del pedido (Originator)
// en un momento dado, sin exponer los detalles internos de como se restaura.
// Es inmutable: una vez creado, sus datos no deberian modificarse.
class PedidoMemento {
  constructor(estadoPedido) {
    this._estado = {
      estado: estadoPedido.estado,
      productos: JSON.parse(JSON.stringify(estadoPedido.productos)),
      descuento: estadoPedido.descuento,
      total: estadoPedido.total
    };
    this.fecha = new Date();
  }

  // Solo el "caretaker" (PedidoHistorial) y el propio Originator (Order)
  // deberian llamar a esto para restaurar el estado.
  obtenerEstado() {
    return this._estado;
  }
}

module.exports = PedidoMemento;
