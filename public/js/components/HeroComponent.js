import Component from '../core/Component.js';

// SRP: este componente solo sabe pintar el hero y manejar su propio carrusel
// (avanzar cada 5s, responder a los indicadores). No depende de ningun servicio
// porque el contenido de los slides es fijo, no viene del backend.
export default class HeroComponent extends Component {
  constructor(selector) {
    super(selector);

    this.slides = [
      {
        titulo: 'Crédito PYME desde S/ 500',
        descripcion: 'Impulsa tu negocio hoy',
        cta: 'Solicítalo ahora',
        enlace: 'registro.html',
		imagen: 'https://confianza.pe/admin/img/noticias/Foto%202.jpg'
      },
      {
        titulo: 'Abre tu cuenta de ahorros en minutos',
        descripcion: 'Sin comisiones de mantenimiento',
        cta: 'Regístrate',
        enlace: 'registro.html',
		imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgTjRjJhUOMNRm3UhgLszE8nDSpD9vrUPl0g&s'
      },
      {
        titulo: 'Protege lo que más quieres',
        descripcion: 'Seguros pensados para ti y tu familia',
        cta: 'Conoce más',
        enlace: 'registro.html',
		imagen: 'https://d1h08qwp2t1dnu.cloudfront.net/assets/media_p/es_pe/publications/page_assets/75955/1/page_1_level_2_1269601150.webp'
      }
    ];

    this.slideActual = 0;
    this.intervaloId = null;
    this.MS_ENTRE_SLIDES = 5000;
  }

  async render() {
  return `
    <section class="hero">
      <div class="contenedor">
        <div class="hero-tarjeta" id="hero-tarjeta"></div>

        <div class="hero-indicadores" id="hero-indicadores">
          ${this.slides
            .map((_, indice) => `<span data-indice="${indice}" class="${indice === 0 ? 'activo' : ''}"></span>`)
            .join('')}
        </div>

        <div class="accesos-rapidos">
          <div class="acceso-card"><i class="ti ti-credit-card"></i><p>Créditos</p></div>
          <div class="acceso-card"><i class="ti ti-pig-money"></i><p>Ahorros</p></div>
          <div class="acceso-card"><i class="ti ti-umbrella"></i><p>Seguros</p></div>
          <div class="acceso-card"><i class="ti ti-map-pin"></i><p>Agencias</p></div>
        </div>
      </div>
    </section>
  `;
}

  afterRender() {
    this.container.querySelector('#hero-tarjeta').innerHTML = this._renderSlide(0);
	this._activarIndicadores();
    this._reiniciarTemporizador();

    // Pausar el auto-avance mientras el mouse esta sobre el hero, y reanudar al salir.
    const tarjeta = this.container.querySelector('#hero-tarjeta');
    tarjeta.addEventListener('mouseenter', () => this._detenerTemporizador());
    tarjeta.addEventListener('mouseleave', () => this._reiniciarTemporizador());
  }

  _renderSlide(indice) {
  const slide = this.slides[indice];
  const tarjeta = this.container.querySelector('#hero-tarjeta');
  tarjeta.style.backgroundImage = `linear-gradient(0deg, rgba(26,46,92,0.85), rgba(26,46,92,0.35)), url('${slide.imagen}')`;

  return `
    <div>
      <h1>${slide.titulo}</h1>
      <p>${slide.descripcion}</p>
      <a href="${slide.enlace}" class="btn btn-coral">${slide.cta}</a>
    </div>
  `;
}

  _activarIndicadores() {
    this.container.querySelectorAll('#hero-indicadores span').forEach((indicador) => {
      indicador.addEventListener('click', () => {
        this._irASlide(Number(indicador.dataset.indice));
        this._reiniciarTemporizador();
      });
    });
  }

  _irASlide(indice) {
    this.slideActual = indice;

    const tarjeta = this.container.querySelector('#hero-tarjeta');
    tarjeta.innerHTML = this._renderSlide(indice);

    this.container.querySelectorAll('#hero-indicadores span').forEach((indicador, i) => {
      indicador.classList.toggle('activo', i === indice);
    });
  }

  _reiniciarTemporizador() {
    this._detenerTemporizador();
    this.intervaloId = setInterval(() => {
      this._irASlide((this.slideActual + 1) % this.slides.length);
    }, this.MS_ENTRE_SLIDES);
  }

  _detenerTemporizador() {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
      this.intervaloId = null;
    }
  }
}