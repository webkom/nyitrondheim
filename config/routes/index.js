var unions              = require('../../app/controllers/unions')
  , helpers             = require('./helpers')
  , apiRoutes           = require('./api')
  , resetPassword       = require('../../app/controllers/reset-password')
  , ensureAuthenticated = helpers.ensureAuthenticated
  , ensureAdmin         = helpers.ensureAdmin;


module.exports = function(app) {
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

  app.use('/api', apiRoutes);

  app.param('token', resetPassword.load);

  app.get('/reset-password', function(req, res) {
    res.render('request-reset');
  });

  app.get('/reset-password/:token', function(req, res) {
    res.render('reset-password', { token: req.params.token });
  });

  app.post('/reset-password', resetPassword.create);

  app.post('/reset-password/:token', resetPassword.reset);

};
