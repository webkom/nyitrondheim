var articles  = require('../app/controllers/articles')
  , unions    = require('../app/controllers/unions')
  , Union     = require('../app/models/union.js')
  , passport  = require('passport');

module.exports = function(app) {

  app.param('slug', articles.load);

  app.get('/', function(req, res) {
    res.render('index');
  });
  app.get('/partials/:partial', function(req, res) {
    res.render('partials/' + req.param('partial').replace('.', '/'));
  });
  app.get('/admin', function(req, res) {
    res.render('admin');
  });
  app.get('/login', function(req, res) {
    res.render('login', { user: req.user });
  });
  app.post('/login', unions.login);
  app.get('/logout', unions.logout);

  app.get('/register', function(req, res) {
    // dunno if this should be in the union-controller
    res.render('register', {});
  });

  app.post('/register', unions.register);

  app.get('/api/unions/:union', unions.show);
  app.get('/api/unions'       , unions.list);
  app.post('/api/unions'      , unions.create);

  app.get('/api/unions/:union/articles' , articles.getUnionArticles);
  app.post('/api/unions/:union/articles', articles.create);

  app.get('/api/unions/:union/articles/:slug', articles.show);
  app.put('/api/unions/:union/articles/:slug', articles.update);
  app.del('/api/unions/:union/articles/:slug', articles.delete);

};
