const mongoose = require('mongoose');

// Guarda cada notificacion emitida (ej. stock bajo) para que el rol
// destinatario pueda consultarlas desde el panel.
const notificationSchema = new mongoose.Schema(
  {
    rolDestino: { type: String, required: true },
    mensaje: { type: String, required: true },
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    leida: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
