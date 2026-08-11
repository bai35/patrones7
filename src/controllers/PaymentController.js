const asyncHandler = require('../utils/asyncHandler');

class PaymentController {
  constructor(paymentService) {
    this.paymentService = paymentService;
    this.listarPasarelas = asyncHandler(this.listarPasarelas.bind(this));
    this.cambiarEstado = asyncHandler(this.cambiarEstado.bind(this));
    this.procesarPago = asyncHandler(this.procesarPago.bind(this));
  }

  async listarPasarelas(req, res) {
    const pasarelas = await this.paymentService.listarPasarelas();
    res.json({ pasarelas });
  }

  // RF2: panel de configuracion del administrador.
  async cambiarEstado(req, res) {
    const { nombre } = req.params;
    const { habilitada } = req.body;
    const pasarela = await this.paymentService.cambiarEstado(nombre, Boolean(habilitada));
    res.json({ mensaje: 'Pasarela actualizada.', pasarela });
  }

  async procesarPago(req, res) {
    const { pasarela, monto, datos } = req.body;
    const resultado = await this.paymentService.procesarPago(pasarela, monto, datos);
    res.status(resultado.exito ? 200 : 400).json(resultado);
  }
}

module.exports = PaymentController;
