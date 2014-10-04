var unions              = require('../../app/controllers/unions')
  , helpers             = require('./helpers')
  , apiRoutes           = require('./api')
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
};
