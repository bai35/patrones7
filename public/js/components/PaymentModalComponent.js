import Component from '../core/Component.js';

// SRP: este componente solo sabe pintar el selector de metodo de pago y
// recoger los datos del formulario. La logica de cobro (Adapter) vive en
// PaymentGatewayService/PaymentService; este componente solo la invoca.
//
// Diseño inspirado en apps peruanas de pago: tarjeta morada estilo Yape,
// tarjeta turquesa estilo Plin y una tarjeta bancaria estilo BCP/Interbank
// para el pago con tarjeta.
export default class PaymentModalComponent extends Component {
  constructor(paymentGatewayService, { monto, onExito, onCerrar }) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);

    super(overlay);
    this.paymentGatewayService = paymentGatewayService;
    this.monto = monto;
    this.onExito = onExito;
    this.onCerrar = onCerrar;
    this.metodo = 'yape';
    this.banco = 'bcp';
    this.enviando = false;
  }

  async render() {
    return `
      <div class="modal-pago" role="dialog" aria-modal="true">
        <button type="button" class="modal-cerrar" id="modal-cerrar" aria-label="Cerrar">
          <i class="ti ti-x"></i>
        </button>

        <h2 class="modal-titulo">Elige tu medio de pago</h2>
        <p class="modal-monto">Total a pagar: <strong>S/ ${this.monto.toFixed(2)}</strong></p>

        <div class="metodos-pago" id="metodos-pago">
          <button type="button" class="metodo-btn metodo-yape ${this.metodo === 'yape' ? 'activo' : ''}" data-metodo="yape">
            <i class="ti ti-device-mobile"></i> Yape
          </button>
          <button type="button" class="metodo-btn metodo-plin ${this.metodo === 'plin' ? 'activo' : ''}" data-metodo="plin">
            <i class="ti ti-device-mobile"></i> Plin
          </button>
          <button type="button" class="metodo-btn metodo-tarjeta ${this.metodo === 'tarjeta' ? 'activo' : ''}" data-metodo="tarjeta">
            <i class="ti ti-credit-card"></i> Tarjeta
          </button>
        </div>

        <div class="mensaje-error" id="mensaje-pago"></div>

        <form id="form-pago">
          <div id="contenido-metodo">${this._renderMetodo()}</div>
          <button type="submit" class="btn btn-pagar btn-pagar-${this.metodo}" id="btn-pagar" ${this.enviando ? 'disabled' : ''}>
            ${this.enviando ? 'Procesando...' : `Pagar S/ ${this.monto.toFixed(2)}`}
          </button>
        </form>
      </div>
    `;
  }

  _renderMetodo() {
    if (this.metodo === 'yape') {
      return `
        <div class="billetera-tarjeta billetera-yape">
          <div class="billetera-marca"><i class="ti ti-device-mobile"></i> Yape</div>
          <div class="billetera-monto">S/ ${this.monto.toFixed(2)}</div>
          <i class="ti ti-qrcode billetera-qr"></i>
        </div>
        <div class="campo">
          <label>Numero de celular Yape</label>
          <input type="tel" id="numeroCelular" placeholder="9XXXXXXXX" maxlength="9" inputmode="numeric" required>
        </div>
        <p class="ayuda-pago">Te enviaremos una notificacion a tu app Yape para confirmar el cobro.</p>
      `;
    }

    if (this.metodo === 'plin') {
      return `
        <div class="billetera-tarjeta billetera-plin">
          <div class="billetera-marca"><i class="ti ti-device-mobile"></i> Plin</div>
          <div class="billetera-monto">S/ ${this.monto.toFixed(2)}</div>
          <i class="ti ti-qrcode billetera-qr"></i>
        </div>
        <div class="campo">
          <label>Numero de celular Plin</label>
          <input type="tel" id="numeroCelular" placeholder="9XXXXXXXX" maxlength="9" inputmode="numeric" required>
        </div>
        <p class="ayuda-pago">Te enviaremos una notificacion a tu app Plin para confirmar el cobro.</p>
      `;
    }

    // Tarjeta (BCP / Interbank / otro banco)
    return `
      <div class="billetera-tarjeta tarjeta-banco tarjeta-banco-${this.banco}" id="preview-tarjeta">
        <div class="billetera-marca" id="preview-banco">${this._etiquetaBanco(this.banco)}</div>
        <div class="tarjeta-chip"><i class="ti ti-cpu"></i></div>
        <div class="tarjeta-numero" id="preview-numero">•••• •••• •••• ••••</div>
        <div class="tarjeta-pie">
          <span id="preview-titular">NOMBRE APELLIDO</span>
          <span id="preview-vencimiento">MM/AA</span>
        </div>
      </div>

      <div class="bancos-selector">
        <button type="button" class="banco-btn banco-bcp ${this.banco === 'bcp' ? 'activo' : ''}" data-banco="bcp">BCP</button>
        <button type="button" class="banco-btn banco-interbank ${this.banco === 'interbank' ? 'activo' : ''}" data-banco="interbank">Interbank</button>
        <button type="button" class="banco-btn banco-otro ${this.banco === 'otro' ? 'activo' : ''}" data-banco="otro">Otro banco</button>
      </div>

      <div class="campo">
        <label>Titular de la tarjeta</label>
        <input type="text" id="titular" placeholder="Nombre como aparece en la tarjeta" required>
      </div>
      <div class="campo">
        <label>Numero de tarjeta</label>
        <input type="text" id="numeroTarjeta" placeholder="0000 0000 0000 0000" maxlength="19" inputmode="numeric" required>
      </div>
      <div class="fila-doble">
        <div class="campo">
          <label>Vencimiento</label>
          <input type="text" id="vencimiento" placeholder="MM/AA" maxlength="5" required>
        </div>
        <div class="campo">
          <label>CVV</label>
          <input type="password" id="cvv" placeholder="123" maxlength="4" inputmode="numeric" required>
        </div>
      </div>
    `;
  }

  _etiquetaBanco(banco) {
    if (banco === 'bcp') return 'BCP';
    if (banco === 'interbank') return 'Interbank';
    return 'Tarjeta';
  }

  afterRender() {
    this.container.addEventListener('click', (evento) => {
      if (evento.target === this.container) this._cerrar();
    });
    this.container.querySelector('#modal-cerrar')?.addEventListener('click', () => this._cerrar());

    this.container.querySelectorAll('.metodo-btn').forEach((boton) => {
      boton.addEventListener('click', () => {
        this.metodo = boton.dataset.metodo;
        this._repintarMetodo();
      });
    });

    this.container.querySelector('#form-pago')?.addEventListener('submit', (evento) => this._pagar(evento));

    this._enlazarInteracciones();
  }

  _repintarMetodo() {
    this.container.querySelectorAll('.metodo-btn').forEach((boton) => {
      boton.classList.toggle('activo', boton.dataset.metodo === this.metodo);
    });
    this.container.querySelector('#contenido-metodo').innerHTML = this._renderMetodo();
    const botonPagar = this.container.querySelector('#btn-pagar');
    botonPagar.className = `btn btn-pagar btn-pagar-${this.metodo}`;
    this._enlazarInteracciones();
  }

  _enlazarInteracciones() {
    // Autoformato del numero de tarjeta en grupos de 4 + preview en vivo.
    const numeroTarjeta = this.container.querySelector('#numeroTarjeta');
    numeroTarjeta?.addEventListener('input', (evento) => {
      const soloDigitos = evento.target.value.replace(/\D/g, '').slice(0, 16);
      evento.target.value = soloDigitos.replace(/(\d{4})(?=\d)/g, '$1 ');
      const preview = this.container.querySelector('#preview-numero');
      if (preview) {
        const relleno = soloDigitos.padEnd(16, '•');
        preview.textContent = relleno.replace(/(.{4})/g, '$1 ').trim();
      }
    });

    const titular = this.container.querySelector('#titular');
    titular?.addEventListener('input', (evento) => {
      const preview = this.container.querySelector('#preview-titular');
      if (preview) preview.textContent = evento.target.value.trim().toUpperCase() || 'NOMBRE APELLIDO';
    });

    const vencimiento = this.container.querySelector('#vencimiento');
    vencimiento?.addEventListener('input', (evento) => {
      let valor = evento.target.value.replace(/\D/g, '').slice(0, 4);
      if (valor.length > 2) valor = `${valor.slice(0, 2)}/${valor.slice(2)}`;
      evento.target.value = valor;
      const preview = this.container.querySelector('#preview-vencimiento');
      if (preview) preview.textContent = valor || 'MM/AA';
    });

    const numeroCelular = this.container.querySelector('#numeroCelular');
    numeroCelular?.addEventListener('input', (evento) => {
      evento.target.value = evento.target.value.replace(/\D/g, '').slice(0, 9);
    });

    this.container.querySelectorAll('.banco-btn').forEach((boton) => {
      boton.addEventListener('click', () => {
        this.banco = boton.dataset.banco;
        this.container.querySelectorAll('.banco-btn').forEach((b) => b.classList.toggle('activo', b === boton));
        const preview = this.container.querySelector('#preview-tarjeta');
        if (preview) {
          preview.className = `billetera-tarjeta tarjeta-banco tarjeta-banco-${this.banco}`;
        }
        const marca = this.container.querySelector('#preview-banco');
        if (marca) marca.textContent = this._etiquetaBanco(this.banco);
      });
    });
  }

  _datosFormulario() {
    if (this.metodo === 'tarjeta') {
      return {
        banco: this.banco,
        titular: this.container.querySelector('#titular')?.value || '',
        numeroTarjeta: this.container.querySelector('#numeroTarjeta')?.value || '',
        vencimiento: this.container.querySelector('#vencimiento')?.value || '',
        cvv: this.container.querySelector('#cvv')?.value || ''
      };
    }
    return { numeroCelular: this.container.querySelector('#numeroCelular')?.value || '' };
  }

  async _pagar(evento) {
    evento.preventDefault();
    const mensajeError = this.container.querySelector('#mensaje-pago');
    mensajeError.style.display = 'none';

    this.enviando = true;
    const botonPagar = this.container.querySelector('#btn-pagar');
    botonPagar.disabled = true;
    botonPagar.textContent = 'Procesando...';

    try {
      const resultado = await this.paymentGatewayService.pagar(this.metodo, this.monto, this._datosFormulario());
      if (!resultado.exito) {
        throw new Error(resultado.mensaje || 'No se pudo procesar el pago.');
      }
      this._mostrarExito(resultado);
    } catch (error) {
      mensajeError.textContent = error.message;
      mensajeError.style.display = 'block';
      this.enviando = false;
      botonPagar.disabled = false;
      botonPagar.textContent = `Pagar S/ ${this.monto.toFixed(2)}`;
    }
  }

  // Pantalla de confirmacion dentro del propio modal: refuerza que la
  // compra se realizo antes de cerrar y refrescar el listado de pedidos.
  _mostrarExito(resultado) {
    const modal = this.container.querySelector('.modal-pago');
    modal.innerHTML = `
      <div class="pago-exito">
        <i class="ti ti-circle-check pago-exito-icono"></i>
        <h2>¡Compra exitosa!</h2>
        <p>Tu pago de <strong>S/ ${this.monto.toFixed(2)}</strong> se proceso correctamente.</p>
        <p class="pago-exito-referencia">Referencia: ${resultado.referencia}</p>
      </div>
    `;

    setTimeout(async () => {
      this._cerrar();
      await this.onExito?.(resultado);
    }, 1400);
  }

  _cerrar() {
    this.container.remove();
    this.onCerrar?.();
  }
}
