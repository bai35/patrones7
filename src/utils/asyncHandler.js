// Pure Fabrication: evita repetir try/catch en cada controlador (DRY),
// delegando cualquier error al middleware centralizado de errores.
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = asyncHandler;
