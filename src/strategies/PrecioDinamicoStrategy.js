const EstrategiaPrecio = require('./EstrategiaPrecio');

// PATRON STRATEGY (ConcreteStrategy): ajusta el precio segun un factor de
// demanda/temporada (ej. 1.15 = +15% en temporada alta, 0.9 = -10% en
// temporada baja). El factor viene de la configuracion (RF9).
class PrecioDinamicoStrategy extends EstrategiaPrecio {
  constructor(factorDemanda) {
    super();
    this.factorDemanda = factorDemanda;
  }

  calcular(producto) {
    return Number((producto.precioBase * this.factorDemanda).toFixed(2));
  }
}

module.exports = PrecioDinamicoStrategy;
