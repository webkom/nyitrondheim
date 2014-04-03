var articles  = require('../app/controllers/articles')
  , unions    = require('../app/controllers/unions');

module.exports = function(app) {

  app.param('slug', articles.load);

  app.get('/api/unions/:union', unions.show);
  app.get('/api/unions'       , unions.list);
  app.post('/api/unions'      , unions.create);

  app.get('/api/unions/:union/articles' , articles.getUnionArticles);
  app.post('/api/unions/:union/articles', articles.create);

  app.get('/api/unions/:union/articles/:slug', articles.show);
  app.put('/api/unions/:union/articles/:slug', articles.update);
  app.del('/api/unions/:union/articles/:slug', articles.delete);

};
