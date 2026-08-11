import ApiClient from './services/ApiClient.js';
import SessionStorageService from './services/SessionStorageService.js';
import AuthService from './services/AuthService.js';

import HeaderComponent from './components/HeaderComponent.js';
import RegisterFormComponent from './components/RegisterFormComponent.js';

const apiClient = new ApiClient('/api');
const sessionStorageService = new SessionStorageService();
const authService = new AuthService(apiClient, sessionStorageService);

new HeaderComponent('#header', authService).mount();
new RegisterFormComponent('#registro-form', authService).mount();
