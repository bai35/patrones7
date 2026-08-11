const asyncHandler = require('../utils/asyncHandler');

class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
    this.crear = asyncHandler(this.crear.bind(this));
    this.procesar = asyncHandler(this.procesar.bind(this));
    this.aplicarDescuento = asyncHandler(this.aplicarDescuento.bind(this));
    this.cancelar = asyncHandler(this.cancelar.bind(this));
    this.revertir = asyncHandler(this.revertir.bind(this));
    this.obtener = asyncHandler(this.obtener.bind(this));
    this.listarMios = asyncHandler(this.listarMios.bind(this));
    this.historialComandos = asyncHandler(this.historialComandos.bind(this));
    this.historialEstados = asyncHandler(this.historialEstados.bind(this));
  }

  async crear(req, res) {
    const pedido = await this.orderService.crearPedido(req.usuario.id, req.body.productos);
    res.status(201).json({ mensaje: 'Pedido creado.', pedido });
  }

  async procesar(req, res) {
    const pedido = await this.orderService.procesarPedido(req.params.id);
    res.json({ mensaje: 'Pedido procesado.', pedido });
  }

  async aplicarDescuento(req, res) {
    const pedido = await this.orderService.aplicarDescuento(req.params.id, req.body.porcentaje);
    res.json({ mensaje: 'Descuento aplicado.', pedido });
  }

  async cancelar(req, res) {
    const pedido = await this.orderService.cancelarPedido(req.params.id);
    res.json({ mensaje: 'Pedido cancelado.', pedido });
  }

  // RF8: revierte el pedido a su estado anterior usando el Memento guardado.
  async revertir(req, res) {
    const pedido = await this.orderService.revertirPedido(req.params.id);
    res.json({ mensaje: 'Pedido revertido al estado anterior.', pedido });
  }

  async obtener(req, res) {
    const pedido = await this.orderService.obtenerPedido(req.params.id);
    res.json({ pedido });
  }

  async listarMios(req, res) {
    const pedidos = await this.orderService.listarPedidosUsuario(req.usuario.id);
    res.json({ pedidos });
  }

  // RF7: expone el historial de comandos ejecutados.
  async historialComandos(req, res) {
    res.json({ historial: this.orderService.obtenerHistorialComandos() });
  }

  async historialEstados(req, res) {
    const historial = await this.orderService.obtenerHistorialEstados(req.params.id);
    res.json({ historial });
  }
}

module.exports = OrderController;
