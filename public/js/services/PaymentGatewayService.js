// SRP: unica responsabilidad = hablar con /api/pasarelas.
export default class PaymentGatewayService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async listar() {
    const { pasarelas } = await this.apiClient.get('/pasarelas');
    return pasarelas;
  }

  async cambiarEstado(nombre, habilitada, token) {
    const { pasarela } = await this.apiClient.patch(`/pasarelas/${nombre}`, { habilitada }, token);
    return pasarela;
  }

  // RF: cobro real usando el Adapter correspondiente (yape, plin, tarjeta...).
  async pagar(pasarela, monto, datos) {
    return this.apiClient.post('/pasarelas/pagar', { pasarela, monto, datos });
  }
}
