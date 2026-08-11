const asyncHandler = require('../utils/asyncHandler');

class ReportController {
  // Recibe el Proxy, no el ReportService real: para este controlador ambos
  // se ven identicos porque comparten la misma interfaz (Liskov).
  constructor(reportProxy) {
    this.reportProxy = reportProxy;
    this.obtenerReporteCompleto = asyncHandler(this.obtenerReporteCompleto.bind(this));
  }

  async obtenerReporteCompleto(req, res) {
    const reporte = await this.reportProxy.obtenerReporteCompleto(req.usuario);
    res.json({ reporte });
  }
}

module.exports = ReportController;
