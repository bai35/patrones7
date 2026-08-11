const mongoose = require('mongoose');

// RF2: el administrador habilita/deshabilita cada pasarela desde un panel
// de configuracion. Este modelo guarda ese estado.
const paymentGatewayConfigSchema = new mongoose.Schema(
  {
    nombre: { type: String, enum: ['paypal', 'yape', 'plin', 'tarjeta'], required: true, unique: true },
    habilitada: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PaymentGatewayConfig', paymentGatewayConfigSchema);
