const Observer = require('./Observer');

// PATRON OBSERVER (ConcreteObserver): cada instancia esta "suscrita" en
// nombre de un rol (Gerente, Compras, ...). Cuando el Subject notifica un
// evento de stock bajo, este observador guarda la notificacion para ese rol.
class RolNotificationObserver extends Observer {
  constructor(rol, notificationRepository) {
    super();
    this.rol = rol;
    this.notificationRepository = notificationRepository;
  }

  async actualizar(evento) {
    // evento: { producto }
    await this.notificationRepository.crear({
      rolDestino: this.rol,
      producto: evento.producto._id,
      mensaje: `Stock bajo: "${evento.producto.nombre}" tiene ${evento.producto.stockActual} unidades ` +
        `(minimo configurado: ${evento.producto.stockMinimo}).`
    });
  }
}

module.exports = RolNotificationObserver;
