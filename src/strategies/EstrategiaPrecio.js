// PATRON STRATEGY: contrato comun para todas las politicas de precio.
// PricingService no sabe COMO se calcula el precio, solo sabe que puede
// llamar a calcular(producto, contexto) sobre la estrategia activa.
class EstrategiaPrecio {
  calcular(_producto, _contexto) {
    throw new Error('calcular() debe ser implementado por la estrategia concreta.');
  }
}

module.exports = EstrategiaPrecio;
