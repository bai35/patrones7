export default class OrderService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async crear(productos, token) {
    const { pedido } = await this.apiClient.post('/pedidos', { productos }, token);
    return pedido;
  }

  async listarMios(token) {
    const { pedidos } = await this.apiClient.get('/pedidos/mios', token);
    return pedidos;
  }

  async procesar(id, token) {
    const { pedido } = await this.apiClient.post(`/pedidos/${id}/procesar`, {}, token);
    return pedido;
  }

  async aplicarDescuento(id, porcentaje, token) {
    const { pedido } = await this.apiClient.post(`/pedidos/${id}/descuento`, { porcentaje }, token);
    return pedido;
  }

  async cancelar(id, token) {
    const { pedido } = await this.apiClient.post(`/pedidos/${id}/cancelar`, {}, token);
    return pedido;
  }

  async revertir(id, token) {
    const { pedido } = await this.apiClient.post(`/pedidos/${id}/revertir`, {}, token);
    return pedido;
  }

  async historialEstados(id, token) {
    const { historial } = await this.apiClient.get(`/pedidos/${id}/historial`, token);
    return historial;
  }

  async historialComandos(token) {
    const { historial } = await this.apiClient.get('/pedidos/comandos/historial', token);
    return historial;
  }
}
