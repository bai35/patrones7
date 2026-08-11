import Component from '../core/Component.js';

// SRP: solo sabe pintar una pagina del catalogo y sus controles de
// paginacion/filtro. No sabe como el backend recorre la coleccion
// internamente (el Iterator vive en el servidor); aqui solo se consume
// la pagina ya armada (RF11/RF12: paginacion + filtros sin exponer la
// estructura interna de la coleccion).
export default class CatalogComponent extends Component {
  constructor(selector, apiClient) {
    super(selector);
    this.apiClient = apiClient;
    this.pagina = 1;
    this.limite = 5;
    this.categoria = '';
    this.busqueda = '';
  }

  async render() {
    const datos = await this._cargarPagina();
    this.productos = datos.productos;
    this.meta = datos.meta;

    return `
      <div class="panel">
        <h2 class="panel-titulo"><i class="ti ti-list"></i> Catálogo de productos (Iterator)</h2>
        <div class="catalogo-filtros">
          <select id="filtro-categoria">
            <option value="">Todas las categorías</option>
            <option value="credito" ${this.categoria === 'credito' ? 'selected' : ''}>Créditos</option>
            <option value="ahorro" ${this.categoria === 'ahorro' ? 'selected' : ''}>Ahorros</option>
            <option value="seguro" ${this.categoria === 'seguro' ? 'selected' : ''}>Seguros</option>
          </select>
          <input type="text" id="filtro-busqueda" placeholder="Buscar por nombre..." value="${this.busqueda}">
        </div>

        <div class="grid-productos" id="catalogo-grid">
          ${this._renderProductos()}
        </div>

        <div class="paginacion">
          <button class="btn btn-outline-oscuro" id="btn-anterior" ${this.meta.pagina <= 1 ? 'disabled' : ''}>« Anterior</button>
          <span>Página ${this.meta.pagina} de ${this.meta.totalPaginas} (${this.meta.total} productos)</span>
          <button class="btn btn-outline-oscuro" id="btn-siguiente" ${this.meta.pagina >= this.meta.totalPaginas ? 'disabled' : ''}>Siguiente »</button>
        </div>
      </div>
    `;
  }

  _renderProductos() {
    if (!this.productos.length) return '<p>No se encontraron productos con esos filtros.</p>';
    return this.productos
      .map(
        (p) => `
      <div class="producto-card">
        <i class="ti ${p.icono}"></i>
        <h3>${p.nombre}</h3>
        <p>${p.descripcionCorta}</p>
        <p><strong>S/ ${Number(p.precioBase).toFixed(2)}</strong></p>
      </div>
    `
      )
      .join('');
  }

  async _cargarPagina() {
    const parametros = new URLSearchParams({
      pagina: this.pagina,
      limite: this.limite
    });
    if (this.categoria) parametros.set('categoria', this.categoria);
    if (this.busqueda) parametros.set('busqueda', this.busqueda);

    return this.apiClient.get(`/productos/catalogo?${parametros.toString()}`);
  }

  afterRender() {
    this.container.querySelector('#filtro-categoria').addEventListener('change', (evento) => {
      this.categoria = evento.target.value;
      this.pagina = 1;
      this.mount();
    });

    this.container.querySelector('#filtro-busqueda').addEventListener('input', (evento) => {
      clearTimeout(this._debounce);
      this._debounce = setTimeout(() => {
        this.busqueda = evento.target.value;
        this.pagina = 1;
        this.mount();
      }, 350);
    });

    const btnAnterior = this.container.querySelector('#btn-anterior');
    const btnSiguiente = this.container.querySelector('#btn-siguiente');

    btnAnterior?.addEventListener('click', () => {
      if (this.meta.pagina > 1) {
        this.pagina = this.meta.pagina - 1;
        this.mount();
      }
    });

    btnSiguiente?.addEventListener('click', () => {
      if (this.meta.pagina < this.meta.totalPaginas) {
        this.pagina = this.meta.pagina + 1;
        this.mount();
      }
    });
  }
}
