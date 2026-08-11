export default class NewsService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async listar() {
    const { noticias } = await this.apiClient.get('/noticias');
    return noticias;
  }
}
