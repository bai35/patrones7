const mongoose = require('mongoose');

// RF10: el administrador selecciona/cambia la estrategia activa. Se maneja
// como un unico documento de configuracion global.
const pricingConfigSchema = new mongoose.Schema({
  estrategia: {
    type: String,
    enum: ['estandar', 'descuento_porcentual', 'dinamico'],
    default: 'estandar'
  },
  porcentajeDescuento: { type: Number, default: 10 },
  factorDemanda: { type: Number, default: 1 }
});

module.exports = mongoose.model('PricingConfig', pricingConfigSchema);
