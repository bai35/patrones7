import Component from '../core/Component.js';

// SRP: este componente solo sabe pintar el header y reaccionar al estado de sesion.
// No sabe como se guarda la sesion ni como se llama al backend: eso se lo delega
// a authService, que recibe por constructor (DIP).
export default class HeaderComponent extends Component {
  constructor(selector, authService) {
    super(selector);
    this.authService = authService;
  }

  async render() {
    return `
      <header class="header">
        <div class="contenedor header-barra">
          <a href="index.html" class="logo"><i class="ti ti-shield-check"></i> Confianza</a>
          <nav class="nav-principal">
            ${this._renderEnlacesNav()}
          </nav>
          <div id="acciones-usuario"></div>
        </div>
      </header>
    `;
  }

  // La clase "activo" ya no se escribe a mano: se calcula comparando el
  // href de cada enlace con la pagina que esta cargada ahora mismo.
  _renderEnlacesNav() {
    const paginaActual = window.location.pathname.split('/').pop() || 'index.html';

    const enlaces = [
      { href: 'index.html', texto: 'Créditos' },
      { href: 'ahorros.html', texto: 'Ahorros' },
      { href: 'seguros.html', texto: 'Seguros' },
      { href: 'catalogo.html', texto: 'Catálogo' },
      { href: 'nosotros.html', texto: 'Nosotros' }
    ];

    return enlaces
      .map(
        (enlace) => `
        <a href="${enlace.href}" class="${enlace.href === paginaActual ? 'activo' : ''}">
          ${enlace.texto}
        </a>
      `
      )
      .join('');
  }

  afterRender() {
    this._pintarAcciones();
  }

  _pintarAcciones() {
    const contenedorAcciones = this.container.querySelector('#acciones-usuario');
    const sesion = this.authService.obtenerSesion();

    if (sesion) {
      const iniciales = (
        (sesion.usuario.nombres?.[0] || '') + (sesion.usuario.apellidos?.[0] || '')
      ).toUpperCase();

      const enlaceAdmin = sesion.usuario.rol === 'admin'
        ? '<a href="admin.html" class="btn btn-outline"><i class="ti ti-settings"></i> Panel admin</a>'
        : '';

      contenedorAcciones.innerHTML = `
        <a href="pedidos.html" class="btn btn-outline"><i class="ti ti-shopping-cart"></i> Mis pedidos</a>
        <a href="perfil.html" class="btn btn-outline"><i class="ti ti-user-circle"></i> Mis datos</a>
        <a href="notificaciones.html" class="btn btn-outline"><i class="ti ti-bell"></i> Notificaciones</a>
        ${enlaceAdmin}
        <div class="usuario-chip">
          <div class="avatar">${iniciales}</div>
          <span>${sesion.usuario.nombres}</span>
        </div>
        <button class="btn btn-outline" id="btn-salir">Cerrar sesión</button>
      `;
      contenedorAcciones
        .querySelector('#btn-salir')
        .addEventListener('click', () => this.authService.cerrarSesion());
    } else {
      contenedorAcciones.innerHTML = `
        <a href="registro.html" class="btn btn-outline"><i class="ti ti-user-plus"></i> Regístrate</a>
        <a href="login.html" class="btn btn-primario"><i class="ti ti-lock"></i> Iniciar sesión</a>
      `;
    }
  }
}
