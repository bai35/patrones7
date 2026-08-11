const EstrategiaPrecio = require('./EstrategiaPrecio');

// PATRON STRATEGY (ConcreteStrategy): el precio es simplemente el precio
// base del producto, sin ningun ajuste.
class PrecioEstandarStrategy extends EstrategiaPrecio {
  calcular(producto) {
    return Number(producto.precioBase.toFixed(2));
  }
}

module.exports = PrecioEstandarStrategy;
