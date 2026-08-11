const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productos: [
      {
        producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        cantidad: { type: Number, required: true },
        precioUnitario: { type: Number, required: true }
      }
    ],
    descuento: { type: Number, default: 0 }, // porcentaje aplicado al pedido
    estado: {
      type: String,
      enum: ['creado', 'procesado', 'cancelado'],
      default: 'creado'
    },
    total: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
