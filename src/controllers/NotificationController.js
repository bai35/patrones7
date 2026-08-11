const asyncHandler = require('../utils/asyncHandler');

class NotificationController {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
    this.listarMias = asyncHandler(this.listarMias.bind(this));
  }

  // Cada usuario ve las notificaciones dirigidas a su propio rol
  // (ej. un usuario "compras" ve las de rolDestino = "compras").
  async listarMias(req, res) {
    const notificaciones = await this.notificationRepository.listarPorRol(req.usuario.rol);
    res.json({ notificaciones });
  }
}

module.exports = NotificationController;
