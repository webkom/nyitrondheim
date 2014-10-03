exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

exports.ensureAdmin = function(req, res, next) {
  if (req.user.school === 'admin') return next();
  res.redirect('/panel');
};
