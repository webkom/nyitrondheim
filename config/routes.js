var articles  = require('../app/controllers/articles')
  , unions    = require('../app/controllers/unions')
  , Union     = require('../app/models/union')
  , passport  = require('passport');

module.exports = function(app) {

  app.param('slug', articles.load);

  app.get('/', function(req, res) {
    res.render('index');
  });
  app.get('/partials/:partial', function(req, res) {
    res.render('partials/' + req.param('partial').replace('.', '/'));
  });
  app.get('/admin', ensureAuthenticated, function(req, res) {
    res.render('admin', {
      union: req.user,
      title: 'Artikler'
    });
  });
  app.get('/login', function(req, res) {
    if (!req.isAuthenticated()) {
      return res.render('login', { union: req.user });
    }
    res.redirect('/admin');
  });

  app.post('/login', unions.login);
  app.get('/logout', ensureAuthenticated, unions.logout);

  app.get('/register', ensureAuthenticated, unions.new);

  app.post('/register', ensureAuthenticated, unions.register);

  app.get('/api/unions/:union', unions.show);
  app.get('/api/unions'       , unions.list);
  app.post('/api/unions'      , ensureAuthenticated, unions.create);

  app.get('/api/unions/:union/articles' , articles.getUnionArticles);
  app.post('/api/unions/:union/articles', ensureAuthenticated, articles.create);

  app.get('/api/unions/:union/articles/:slug', articles.show);
  app.put('/api/unions/:union/articles/:slug', ensureAuthenticated, articles.update);
  app.del('/api/unions/:union/articles/:slug', ensureAuthenticated, articles.delete);

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
  }
};
