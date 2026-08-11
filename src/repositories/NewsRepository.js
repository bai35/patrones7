const News = require('../models/News');

class NewsRepository {
  async listarUltimas(limite = 6) {
    return News.find().sort({ fechaPublicacion: -1 }).limit(limite);
  }

  async eliminarTodas() {
    return News.deleteMany({});
  }

  async insertarVarias(items) {
    return News.insertMany(items);
  }
}

module.exports = NewsRepository;
