const asyncHandler = require('../utils/asyncHandler');

class NewsController {
  constructor(newsService) {
    this.newsService = newsService;
    this.listar = asyncHandler(this.listar.bind(this));
  }

  async listar(req, res) {
    const noticias = await this.newsService.listarUltimas();
    res.json({ noticias });
  }
}

module.exports = NewsController;
