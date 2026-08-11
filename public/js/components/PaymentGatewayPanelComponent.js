import Component from '../core/Component.js';

// SRP: solo sabe pintar la lista de pasarelas y reaccionar a los clics de
// habilitar/deshabilitar. La decision de negocio (guardar el estado) vive
// en PaymentGatewayService (DIP).
export default class PaymentGatewayPanelComponent extends Component {
  constructor(selector, paymentGatewayService, authService) {
    super(selector);
    this.paymentGatewayService = paymentGatewayService;
    this.authService = authService;
  }

  async render() {
    try {
      this.pasarelas = await this.paymentGatewayService.listar();
    } catch (error) {
      return `<p class="mensaje-error" style="display:block;">${error.message}</p>`;
    }

    const etiquetas = { paypal: 'PayPal', yape: 'Yape', plin: 'Plin', tarjeta: 'Tarjeta (BCP / Interbank)' };

    return `
      <div class="panel">
        <h2 class="panel-titulo"><i class="ti ti-credit-card"></i> Pasarelas de pago (Adapter)</h2>
        <p class="panel-descripcion">Habilita o deshabilita cada pasarela. El cambio se aplica de inmediato.</p>
        <table class="tabla">
          <thead><tr><th>Pasarela</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            ${this.pasarelas
              .map(
                (p) => `
              <tr data-nombre="${p.nombre}">
                <td><span class="chip-pasarela chip-${p.nombre}">${etiquetas[p.nombre] || p.nombre}</span></td>
                <td><span class="badge ${p.habilitada ? 'badge-activo' : 'badge-inactivo'}">${p.habilitada ? 'Habilitada' : 'Deshabilitada'}</span></td>
                <td>
                  <button class="btn btn-outline-oscuro btn-toggle" data-nombre="${p.nombre}" data-habilitada="${p.habilitada}">
                    ${p.habilitada ? 'Deshabilitar' : 'Habilitar'}
                  </button>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <div class="mensaje-error" id="mensaje-pasarelas"></div>
      </div>
    `;
  }

  afterRender() {
    this.container.querySelectorAll('.btn-toggle').forEach((boton) => {
      boton.addEventListener('click', () => this._alternarEstado(boton));
    });
  }

  async _alternarEstado(boton) {
    const mensajeError = this.container.querySelector('#mensaje-pasarelas');
    mensajeError.style.display = 'none';

    const nombre = boton.dataset.nombre;
    const habilitadaActual = boton.dataset.habilitada === 'true';
    const sesion = this.authService.obtenerSesion();

    try {
      await this.paymentGatewayService.cambiarEstado(nombre, !habilitadaActual, sesion?.token);
      await this.mount();
    } catch (error) {
      mensajeError.textContent = error.message;
      mensajeError.style.display = 'block';
    }
  }
}
