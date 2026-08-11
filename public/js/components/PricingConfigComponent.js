import Component from '../core/Component.js';

// SRP: solo pinta el formulario de configuracion de precios y delega el
// calculo/guardado a PricingService. No sabe como se calcula cada estrategia.
export default class PricingConfigComponent extends Component {
  constructor(selector, pricingService, authService) {
    super(selector);
    this.pricingService = pricingService;
    this.authService = authService;
  }

  async render() {
    try {
      this.config = await this.pricingService.obtenerConfiguracion();
    } catch (error) {
      return `<p class="mensaje-error" style="display:block;">${error.message}</p>`;
    }

    return `
      <div class="panel">
        <h2 class="panel-titulo"><i class="ti ti-tags"></i> Política de precios (Strategy)</h2>
        <p class="panel-descripcion">Elige la estrategia activa para calcular el precio final de los productos.</p>
        <div class="mensaje-error" id="mensaje-precios"></div>
        <form id="form-precios">
          <div class="campo">
            <label>Estrategia</label>
            <select name="estrategia" id="select-estrategia">
              <option value="estandar" ${this.config.estrategia === 'estandar' ? 'selected' : ''}>Precio estándar</option>
              <option value="descuento_porcentual" ${this.config.estrategia === 'descuento_porcentual' ? 'selected' : ''}>Descuento porcentual</option>
              <option value="dinamico" ${this.config.estrategia === 'dinamico' ? 'selected' : ''}>Precio dinámico (demanda/temporada)</option>
            </select>
          </div>

          <div class="campo" id="campo-descuento" style="${this.config.estrategia === 'descuento_porcentual' ? '' : 'display:none;'}">
            <label>Porcentaje de descuento (%)</label>
            <input type="number" name="porcentajeDescuento" min="0" max="100" value="${this.config.porcentajeDescuento}">
          </div>

          <div class="campo" id="campo-factor" style="${this.config.estrategia === 'dinamico' ? '' : 'display:none;'}">
            <label>Factor de demanda (ej. 1.15 = +15%, 0.9 = -10%)</label>
            <input type="number" step="0.01" name="factorDemanda" value="${this.config.factorDemanda}">
          </div>

          <button type="submit" class="btn btn-coral">Guardar configuración</button>
        </form>
      </div>
    `;
  }

  afterRender() {
    const select = this.container.querySelector('#select-estrategia');
    select.addEventListener('change', () => this._mostrarCamposSegunEstrategia(select.value));

    this.container
      .querySelector('#form-precios')
      .addEventListener('submit', (evento) => this._guardar(evento));
  }

  _mostrarCamposSegunEstrategia(estrategia) {
    this.container.querySelector('#campo-descuento').style.display =
      estrategia === 'descuento_porcentual' ? '' : 'none';
    this.container.querySelector('#campo-factor').style.display =
      estrategia === 'dinamico' ? '' : 'none';
  }

  async _guardar(evento) {
    evento.preventDefault();
    const mensajeError = this.container.querySelector('#mensaje-precios');
    mensajeError.style.display = 'none';

    const datosForm = Object.fromEntries(new FormData(evento.target).entries());
    const datos = {
      estrategia: datosForm.estrategia,
      porcentajeDescuento: Number(datosForm.porcentajeDescuento || 0),
      factorDemanda: Number(datosForm.factorDemanda || 1)
    };

    const sesion = this.authService.obtenerSesion();
    try {
      await this.pricingService.cambiarEstrategia(datos, sesion?.token);
      await this.mount();
    } catch (error) {
      mensajeError.textContent = error.message;
      mensajeError.style.display = 'block';
    }
  }
}
