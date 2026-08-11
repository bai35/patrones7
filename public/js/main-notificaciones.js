import ApiClient from './services/ApiClient.js';
import SessionStorageService from './services/SessionStorageService.js';
import AuthService from './services/AuthService.js';
import NotificationService from './services/NotificationService.js';

import HeaderComponent from './components/HeaderComponent.js';
import NotificationListComponent from './components/NotificationListComponent.js';

const apiClient = new ApiClient('/api');
const sessionStorageService = new SessionStorageService();
const authService = new AuthService(apiClient, sessionStorageService);
const notificationService = new NotificationService(apiClient);

new HeaderComponent('#header', authService).mount();
new NotificationListComponent('#notificaciones', notificationService, authService).mount();
