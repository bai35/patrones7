import Component from '../core/Component.js';

// SRP: solo sabe pintar el formulario y leer/mostrar sus propios mensajes de error.
// La decision de si las credenciales son validas la toma AuthService, no este componente.
export default class LoginFormComponent extends Component {
  constructor(selector, authService) {
    super(selector);
    this.authService = authService;
  }

  async render() {
    return `
      <div class="tarjeta-auth">
        <h1>Inicia sesión</h1>
        <div class="mensaje-error" id="mensaje-error"></div>
        <form id="form-login">
          <div class="campo">
            <label>Correo</label>
            <input type="email" name="email" required>
          </div>
          <div class="campo">
            <label>Contraseña</label>
            <input type="password" name="password" required>
          </div>
          <button type="submit" class="btn btn-coral" style="width:100%; justify-content:center;">
            <i class="ti ti-lock"></i> Iniciar sesión
          </button>
        </form>
        <p class="enlace-secundario">¿No tienes cuenta? <a href="registro.html">Regístrate</a></p>
      </div>
    `;
  }

  afterRender() {
    this.container
      .querySelector('#form-login')
      .addEventListener('submit', (evento) => this._manejarEnvio(evento));
  }

  async _manejarEnvio(evento) {
    evento.preventDefault();
    const mensajeError = this.container.querySelector('#mensaje-error');
    mensajeError.style.display = 'none';

    const datos = Object.fromEntries(new FormData(evento.target).entries());

    try {
      await this.authService.iniciarSesion(datos);
      window.location.href = 'index.html';
    } catch (error) {
      mensajeError.textContent = error.message;
      mensajeError.style.display = 'block';
    }
  }
}
