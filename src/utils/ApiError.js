// Pure Fabrication: encapsula el concepto de "error de negocio con codigo HTTP",
// que no pertenece al dominio pero permite manejar errores de forma consistente.
class ApiError extends Error {
  constructor(statusCode, mensaje) {
    super(mensaje);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

module.exports = ApiError;
