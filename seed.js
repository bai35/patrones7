require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/database');
const ProductRepository = require('./src/repositories/ProductRepository');
const NewsRepository = require('./src/repositories/NewsRepository');
const PaymentGatewayRepository = require('./src/repositories/PaymentGatewayRepository');
const PricingConfigRepository = require('./src/repositories/PricingConfigRepository');

async function poblar() {
  await connectDB();

  const productRepository = new ProductRepository();
  await productRepository.eliminarTodos();
  await productRepository.insertarVarios([
    // Creditos
    { nombre: 'Crédito Emprendiendo Confianza PYME', categoria: 'credito', descripcionCorta: 'Capital de trabajo para tu negocio', icono: 'ti-briefcase', precioBase: 500, stockActual: 50, stockMinimo: 10 },
    { nombre: 'Crédito Personal', categoria: 'credito', descripcionCorta: 'Dinero rápido para tus proyectos', icono: 'ti-cash', precioBase: 300, stockActual: 40, stockMinimo: 10 },
    { nombre: 'Crédito Agropecuario', categoria: 'credito', descripcionCorta: 'Financia siembra, cosecha y ganado', icono: 'ti-plant', precioBase: 450, stockActual: 30, stockMinimo: 10 },
    { nombre: 'Crédito Vehicular', categoria: 'credito', descripcionCorta: 'Compra tu auto o moto lineal', icono: 'ti-car', precioBase: 800, stockActual: 25, stockMinimo: 8 },
    { nombre: 'Crédito Hipotecario', categoria: 'credito', descripcionCorta: 'Compra o construye tu vivienda', icono: 'ti-home-dollar', precioBase: 1200, stockActual: 15, stockMinimo: 5 },
    { nombre: 'Crédito Educativo', categoria: 'credito', descripcionCorta: 'Invierte en tu formación profesional', icono: 'ti-school', precioBase: 350, stockActual: 35, stockMinimo: 10 },
    { nombre: 'Crédito Mype Digital', categoria: 'credito', descripcionCorta: 'Capital de trabajo 100% en línea', icono: 'ti-device-laptop', precioBase: 400, stockActual: 45, stockMinimo: 10 },
    { nombre: 'Línea de Crédito Rotativa', categoria: 'credito', descripcionCorta: 'Disponibilidad de dinero cuando la necesites', icono: 'ti-refresh', precioBase: 250, stockActual: 60, stockMinimo: 15 },

    // Ahorros
    { nombre: 'Ahorro Confianza', categoria: 'ahorro', descripcionCorta: 'Cuenta de ahorros sin comisiones', icono: 'ti-pig-money', precioBase: 0, stockActual: 100, stockMinimo: 5 },
    { nombre: 'Depósito a Plazo Fijo', categoria: 'ahorro', descripcionCorta: 'Haz crecer tu dinero con tasa fija', icono: 'ti-clock-dollar', precioBase: 0, stockActual: 100, stockMinimo: 5 },
    { nombre: 'Ahorro Meta', categoria: 'ahorro', descripcionCorta: 'Programa tus ahorros para un objetivo', icono: 'ti-target-arrow', precioBase: 0, stockActual: 80, stockMinimo: 5 },
    { nombre: 'Cuenta Sueldo', categoria: 'ahorro', descripcionCorta: 'Recibe tu sueldo sin costo de mantenimiento', icono: 'ti-wallet', precioBase: 0, stockActual: 90, stockMinimo: 5 },
    { nombre: 'Ahorro Infantil', categoria: 'ahorro', descripcionCorta: 'Empieza a ahorrar para el futuro de tus hijos', icono: 'ti-baby-carriage', precioBase: 0, stockActual: 70, stockMinimo: 5 },
    { nombre: 'CTS Confianza', categoria: 'ahorro', descripcionCorta: 'Deposita tu Compensación por Tiempo de Servicios', icono: 'ti-briefcase-2', precioBase: 0, stockActual: 60, stockMinimo: 5 },

    // Seguros
    { nombre: 'Desgravamen', categoria: 'seguro', descripcionCorta: 'Protege a tu familia ante imprevistos', icono: 'ti-umbrella', precioBase: 25, stockActual: 8, stockMinimo: 10 },
    { nombre: 'Vida Segura', categoria: 'seguro', descripcionCorta: 'Tranquilidad para ti y los tuyos', icono: 'ti-heart', precioBase: 35, stockActual: 20, stockMinimo: 5 },
    { nombre: 'Seguro Oncológico', categoria: 'seguro', descripcionCorta: 'Cobertura ante el diagnóstico de cáncer', icono: 'ti-stethoscope', precioBase: 45, stockActual: 18, stockMinimo: 5 },
    { nombre: 'Seguro Multiriesgo Hogar', categoria: 'seguro', descripcionCorta: 'Protege tu vivienda ante incendios y robos', icono: 'ti-home-shield', precioBase: 30, stockActual: 22, stockMinimo: 5 },
    { nombre: 'Seguro Accidentes Personales', categoria: 'seguro', descripcionCorta: 'Cobertura ante accidentes en tu día a día', icono: 'ti-first-aid-kit', precioBase: 20, stockActual: 40, stockMinimo: 10 },
    { nombre: 'Seguro Negocio Protegido', categoria: 'seguro', descripcionCorta: 'Protege tu emprendimiento ante imprevistos', icono: 'ti-building-store', precioBase: 40, stockActual: 16, stockMinimo: 5 }
  ]);

  const newsRepository = new NewsRepository();
  await newsRepository.eliminarTodas();
  await newsRepository.insertarVarias([
    { titulo: 'Financiera Confianza abre convocatoria nacional de becas', resumen: 'Del 01 de julio al 31 de agosto.' },
    { titulo: 'Mujeres peruanas sostienen la reactivación de la microeconomía', resumen: 'Representan el 62% de nuestros clientes.' }
  ]);

  // Adapter: se dejan las 4 pasarelas habilitadas por defecto.
  const paymentGatewayRepository = new PaymentGatewayRepository();
  await Promise.all(
    ['paypal', 'yape', 'plin', 'tarjeta'].map((nombre) => paymentGatewayRepository.actualizarEstado(nombre, true))
  );

  // Strategy: configuracion de precios por defecto (estandar).
  const pricingConfigRepository = new PricingConfigRepository();
  await pricingConfigRepository.actualizar({ estrategia: 'estandar', porcentajeDescuento: 10, factorDemanda: 1 });

  console.log('Datos de ejemplo insertados correctamente.');
  console.log('Nota: "Desgravamen" quedo con stockActual (8) por debajo de stockMinimo (10)');
  console.log('a proposito, para poder probar el patron Observer en /api/productos/:id/stock.');
  await mongoose.connection.close();
  process.exit(0);
}

poblar().catch((error) => {
  console.error(error);
  process.exit(1);
});
