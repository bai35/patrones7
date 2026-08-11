const PricingConfig = require('../models/PricingConfig');

class PricingConfigRepository {
  // Devuelve la configuracion global; si no existe, la crea con valores
  // por defecto (evita tener que correr un seed aparte).
  async obtener() {
    let config = await PricingConfig.findOne();
    if (!config) {
      config = await PricingConfig.create({});
    }
    return config;
  }

  async actualizar(datos) {
    const config = await this.obtener();
    Object.assign(config, datos);
    return config.save();
  }
}

module.exports = PricingConfigRepository;
