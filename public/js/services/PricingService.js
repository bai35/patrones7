export default class PricingService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async obtenerConfiguracion() {
    const { configuracion } = await this.apiClient.get('/precios/configuracion');
    return configuracion;
  }

  async cambiarEstrategia(datos, token) {
    const { configuracion } = await this.apiClient.put('/precios/configuracion', datos, token);
    return configuracion;
  }

  async calcularPrecio(productoId) {
    return this.apiClient.get(`/precios/${productoId}`);
  }
}
