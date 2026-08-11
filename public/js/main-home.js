import ApiClient from './services/ApiClient.js';
import SessionStorageService from './services/SessionStorageService.js';
import AuthService from './services/AuthService.js';
import ProductService from './services/ProductService.js';
import NewsService from './services/NewsService.js';

import HeaderComponent from './components/HeaderComponent.js';
import HeroComponent from './components/HeroComponent.js';
import ProductListComponent from './components/ProductListComponent.js';
import NewsListComponent from './components/NewsListComponent.js';

// Este archivo es el UNICO lugar de la pagina de inicio donde se decide
// con que implementacion concreta se arma cada pieza (composition root).
// Los componentes y servicios nunca se crean entre si.
const apiClient = new ApiClient('/api');
const sessionStorageService = new SessionStorageService();
const authService = new AuthService(apiClient, sessionStorageService);
const productService = new ProductService(apiClient);
const newsService = new NewsService(apiClient);

new HeaderComponent('#header', authService).mount();
new HeroComponent('#hero').mount();
new ProductListComponent('#lista-productos', productService, 'credito').mount();
new NewsListComponent('#lista-noticias', newsService).mount();
