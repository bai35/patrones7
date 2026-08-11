const EstrategiaPrecio = require('./EstrategiaPrecio');

// PATRON STRATEGY (ConcreteStrategy): aplica un descuento porcentual fijo,
// definido en la configuracion de precios (RF9/RF10).
class PrecioDescuentoPorcentualStrategy extends EstrategiaPrecio {
  constructor(porcentajeDescuento) {
    super();
    this.porcentajeDescuento = porcentajeDescuento;
  }

  calcular(producto) {
    const factor = 1 - this.porcentajeDescuento / 100;
    return Number((producto.precioBase * factor).toFixed(2));
  }
}

module.exports = PrecioDescuentoPorcentualStrategy;
