import Component from '../core/Component.js';
import { mostrarToast } from '../utils/toast.js';

// SRP: solo pinta y gestiona el formulario de "mis datos". La logica de
// como se guarda (PUT /auth/perfil) vive en AuthService (DIP).
export default class PerfilComponent extends Component {
  constructor(selector, authService) {
    super(selector);
    this.authService = authService;
  }

  async render() {
    if (!this.authService.haySesionActiva()) {
      return '<p>Inicia sesión para ver tus datos.</p>';
    }

    try {
      this.usuario = await this.authService.obtenerPerfil();
    } catch (error) {
      return `<p class="mensaje-error" style="display:block;">${error.message}</p>`;
    }

    const u = this.usuario;

    return `
      <div class="tarjeta-auth" style="max-width: 520px;">
        <h1><i class="ti ti-user-circle"></i> Mis datos</h1>
        <p class="panel-descripcion">Consulta y actualiza tu informacion personal.</p>

        <div class="mensaje-error" id="mensaje-error"></div>
        <div class="mensaje-exito" id="mensaje-exito"></div>

        <form id="form-perfil">
          <div class="fila-doble">
            <div class="campo"><label>Nombres</label><input type="text" name="nombres" value="${u.nombres || ''}" required></div>
            <div class="campo"><label>Apellidos</label><input type="text" name="apellidos" value="${u.apellidos || ''}" required></div>
          </div>
          <div class="fila-doble">
            <div class="campo">
              <label>Tipo de documento</label>
              <input type="text" value="${u.tipoDocumento || ''}" disabled>
            </div>
            <div class="campo">
              <label>Número de documento</label>
              <input type="text" value="${u.numeroDocumento || ''}" disabled>
            </div>
          </div>
          <div class="campo"><label>Correo</label><input type="email" name="email" value="${u.email || ''}" required></div>
          <div class="campo"><label>Teléfono</label><input type="tel" name="telefono" value="${u.telefono || ''}"></div>

          <details class="cambiar-password">
            <summary>Cambiar contraseña (opcional)</summary>
            <div class="campo"><label>Contraseña actual</label><input type="password" name="passwordActual"></div>
            <div class="campo"><label>Contraseña nueva</label><input type="password" name="passwordNuevo" minlength="8"></div>
          </details>

          <button type="submit" class="btn btn-coral" style="width:100%; justify-content:center; margin-top: 10px;">
            <i class="ti ti-device-floppy"></i> Guardar cambios
          </button>
        </form>
      </div>
    `;
  }

  afterRender() {
    this.container
      .querySelector('#form-perfil')
      ?.addEventListener('submit', (evento) => this._guardar(evento));
  }

  async _guardar(evento) {
    evento.preventDefault();
    const mensajeError = this.container.querySelector('#mensaje-error');
    const mensajeExito = this.container.querySelector('#mensaje-exito');
    mensajeError.style.display = 'none';
    mensajeExito.style.display = 'none';

    const datos = Object.fromEntries(new FormData(evento.target).entries());
    if (!datos.passwordNuevo) {
      delete datos.passwordNuevo;
      delete datos.passwordActual;
    }

    try {
      await this.authService.actualizarPerfil(datos);
      mostrarToast('Datos actualizados correctamente.', 'exito');
      await this.mount();
    } catch (error) {
      mensajeError.textContent = error.message;
      mensajeError.style.display = 'block';
    }
  }
}
