// SRP: unica responsabilidad = persistir la sesion del usuario en el navegador.
// AuthService no sabe que existe localStorage, solo llama a estos metodos (DIP).
export default class SessionStorageService {
  guardar(token, usuario) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obtener() {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    return token && usuario ? { token, usuario: JSON.parse(usuario) } : null;
  }

  limpiar() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
}
