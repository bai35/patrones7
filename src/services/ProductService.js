const ApiError = require('../utils/ApiError');
const ProductCatalogIterator = require('../iterators/ProductCatalogIterator');

class ProductService {
  // inventoryNotifier es opcional para no romper a quien siga instanciando
  // ProductService solo con el repositorio (compatibilidad hacia atras).
  constructor(productRepository, inventoryNotifier = null) {
    this.productRepository = productRepository;
    this.inventoryNotifier = inventoryNotifier;
  }

  async listar(categoria) {
    return this.productRepository.listar(categoria);
  }

  async crear(datos) {
    return this.productRepository.crear(datos);
  }

  // RF11/RF12: entrega un Iterator ya armado con paginacion + filtros,
  // sin que el controlador tenga que conocer el arreglo interno.
  async obtenerIteradorCatalogo({ categoria, busqueda, pagina = 1, limite = 5 }) {
    const paginaNum = Math.max(1, Number(pagina));
    const limiteNum = Math.max(1, Number(limite));

    const { items, total } = await this.productRepository.listarPaginado({
      categoria,
      busqueda,
      pagina: paginaNum,
      limite: limiteNum
    });

    return new ProductCatalogIterator(items, {
      total,
      pagina: paginaNum,
      limite: limiteNum,
      totalPaginas: Math.max(1, Math.ceil(total / limiteNum))
    });
  }

  // RF5/RF6: actualiza el stock y, si cae por debajo del minimo configurado
  // para ese producto, notifica a los observadores suscritos (Gerente/Compras).
  async actualizarStock(id, stockActual) {
    const producto = await this.productRepository.buscarPorId(id);
    if (!producto) {
      throw new ApiError(404, 'Producto no encontrado.');
    }

    const actualizado = await this.productRepository.actualizarStock(id, stockActual);

    if (this.inventoryNotifier && actualizado.stockActual < actualizado.stockMinimo) {
      await this.inventoryNotifier.notificarStockBajo(actualizado);
    }

    return actualizado;
  }
}

module.exports = ProductService;
