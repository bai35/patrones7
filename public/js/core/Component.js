// Pure Fabrication: no representa un concepto del negocio, existe solo para que
// todos los componentes compartan el mismo contrato (render -> mount -> afterRender).
// Esto es tambien el patron "Template Method": la clase base define el flujo fijo
// (mount llama a render y luego a afterRender) y cada subclase solo implementa render().
export default class Component {
  constructor(selector) {
    this.container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this.container) {
      throw new Error(`No se encontro el contenedor "${selector}" en el DOM.`);
    }
  }

  // Metodo que cada componente hijo debe sobreescribir (Liskov: cualquier
  // subclase de Component puede usarse donde se espera un Component).
  async render() {
    throw new Error('render() debe ser implementado por la clase hija.');
  }

  // Hook opcional para adjuntar eventos despues de pintar el HTML.
  afterRender() {}

  async mount() {
    this.container.innerHTML = await this.render();
    this.afterRender();
    return this;
  }
}
