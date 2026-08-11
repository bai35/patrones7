import Component from '../core/Component.js';

export default class RegisterFormComponent extends Component {
  constructor(selector, authService) {
    super(selector);
    this.authService = authService;
  }

  async render() {
    return `
      <div class="tarjeta-auth" style="max-width: 460px;">
        <h1>Crea tu cuenta</h1>
        <div class="mensaje-error" id="mensaje-error"></div>
        <form id="form-registro">
          <div class="fila-doble">
            <div class="campo"><label>Nombres</label><input type="text" name="nombres" required></div>
            <div class="campo"><label>Apellidos</label><input type="text" name="apellidos" required></div>
          </div>
          <div class="fila-doble">
            <div class="campo">
              <label>Tipo de documento</label>
              <select name="tipoDocumento">
                <option value="DNI">DNI</option>
                <option value="CE">Carné de extranjería</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
            </div>
            <div class="campo"><label>Número de documento</label><input type="text" name="numeroDocumento" required></div>
          </div>
          <div class="campo"><label>Correo</label><input type="email" name="email" required></div>
          <div class="campo"><label>Teléfono</label><input type="tel" name="telefono"></div>
          <div class="campo"><label>Contraseña</label><input type="password" name="password" minlength="8" required></div>
          <button type="submit" class="btn btn-coral" style="width:100%; justify-content:center;">
            <i class="ti ti-user-plus"></i> Crear cuenta
          </button>
        </form>
        <p class="enlace-secundario">¿Ya tienes cuenta? <a href="login.html">Inicia sesión</a></p>
      </div>
    `;
  }

  afterRender() {
    this.container
      .querySelector('#form-registro')
      .addEventListener('submit', (evento) => this._manejarEnvio(evento));
  }

  async _manejarEnvio(evento) {
    evento.preventDefault();
    const mensajeError = this.container.querySelector('#mensaje-error');
    mensajeError.style.display = 'none';

    const datos = Object.fromEntries(new FormData(evento.target).entries());

    try {
      await this.authService.registrar(datos);
      window.location.href = 'index.html';
    } catch (error) {
      mensajeError.textContent = error.message;
      mensajeError.style.display = 'block';
    }
  }
}
