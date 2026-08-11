const asyncHandler = require('../utils/asyncHandler');

// GRASP Controller: no decide reglas de negocio, solo recibe la peticion HTTP,
// llama al servicio correspondiente y devuelve la respuesta.
class AuthController {
  constructor(authService) {
    this.authService = authService;

    // Se enlazan los metodos para poder pasarlos directo a Express como referencia
    this.registrar = asyncHandler(this.registrar.bind(this));
    this.iniciarSesion = asyncHandler(this.iniciarSesion.bind(this));
    this.obtenerPerfil = asyncHandler(this.obtenerPerfil.bind(this));
    this.actualizarPerfil = asyncHandler(this.actualizarPerfil.bind(this));
  }

  async registrar(req, res) {
    const { usuario, token } = await this.authService.registrar(req.body);
    res.status(201).json({ mensaje: 'Cuenta creada correctamente.', usuario, token });
  }

  async iniciarSesion(req, res) {
    const { usuario, token } = await this.authService.iniciarSesion(req.body);
    res.json({ mensaje: 'Inicio de sesion exitoso.', usuario, token });
  }

  async obtenerPerfil(req, res) {
    const usuario = await this.authService.obtenerPerfil(req.usuario.id);
    res.json({ usuario });
  }

  async actualizarPerfil(req, res) {
    const usuario = await this.authService.actualizarPerfil(req.usuario.id, req.body);
    res.json({ mensaje: 'Datos actualizados correctamente.', usuario });
  }
}

module.exports = AuthController;
