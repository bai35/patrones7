const ApiError = require('../utils/ApiError');
const PasswordHasher = require('../utils/PasswordHasher');
const TokenService = require('../utils/TokenService');

// Information Expert: esta clase tiene toda la informacion necesaria
// (repositorio de usuarios, hasher, generador de tokens) para decidir
// si un registro/login es valido, asi que la logica vive aqui y no en el controlador.
//
// DIP: recibe "userRepository" por constructor en vez de crear un UserRepository
// dentro de la clase. Esto permite inyectar un repositorio distinto (ej. en tests,
// un repositorio en memoria) sin tocar esta clase.
class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async registrar(datos) {
    const { nombres, apellidos, tipoDocumento, numeroDocumento, email, telefono, password } = datos;

    if (!nombres || !apellidos || !numeroDocumento || !email || !password) {
      throw new ApiError(400, 'Completa todos los campos obligatorios.');
    }
    if (password.length < 8) {
      throw new ApiError(400, 'La contraseña debe tener al menos 8 caracteres.');
    }

    const yaExiste = await this.userRepository.buscarPorEmailODocumento(email, numeroDocumento);
    if (yaExiste) {
      throw new ApiError(409, 'Ya existe una cuenta con ese correo o documento.');
    }

    const passwordHash = await PasswordHasher.hash(password);
    const usuario = await this.userRepository.crear({
      nombres, apellidos, tipoDocumento, numeroDocumento, email, telefono, passwordHash
    });

    return { usuario, token: this._generarToken(usuario) };
  }

  async iniciarSesion(datos) {
    const { email, password } = datos;
    if (!email || !password) {
      throw new ApiError(400, 'Correo y contraseña son obligatorios.');
    }

    const usuario = await this.userRepository.buscarPorEmail(email);
    if (!usuario) {
      throw new ApiError(401, 'Credenciales incorrectas.');
    }

    const passwordValido = await PasswordHasher.comparar(password, usuario.passwordHash);
    if (!passwordValido) {
      throw new ApiError(401, 'Credenciales incorrectas.');
    }

    return { usuario, token: this._generarToken(usuario) };
  }

  async obtenerPerfil(id) {
    const usuario = await this.userRepository.buscarPorId(id);
    if (!usuario) {
      throw new ApiError(404, 'Usuario no encontrado.');
    }
    return usuario;
  }

  // RF: el propio usuario puede ver y editar sus datos personales.
  // No se permite editar aqui el rol ni el numero de documento (serian
  // cambios sensibles que deberia hacer un admin desde otro flujo).
  async actualizarPerfil(id, datos) {
    const { nombres, apellidos, telefono, email, passwordActual, passwordNuevo } = datos;

    const usuario = await this.userRepository.buscarPorId(id);
    if (!usuario) {
      throw new ApiError(404, 'Usuario no encontrado.');
    }

    if (!nombres || !apellidos || !email) {
      throw new ApiError(400, 'Nombres, apellidos y correo son obligatorios.');
    }

    if (email.toLowerCase() !== usuario.email) {
      const yaExiste = await this.userRepository.buscarPorEmail(email.toLowerCase());
      if (yaExiste && String(yaExiste._id) !== String(id)) {
        throw new ApiError(409, 'Ese correo ya esta en uso por otra cuenta.');
      }
    }

    const cambios = { nombres, apellidos, telefono, email: email.toLowerCase() };

    // Cambio de contrasena es opcional: solo se aplica si el usuario
    // escribe una contrasena nueva Y confirma la actual correctamente.
    if (passwordNuevo) {
      if (!passwordActual) {
        throw new ApiError(400, 'Ingresa tu contraseña actual para poder cambiarla.');
      }
      const passwordValido = await PasswordHasher.comparar(passwordActual, usuario.passwordHash);
      if (!passwordValido) {
        throw new ApiError(401, 'La contraseña actual es incorrecta.');
      }
      if (passwordNuevo.length < 8) {
        throw new ApiError(400, 'La nueva contraseña debe tener al menos 8 caracteres.');
      }
      cambios.passwordHash = await PasswordHasher.hash(passwordNuevo);
    }

    return this.userRepository.actualizar(id, cambios);
  }

  _generarToken(usuario) {
    return TokenService.generar({ id: usuario._id, email: usuario.email, rol: usuario.rol });
  }
}

module.exports = AuthService;
