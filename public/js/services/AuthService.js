// Information Expert: esta clase tiene lo necesario (ApiClient + SessionStorageService)
// para decidir que es "iniciar sesion" o "cerrar sesion", asi que la logica vive aqui
// y no dispersa en cada componente que la necesite.
//
// DIP: recibe ambas dependencias por constructor. Si en un test quieres simular
// el backend, le inyectas un ApiClient falso sin tocar esta clase.
export default class AuthService {
  constructor(apiClient, sessionStorageService) {
    this.apiClient = apiClient;
    this.sessionStorageService = sessionStorageService;
  }

  async registrar(datos) {
    const { usuario, token } = await this.apiClient.post('/auth/registro', datos);
    this.sessionStorageService.guardar(token, usuario);
    return usuario;
  }

  async iniciarSesion(datos) {
    const { usuario, token } = await this.apiClient.post('/auth/login', datos);
    this.sessionStorageService.guardar(token, usuario);
    return usuario;
  }

  async obtenerPerfil() {
    const sesion = this.obtenerSesion();
    const { usuario } = await this.apiClient.get('/auth/perfil', sesion?.token);
    return usuario;
  }

  // RF: actualiza los datos del usuario y refresca la sesion guardada en
  // localStorage para que el resto de la app (Header, etc.) vea los datos
  // nuevos sin tener que volver a iniciar sesion.
  async actualizarPerfil(datos) {
    const sesion = this.obtenerSesion();
    const { usuario } = await this.apiClient.put('/auth/perfil', datos, sesion?.token);
    this.sessionStorageService.guardar(sesion.token, usuario);
    return usuario;
  }

  cerrarSesion() {
    this.sessionStorageService.limpiar();
    window.location.href = 'index.html';
  }

  obtenerSesion() {
    return this.sessionStorageService.obtener();
  }

  haySesionActiva() {
    return this.obtenerSesion() !== null;
  }
}
