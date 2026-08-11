export default class ProductService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async listar(categoria) {
    const ruta = categoria ? `/productos?categoria=${categoria}` : '/productos';
    const { productos } = await this.apiClient.get(ruta);
    return productos;
  }
}
