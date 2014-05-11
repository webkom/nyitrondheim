var util        = require('util')
  , Union    = require('../models/union')
  , passport = require('passport');

var nameOrId = function(value) {
  if (value.match(/^[0-9a-fA-F]{24}$/)) return {_id: value};
  return {name: value};
};

var slugOrId = function(value) {
  if (value.match(/^[0-9a-fA-F]{24}$/)) return {_id: value};
  return {slug: value};
};

var handleError = function(err, req, res) {
  console.log(err);
  res.send(500, err);
};

exports.list = function(req, res) {
  Union.find({}, function(err, unions) {
    if (err) return handleError(err, req, res);
    res.send(unions);
  });
};

exports.show = function(req, res) {
  var union = req.params.union;

  Union.findOne(slugOrId(union), function(err, union) {
    if (err) return res.send(500, err);
    if (null === union) return res.send(404, {message: 'Union not found.'});
    res.send(union);
  });
};

exports.login = function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) {
      console.log("Login error, handle it!");
      return res.render('login', { union: req.user });
    }
    if (!user) {
      console.log("User doesn't exist?", user);
      return res.render('login');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/admin');
    });
  })(req, res, next);
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

exports.create = function(req, res) {
  console.log(req.body);
  var password = req.body.password;
  delete req.body.password;
  var union = new Union(req.body);
  Union.register(union, password, function (err) {
    if (err) return handleError(err, req, res);
    res.send(201, union);
  });
};

exports.update = function(req, res) {
  Union.findById(req.params.union, function(err, union) {
    if (err) return handleError(err, req, res);
    if (!union) return res.send(404, {message: 'Union Not Found'});
    function save(union) {
      union = util._extend(union, req.body);
      union.save(function (err) {
        if (err) return handleError(err, req, res);
        res.send(200, union);
      });
    }
    if (req.body.password) {
      union.setPassword(req.body.password, function(err, user) {
        delete req.body.password;
        delete req.body.hash;
        delete req.body.salt;
        user.save(function(err, union) {
          if (err) return handleError(err, req, res);
          save(union);
        });
      });
    }
    else {
      save(union);
    }
  });
};

exports.delete = function(req, res) {
  Union.findById(req.params.union, function(err, union) {
    if (err) return handleError(err, req, res);
    if (!union) return res.send(404, {message: 'Union Not Found'});
    union.remove(function(err) {
      if (err) return handleError(err, req, res);
      res.send(204);
    });
  });
};
