const mongoose = require('mongoose');

// SRP: esta funcion solo se encarga de conectar a la base de datos.
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI no esta definido en el archivo .env');
  }
  await mongoose.connect(uri);
  console.log('MongoDB conectado correctamente');
}

module.exports = connectDB;
