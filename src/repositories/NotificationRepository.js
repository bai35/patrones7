const Notification = require('../models/Notification');

class NotificationRepository {
  async crear(datos) {
    return Notification.create(datos);
  }

  async listarPorRol(rol) {
    return Notification.find({ rolDestino: rol }).sort({ createdAt: -1 });
  }
}

module.exports = NotificationRepository;
