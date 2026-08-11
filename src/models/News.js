const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    resumen: { type: String, required: true },
    fechaPublicacion: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('News', newsSchema);
