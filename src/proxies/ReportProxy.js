const ApiError = require('../utils/ApiError');

// PATRON PROXY (protection proxy): expone EXACTAMENTE la misma interfaz que
// ReportService (obtenerReporteCompleto), pero antes de delegar valida que
// el usuario tenga uno de los roles autorizados. El controlador nunca habla
// con ReportService directamente, siempre con este Proxy (RF3, RF4).
const ROLES_AUTORIZADOS = ['gerente', 'contador'];

class ReportProxy {
  constructor(reportService) {
    this.reportService = reportService;
  }

  async obtenerReporteCompleto(usuario) {
    if (!usuario || !ROLES_AUTORIZADOS.includes(usuario.rol)) {
      throw new ApiError(403, 'Solo Gerencia o Contabilidad pueden acceder a los reportes completos.');
    }
    // Recien aqui se delega al objeto real.
    return this.reportService.obtenerReporteCompleto();
  }
}

module.exports = ReportProxy;
