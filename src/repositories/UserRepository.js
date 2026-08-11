const User = require('../models/User');

// SRP + DIP: unico responsable de hablar con Mongoose para la coleccion "users".
// AuthService no sabe que existe Mongoose, solo conoce estos metodos.
class UserRepository {
  async buscarPorEmailODocumento(email, numeroDocumento) {
    return User.findOne({ $or: [{ email }, { numeroDocumento }] });
  }

  async buscarPorEmail(email) {
    return User.findOne({ email });
  }

  async buscarPorId(id) {
    return User.findById(id);
  }

  async crear(datos) {
    return User.create(datos);
  }

  async actualizar(id, datos) {
    return User.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
  }
}

module.exports = UserRepository;
