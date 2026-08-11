import ApiClient from './services/ApiClient.js';
import SessionStorageService from './services/SessionStorageService.js';
import AuthService from './services/AuthService.js';
import ProductService from './services/ProductService.js';

import HeaderComponent from './components/HeaderComponent.js';
import ProductListComponent from './components/ProductListComponent.js';

const apiClient = new ApiClient('/api');
const sessionStorageService = new SessionStorageService();
const authService = new AuthService(apiClient, sessionStorageService);
const productService = new ProductService(apiClient);

new HeaderComponent('#header', authService).mount();
new ProductListComponent('#lista-productos-seguro', productService, 'seguro').mount();
