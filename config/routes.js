var articles  = require('../app/controllers/articles')
  , unions    = require('../app/controllers/unions')
  , Union     = require('../app/models/union')
  , passport  = require('passport');

var ensureAuthenticated = module.exports.ensureAuthenticated =  function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

var ensureAdmin = module.exports.ensureAdmin =  function(req, res, next) {
  if (req.user.name === 'admin') return next();
  res.redirect('/panel');
};

module.exports.routes = function(app) {
  app.param('slug', articles.load);

  app.get('/partials/:partial', function(req, res) {
    res.render('partials/' + req.param('partial').replace('.', '/'));
  });

  app.get('/partials/admin/:partial', function(req, res) {
    res.render('partials/admin/' + req.param('partial'));
  });

  app.get('/panel', ensureAuthenticated, function(req, res) {
    res.render('panel', {
      union: req.user,
    });
  });

  app.get('/login', function(req, res) {
    if (!req.isAuthenticated()) {
      return res.render('login', { union: req.user });
    }
    ensureAdmin(req, res, function() {
      res.redirect('/admin');
    });
  });
  app.post('/login', unions.login);

  app.get('/logout', ensureAuthenticated, unions.logout);

  app.get('/api/articles', articles.all);

  app.get('/api/unions/:union', unions.show);
  app.get('/api/unions'       , unions.list);
  app.post('/api/unions'      , ensureAuthenticated, unions.create);
  app.put('/api/unions/:union', ensureAuthenticated, unions.update);
  app.del('/api/unions/:union', ensureAuthenticated, unions.delete);

  app.get('/api/unions/:union/articles' , articles.getUnionArticles);
  app.post('/api/unions/:union/articles', ensureAuthenticated, articles.create);

  app.get('/api/unions/:union/events', articles.getUnionEvents);

  app.get('/api/unions/:union/articles/:slug', articles.show);
  app.put('/api/unions/:union/articles/:slug', ensureAuthenticated, articles.update);
  app.del('/api/unions/:union/articles/:slug', ensureAuthenticated, articles.delete);
};
