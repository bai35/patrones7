const ApiError = require('../utils/ApiError');
const CrearPedidoCommand = require('../commands/CrearPedidoCommand');
const ProcesarPedidoCommand = require('../commands/ProcesarPedidoCommand');
const AplicarDescuentoCommand = require('../commands/AplicarDescuentoCommand');
const CancelarPedidoCommand = require('../commands/CancelarPedidoCommand');

// PATRON COMMAND (Invoker): no sabe como se crea/procesa/cancela un pedido,
// solo sabe ejecutar comandos y guardarlos en un historial (RF7). Cada
// metodo publico simplemente arma el Command correspondiente y lo ejecuta.
class OrderService {
  constructor(orderRepository, pedidoHistorial) {
    this.orderRepository = orderRepository;
    this.pedidoHistorial = pedidoHistorial;
    this.historialComandos = []; // RF7: registro de acciones ejecutadas
  }

  async _ejecutar(comando, descripcion) {
    const resultado = await comando.ejecutar();
    this.historialComandos.push({ descripcion, fecha: new Date() });
    return resultado;
  }

  async crearPedido(usuarioId, productos) {
    const comando = new CrearPedidoCommand(this.orderRepository, { usuarioId, productos });
    return this._ejecutar(comando, 'Crear pedido');
  }

  async procesarPedido(pedidoId) {
    const comando = new ProcesarPedidoCommand(this.orderRepository, this.pedidoHistorial, pedidoId);
    return this._ejecutar(comando, `Procesar pedido ${pedidoId}`);
  }

  async aplicarDescuento(pedidoId, porcentajeDescuento) {
    const comando = new AplicarDescuentoCommand(
      this.orderRepository,
      this.pedidoHistorial,
      pedidoId,
      porcentajeDescuento
    );
    return this._ejecutar(comando, `Aplicar ${porcentajeDescuento}% de descuento al pedido ${pedidoId}`);
  }

  async cancelarPedido(pedidoId) {
    const comando = new CancelarPedidoCommand(this.orderRepository, this.pedidoHistorial, pedidoId);
    return this._ejecutar(comando, `Cancelar pedido ${pedidoId}`);
  }

  // PATRON MEMENTO en accion (RF8): el Originator (pedido) recupera un
  // snapshot anterior desde el Caretaker (pedidoHistorial) y restaura
  // sus propios campos con lo que dice el memento.
  async revertirPedido(pedidoId) {
    const memento = this.pedidoHistorial.restaurarUltimo(pedidoId);
    if (!memento) {
      throw new ApiError(400, 'Este pedido no tiene un estado anterior al cual revertir.');
    }

    const pedido = await this.orderRepository.buscarPorId(pedidoId);
    if (!pedido) throw new ApiError(404, 'Pedido no encontrado.');

    const estadoAnterior = memento.obtenerEstado();
    pedido.estado = estadoAnterior.estado;
    pedido.productos = estadoAnterior.productos;
    pedido.descuento = estadoAnterior.descuento;
    pedido.total = estadoAnterior.total;

    await this.orderRepository.guardar(pedido);
    this.historialComandos.push({ descripcion: `Revertir pedido ${pedidoId}`, fecha: new Date() });
    return pedido;
  }

  obtenerHistorialComandos() {
    return this.historialComandos;
  }

  async obtenerHistorialEstados(pedidoId) {
    return this.pedidoHistorial.listar(pedidoId);
  }

  async obtenerPedido(pedidoId) {
    const pedido = await this.orderRepository.buscarPorId(pedidoId);
    if (!pedido) throw new ApiError(404, 'Pedido no encontrado.');
    return pedido;
  }

  async listarPedidosUsuario(usuarioId) {
    return this.orderRepository.listarPorUsuario(usuarioId);
  }
}

module.exports = OrderService;
