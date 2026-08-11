const asyncHandler = require('../utils/asyncHandler');

class ProductController {
  constructor(productService) {
    this.productService = productService;
    this.listar = asyncHandler(this.listar.bind(this));
    this.crear = asyncHandler(this.crear.bind(this));
    this.listarCatalogo = asyncHandler(this.listarCatalogo.bind(this));
    this.actualizarStock = asyncHandler(this.actualizarStock.bind(this));
  }

  async listar(req, res) {
    const productos = await this.productService.listar(req.query.categoria);
    res.json({ productos });
  }

  async crear(req, res) {
    const producto = await this.productService.crear(req.body);
    res.status(201).json({ mensaje: 'Producto creado.', producto });
  }

  // RF11/RF12: recorre el Iterator y arma la respuesta, sin exponer nunca
  // la estructura interna del catalogo al cliente HTTP.
  async listarCatalogo(req, res) {
    const { categoria, busqueda, pagina, limite } = req.query;
    const iterador = await this.productService.obtenerIteradorCatalogo({
      categoria, busqueda, pagina, limite
    });

    const items = [];
    while (iterador.hasNext()) {
      items.push(iterador.next());
    }

    res.json({ productos: items, meta: iterador.meta });
  }

  async actualizarStock(req, res) {
    const producto = await this.productService.actualizarStock(req.params.id, req.body.stockActual);
    res.json({ mensaje: 'Stock actualizado.', producto });
  }
}

module.exports = ProductController;
