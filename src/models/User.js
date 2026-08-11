const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    nombres: { type: String, required: true, trim: true },
    apellidos: { type: String, required: true, trim: true },
    tipoDocumento: { type: String, enum: ['DNI', 'CE', 'PASAPORTE'], default: 'DNI' },
    numeroDocumento: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    telefono: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    rol: {
      type: String,
      enum: ['cliente', 'admin', 'gerente', 'contador', 'compras'],
      default: 'cliente'
    }
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
