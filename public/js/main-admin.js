import ApiClient from './services/ApiClient.js';
import SessionStorageService from './services/SessionStorageService.js';
import AuthService from './services/AuthService.js';
import PaymentGatewayService from './services/PaymentGatewayService.js';
import PricingService from './services/PricingService.js';

import HeaderComponent from './components/HeaderComponent.js';
import PaymentGatewayPanelComponent from './components/PaymentGatewayPanelComponent.js';
import PricingConfigComponent from './components/PricingConfigComponent.js';

const apiClient = new ApiClient('/api');
const sessionStorageService = new SessionStorageService();
const authService = new AuthService(apiClient, sessionStorageService);
const paymentGatewayService = new PaymentGatewayService(apiClient);
const pricingService = new PricingService(apiClient);

new HeaderComponent('#header', authService).mount();

// Esto es solo una comodidad de UX (ocultar el panel si no corresponde).
// La proteccion real esta en el backend: los endpoints de escritura
// (PATCH /pasarelas/:nombre, PUT /precios/configuracion) exigen
// autenticar + soloAdmin, asi que igual estarian bloqueados aunque alguien
// manipulara el HTML.
const sesion = authService.obtenerSesion();
if (!sesion || sesion.usuario.rol !== 'admin') {
  document.getElementById('acceso-denegado').style.display = 'block';
} else {
  new PaymentGatewayPanelComponent('#panel-admin', paymentGatewayService, authService).mount();
  const contenedorPrecios = document.createElement('div');
  document.getElementById('panel-admin').after(contenedorPrecios);
  contenedorPrecios.id = 'panel-precios';
  new PricingConfigComponent('#panel-precios', pricingService, authService).mount();
}
