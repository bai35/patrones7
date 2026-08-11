const Product = require('../models/Product');

class ProductRepository {
  async listar(categoria) {
    const filtro = categoria ? { categoria } : {};
    return Product.find(filtro).sort({ nombre: 1 });
  }

  async crear(datos) {
    return Product.create(datos);
  }

  async eliminarTodos() {
    return Product.deleteMany({});
  }

  async insertarVarios(items) {
    return Product.insertMany(items);
  }

  async buscarPorId(id) {
    return Product.findById(id);
  }

  async actualizarStock(id, stockActual) {
    return Product.findByIdAndUpdate(id, { stockActual }, { new: true });
  }

  // Usado por el Iterator (RF11/RF12): aplica filtros + paginacion a nivel
  // de base de datos y devuelve tambien el total para calcular paginas.
  async listarPaginado({ categoria, busqueda, pagina, limite }) {
    const filtro = {};
    if (categoria) filtro.categoria = categoria;
    if (busqueda) filtro.nombre = { $regex: busqueda, $options: 'i' };

    const total = await Product.countDocuments(filtro);
    const items = await Product.find(filtro)
      .sort({ nombre: 1 })
      .skip((pagina - 1) * limite)
      .limit(limite);

    return { items, total };
  }
}

module.exports = ProductRepository;
