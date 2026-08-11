// PATRON ITERATOR: expone una forma uniforme de recorrer una pagina del
// catalogo (hasNext / next) SIN exponer el arreglo interno de productos.
// Quien consume este iterador nunca hace `catalogo.items[i]` directamente;
// solo llama hasNext()/next(), por lo que la estructura interna (un array,
// podria mañana ser un cursor de Mongo) queda oculta (RF12).
class ProductCatalogIterator {
  constructor(items, meta) {
    this._items = items;
    this._posicion = 0;
    this.meta = meta; // { total, pagina, limite, totalPaginas }
  }

  hasNext() {
    return this._posicion < this._items.length;
  }

  next() {
    if (!this.hasNext()) return null;
    return this._items[this._posicion++];
  }

  reiniciar() {
    this._posicion = 0;
  }
}

module.exports = ProductCatalogIterator;
