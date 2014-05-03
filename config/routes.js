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
  app.get('/calendar', function(req, res) {
    res.render('calendar');
  });
  app.get('/admin', ensureAuthenticated, function(req, res) {
    res.render('admin', {
      union: req.user,
      title: 'Artikler og arrangement'
    });
  });
  app.get('/superadmin', ensureAuthenticated, ensureAdmin, function(req, res) {
    res.render('superadmin', {
      union: req.user,
      title: 'Artikler og arrangement'
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

  app.get('/api/articles', articles.all);

  app.get('/api/unions/:union', unions.show);
  app.get('/api/unions'       , unions.list);
  app.post('/api/unions'      , ensureAuthenticated, unions.create);

  app.get('/api/unions/:union/articles' , articles.getUnionArticles);
  app.post('/api/unions/:union/articles', ensureAuthenticated, articles.create);

  app.get('/api/unions/:union/events', articles.getUnionEvents);

  app.get('/api/unions/:union/articles/:slug', articles.show);
  app.put('/api/unions/:union/articles/:slug', ensureAuthenticated, articles.update);
  app.del('/api/unions/:union/articles/:slug', ensureAuthenticated, articles.delete);

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
  }

  function ensureAdmin(req, res, next) {
    if (req.user.name === 'admin') return next();
    res.redirect('/admin');
  }
};
