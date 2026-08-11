export default class NotificationService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async listar(token) {
    const { notificaciones } = await this.apiClient.get('/notificaciones', token);
    return notificaciones;
  }
}
