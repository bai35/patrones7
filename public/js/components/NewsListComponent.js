import Component from '../core/Component.js';

export default class NewsListComponent extends Component {
  constructor(selector, newsService) {
    super(selector);
    this.newsService = newsService;
  }

  async render() {
    try {
      const noticias = await this.newsService.listar();
      if (!noticias.length) return '<p>No hay noticias disponibles.</p>';

      return noticias
        .map(
          (n) => `
          <div class="producto-card">
            <h3>${n.titulo}</h3>
            <p>${n.resumen}</p>
          </div>
        `
        )
        .join('');
    } catch (error) {
      return `<p>${error.message}</p>`;
    }
  }
}
