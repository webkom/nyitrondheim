var articles  = require('../app/controllers/articles.js')
  , unions    = require('../app/controllers/unions.js')
  , url       = require('url')
  ;
module.exports = function(app) {

  app.param('slug', articles.load);

  app.get('/api/unions/:union', unions.getUnion);

  app.get('/api/unions/:union/articles', articles.getUnionArticles);
  app.post('/api/unions/:union/articles', articles.create);

  app.get('/api/unions/:union/articles/new', articles.new);

  app.get('/api/unions/:union/articles/:slug', articles.show);
  app.put('/api/unions/:union/articles/:slug', articles.update);
  app.del('/api/unions/:union/articles/:slug', articles.delete);

  app.get('/api/unions/:union/articles/:slug/edit', articles.edit);

};