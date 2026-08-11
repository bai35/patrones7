import Component from '../core/Component.js';
import PaymentModalComponent from './PaymentModalComponent.js';
import { mostrarToast } from '../utils/toast.js';

// SRP: solo pinta el formulario para crear pedidos, la lista de pedidos del
// usuario y los botones de accion (procesar/descuento/cancelar/revertir).
// Cada boton simplemente llama al metodo correspondiente de OrderService,
// que en el backend arma y ejecuta el Command adecuado (RF7) y usa el
// Memento guardado para poder revertir (RF8). Este componente no sabe nada
// de esos patrones, solo consume la API.
export default class OrderManagerComponent extends Component {
  constructor(selector, orderService, productService, authService, paymentGatewayService) {
    super(selector);
    this.orderService = orderService;
    this.productService = productService;
    this.authService = authService;
    this.paymentGatewayService = paymentGatewayService;
  }

  async render() {
    const sesion = this.authService.obtenerSesion();
    if (!sesion) {
      return '<p>Inicia sesión para crear y gestionar pedidos.</p>';
    }
    this.sesion = sesion;

    try {
      const [productos, pedidos] = await Promise.all([
        this.productService.listar(),
        this.orderService.listarMios(sesion.token)
      ]);
      this.productos = productos;
      this.pedidos = pedidos;
    } catch (error) {
      return `<p class="mensaje-error" style="display:block;">${error.message}</p>`;
    }

    return `
      <div class="panel">
        <h2 class="panel-titulo"><i class="ti ti-shopping-cart"></i> Crear pedido (Command)</h2>
        <div class="mensaje-error" id="mensaje-pedido"></div>
        <form id="form-pedido">
          <div class="campo">
            <label>Producto</label>
            <select name="producto" id="select-producto">
              ${this.productos
                .map((p) => `<option value="${p._id}" data-precio="${p.precioBase}">${p.nombre} (S/ ${Number(p.precioBase).toFixed(2)})</option>`)
                .join('')}
            </select>
          </div>
          <div class="campo">
            <label>Cantidad</label>
            <input type="number" name="cantidad" min="1" value="1" required>
          </div>
          <button type="submit" class="btn btn-coral">Crear pedido</button>
        </form>
      </div>

      <div class="panel">
        <h2 class="panel-titulo"><i class="ti ti-history"></i> Mis pedidos</h2>
        <div id="lista-pedidos">${this._renderPedidos()}</div>
      </div>
    `;
  }

  _renderPedidos() {
    if (!this.pedidos.length) return '<p>Aún no tienes pedidos.</p>';

    return this.pedidos
      .map(
        (pedido) => `
      <div class="pedido-card" data-id="${pedido._id}">
        <div class="pedido-cabecera">
          <span class="badge ${this._claseEstado(pedido.estado)}">${this._etiquetaEstado(pedido.estado)}</span>
          <strong>Total: S/ ${Number(pedido.total).toFixed(2)}</strong>
          ${pedido.descuento ? `<span>(${pedido.descuento}% dcto.)</span>` : ''}
        </div>
        <p class="pedido-productos">${this._resumenProductos(pedido.productos)}</p>
        <div class="pedido-acciones">
          ${pedido.estado === 'creado' ? `<button class="btn btn-coral btn-pagar-pedido" data-total="${pedido.total}" data-id="${pedido._id}"><i class="ti ti-credit-card"></i> Pagar</button>` : ''}
          <button class="btn btn-outline-oscuro btn-descuento" data-id="${pedido._id}" ${pedido.estado === 'cancelado' ? 'disabled' : ''}>Aplicar descuento</button>
          <button class="btn btn-outline-oscuro btn-accion" data-accion="cancelar" data-id="${pedido._id}" ${pedido.estado === 'cancelado' ? 'disabled' : ''}>Cancelar</button>
          <button class="btn btn-outline-oscuro btn-accion" data-accion="revertir" data-id="${pedido._id}">Revertir (Memento)</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  _resumenProductos(productos) {
    if (!productos?.length) return '';
    return productos
      .map((item) => `${item.cantidad} × ${item.producto?.nombre || 'Producto eliminado'}`)
      .join(', ');
  }

  _claseEstado(estado) {
    if (estado === 'procesado') return 'badge-activo';
    if (estado === 'cancelado') return 'badge-inactivo';
    return 'badge-neutro';
  }

  // RF: en vez de mostrar el estado interno tal cual, se traduce a un
  // mensaje claro para el usuario junto a cada pedido.
  _etiquetaEstado(estado) {
    if (estado === 'procesado') return 'Compra realizada';
    if (estado === 'cancelado') return 'Cancelado';
    return 'Falta pagar';
  }

  afterRender() {
    this.container
      .querySelector('#form-pedido')
      ?.addEventListener('submit', (evento) => this._crearPedido(evento));

    this.container.querySelectorAll('.btn-accion').forEach((boton) => {
      boton.addEventListener('click', () => this._ejecutarAccion(boton.dataset.accion, boton.dataset.id));
    });

    this.container.querySelectorAll('.btn-pagar-pedido').forEach((boton) => {
      boton.addEventListener('click', () => this._abrirPago(boton.dataset.id, Number(boton.dataset.total)));
    });

    this.container.querySelectorAll('.btn-descuento').forEach((boton) => {
      boton.addEventListener('click', () => this._pedirDescuento(boton.dataset.id));
    });
  }

  async _crearPedido(evento) {
    evento.preventDefault();
    const mensajeError = this.container.querySelector('#mensaje-pedido');
    mensajeError.style.display = 'none';

    const select = this.container.querySelector('#select-producto');
    const opcion = select.options[select.selectedIndex];
    const cantidad = Number(this.container.querySelector('[name="cantidad"]').value);

    const productos = [
      {
        producto: opcion.value,
        cantidad,
        precioUnitario: Number(opcion.dataset.precio)
      }
    ];

    try {
      await this.orderService.crear(productos, this.sesion.token);
      await this.mount();
    } catch (error) {
      mensajeError.textContent = error.message;
      mensajeError.style.display = 'block';
    }
  }

  async _pedirDescuento(pedidoId) {
    const porcentaje = Number(prompt('¿Qué porcentaje de descuento deseas aplicar? (0-100)', '10'));
    if (Number.isNaN(porcentaje)) return;

    try {
      await this.orderService.aplicarDescuento(pedidoId, porcentaje, this.sesion.token);
      await this.mount();
    } catch (error) {
      alert(error.message);
    }
  }

  _abrirPago(pedidoId, total) {
    new PaymentModalComponent(this.paymentGatewayService, {
      monto: total,
      onExito: async () => {
        try {
          await this.orderService.procesar(pedidoId, this.sesion.token);
          await this.mount();
          mostrarToast('¡Compra realizada con éxito!', 'exito');
        } catch (error) {
          alert(error.message);
        }
      }
    }).mount();
  }

  async _ejecutarAccion(accion, pedidoId) {
    const acciones = {
      procesar: () => this.orderService.procesar(pedidoId, this.sesion.token),
      cancelar: () => this.orderService.cancelar(pedidoId, this.sesion.token),
      revertir: () => this.orderService.revertir(pedidoId, this.sesion.token)
    };

    try {
      await acciones[accion]();
      await this.mount();
      if (accion === 'cancelar') mostrarToast('Pedido cancelado.', 'info');
      if (accion === 'revertir') mostrarToast('Pedido revertido a su estado anterior.', 'info');
    } catch (error) {
      alert(error.message);
    }
  }
}
