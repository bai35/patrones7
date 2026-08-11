const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    categoria: { type: String, enum: ['credito', 'ahorro', 'seguro'], required: true },
    descripcionCorta: { type: String, required: true },
    icono: { type: String, default: 'ti-cash' },
    precioBase: { type: Number, default: 0 },
    // RF6: el stock minimo es configurable por producto.
    stockActual: { type: Number, default: 0 },
    stockMinimo: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
