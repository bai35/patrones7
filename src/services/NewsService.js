class NewsService {
  constructor(newsRepository) {
    this.newsRepository = newsRepository;
  }

  async listarUltimas() {
    return this.newsRepository.listarUltimas(6);
  }
}

module.exports = NewsService;
