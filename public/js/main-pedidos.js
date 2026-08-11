import ApiClient from './services/ApiClient.js';
import SessionStorageService from './services/SessionStorageService.js';
import AuthService from './services/AuthService.js';
import ProductService from './services/ProductService.js';
import OrderService from './services/OrderService.js';
import PaymentGatewayService from './services/PaymentGatewayService.js';

import HeaderComponent from './components/HeaderComponent.js';
import OrderManagerComponent from './components/OrderManagerComponent.js';

const apiClient = new ApiClient('/api');
const sessionStorageService = new SessionStorageService();
const authService = new AuthService(apiClient, sessionStorageService);
const productService = new ProductService(apiClient);
const orderService = new OrderService(apiClient);
const paymentGatewayService = new PaymentGatewayService(apiClient);

new HeaderComponent('#header', authService).mount();
new OrderManagerComponent('#pedidos', orderService, productService, authService, paymentGatewayService).mount();
