const path = require('path');
const express = require('express');

// Repositorios (acceso a datos)
const UserRepository = require('./repositories/UserRepository');
const ProductRepository = require('./repositories/ProductRepository');
const NewsRepository = require('./repositories/NewsRepository');
const PaymentGatewayRepository = require('./repositories/PaymentGatewayRepository');
const OrderRepository = require('./repositories/OrderRepository');
const PricingConfigRepository = require('./repositories/PricingConfigRepository');
const NotificationRepository = require('./repositories/NotificationRepository');

// Servicios (logica de negocio)
const AuthService = require('./services/AuthService');
const ProductService = require('./services/ProductService');
const NewsService = require('./services/NewsService');
const PaymentService = require('./services/PaymentService');       // Adapter
const ReportService = require('./services/ReportService');         // Proxy (RealSubject)
const OrderService = require('./services/OrderService');           // Command (Invoker)
const PricingService = require('./services/PricingService');       // Strategy (Context)

// Proxy
const ReportProxy = require('./proxies/ReportProxy');

// Observer
const InventoryNotifier = require('./observers/InventoryNotifier');
const RolNotificationObserver = require('./observers/RolNotificationObserver');

// Memento (caretaker compartido entre los comandos de pedidos)
const PedidoHistorial = require('./mementos/PedidoHistorial');

// Controladores (traducen HTTP)
const AuthController = require('./controllers/AuthController');
const ProductController = require('./controllers/ProductController');
const NewsController = require('./controllers/NewsController');
const PaymentController = require('./controllers/PaymentController');
const ReportController = require('./controllers/ReportController');
const OrderController = require('./controllers/OrderController');
const PricingController = require('./controllers/PricingController');
const NotificationController = require('./controllers/NotificationController');

// Rutas
const crearAuthRoutes = require('./routes/authRoutes');
const crearProductRoutes = require('./routes/productRoutes');
const crearNewsRoutes = require('./routes/newsRoutes');
const crearPaymentRoutes = require('./routes/paymentRoutes');
const crearReportRoutes = require('./routes/reportRoutes');
const crearOrderRoutes = require('./routes/orderRoutes');
const crearPricingRoutes = require('./routes/pricingRoutes');
const crearNotificationRoutes = require('./routes/notificationRoutes');

const errorHandler = require('./middleware/errorHandler');

// Este es el UNICO lugar del proyecto donde se decide con que implementacion
// concreta se arma cada capa. Si mañana cambias UserRepository por una version
// que usa Postgres, solo cambias esta linea; AuthService no se entera.
function crearApp() {
  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // --- Inyeccion de dependencias (composition root) ---
  const userRepository = new UserRepository();
  const productRepository = new ProductRepository();
  const newsRepository = new NewsRepository();
  const paymentGatewayRepository = new PaymentGatewayRepository();
  const orderRepository = new OrderRepository();
  const pricingConfigRepository = new PricingConfigRepository();
  const notificationRepository = new NotificationRepository();

  // Observer: se arma el Subject y se suscriben los observadores concretos
  // (uno por cada rol que debe enterarse de stock bajo, RF5).
  const inventoryNotifier = new InventoryNotifier();
  inventoryNotifier.suscribir(new RolNotificationObserver('gerente', notificationRepository));
  inventoryNotifier.suscribir(new RolNotificationObserver('compras', notificationRepository));

  // Memento: un unico caretaker compartido por todos los comandos de pedidos,
  // asi el historial de un pedido persiste entre distintas peticiones HTTP.
  const pedidoHistorial = new PedidoHistorial();

  const authService = new AuthService(userRepository);
  const productService = new ProductService(productRepository, inventoryNotifier);
  const newsService = new NewsService(newsRepository);
  const paymentService = new PaymentService(paymentGatewayRepository);
  const reportService = new ReportService(userRepository, productRepository, orderRepository);
  const orderService = new OrderService(orderRepository, pedidoHistorial);
  const pricingService = new PricingService(pricingConfigRepository, productRepository);

  // Proxy: envuelve al servicio real de reportes; el controlador solo
  // conoce el proxy (RF3/RF4).
  const reportProxy = new ReportProxy(reportService);

  const authController = new AuthController(authService);
  const productController = new ProductController(productService);
  const newsController = new NewsController(newsService);
  const paymentController = new PaymentController(paymentService);
  const reportController = new ReportController(reportProxy);
  const orderController = new OrderController(orderService);
  const pricingController = new PricingController(pricingService);
  const notificationController = new NotificationController(notificationRepository);

  // --- Rutas ---
  app.use('/api/auth', crearAuthRoutes(authController));
  app.use('/api/productos', crearProductRoutes(productController));
  app.use('/api/noticias', crearNewsRoutes(newsController));
  app.use('/api/pasarelas', crearPaymentRoutes(paymentController));       // Adapter
  app.use('/api/reportes', crearReportRoutes(reportController));         // Proxy
  app.use('/api/pedidos', crearOrderRoutes(orderController));            // Command + Memento
  app.use('/api/precios', crearPricingRoutes(pricingController));        // Strategy
  app.use('/api/notificaciones', crearNotificationRoutes(notificationController)); // Observer

  app.get('/api/health', (req, res) => {
    res.json({ estado: 'ok', mensaje: 'API de Financiera Confianza funcionando' });
  });

  app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada.' }));
  app.use(errorHandler);

  return app;
}

module.exports = crearApp;
