require('dotenv').config();
const connectDB = require('./src/config/database');
const crearApp = require('./src/app');

async function iniciar() {
  await connectDB();

  const app = crearApp();
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
}

iniciar().catch((error) => {
  console.error('Error al iniciar el servidor:', error.message);
  process.exit(1);
});
