var articles  = require('../app/controllers/articles')
  , unions    = require('../app/controllers/unions')
  , Union     = require('../app/models/union')
  , passport  = require('passport');

var ensureAuthenticated = exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

var ensureAdmin = exports.ensureAdmin = function(req, res, next) {
  if (req.user.school === 'admin') return next();
  res.redirect('/panel');
};

exports.routes = function(app) {
  app.param('article', articles.load);

  app.get('/partials/*', function(req, res) {
    res.render('partials/' + req.params[0]);
  });

  app.get('/panel', ensureAuthenticated, function(req, res) {
    res.render('panel', {
      union: req.user
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
  app.delete('/api/unions/:union', ensureAuthenticated, unions.delete);

  app.get('/api/unions/:union/articles' , articles.getUnionArticles);
  app.post('/api/unions/:union/articles', ensureAuthenticated, articles.create);

  app.get('/api/unions/:union/events', articles.getUnionEvents);

  app.get('/api/unions/:union/articles/:article', articles.show);
  app.put('/api/unions/:union/articles/:article', ensureAuthenticated, articles.update);
  app.delete('/api/unions/:union/articles/:article', ensureAuthenticated, articles.delete);
};
