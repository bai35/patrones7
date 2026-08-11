import Component from '../core/Component.js';

// SRP: solo sabe transformar una lista de productos en HTML.
// No sabe de donde vienen los productos (eso es responsabilidad de ProductService).
export default class ProductListComponent extends Component {
  constructor(selector, productService, categoria = null) {
    super(selector);
    this.productService = productService;
    this.categoria = categoria;
  }

  async render() {
    try {
      const productos = await this.productService.listar(this.categoria);
      if (!productos.length) return '<p>No hay productos disponibles.</p>';

      return productos
        .map(
          (p) => `
          <div class="producto-card">
            <i class="ti ${p.icono}"></i>
            <h3>${p.nombre}</h3>
            <p>${p.descripcionCorta}</p>
          </div>
        `
        )
        .join('');
    } catch (error) {
      return `<p>${error.message}</p>`;
    }
  }
}
