import Component from '../core/Component.js';

// SRP: solo pinta las notificaciones que le pertenecen al rol del usuario
// logueado. Quien decide que notificaciones existen es el backend
// (InventoryNotifier + RolNotificationObserver), este componente solo lista.
export default class NotificationListComponent extends Component {
  constructor(selector, notificationService, authService) {
    super(selector);
    this.notificationService = notificationService;
    this.authService = authService;
  }

  async render() {
    const sesion = this.authService.obtenerSesion();
    if (!sesion) {
      return '<p>Inicia sesión para ver tus notificaciones.</p>';
    }

    try {
      const notificaciones = await this.notificationService.listar(sesion.token);
      if (!notificaciones.length) {
        return '<p>No tienes notificaciones por ahora.</p>';
      }

      return `
        <div class="lista-notificaciones">
          ${notificaciones
            .map(
              (n) => `
            <div class="notificacion-card">
              <i class="ti ti-alert-triangle"></i>
              <div>
                <p>${n.mensaje}</p>
                <span class="notificacion-fecha">${new Date(n.createdAt).toLocaleString('es-PE')}</span>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      `;
    } catch (error) {
      return `<p class="mensaje-error" style="display:block;">${error.message}</p>`;
    }
  }
}
