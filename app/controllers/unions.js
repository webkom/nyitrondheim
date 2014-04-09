var mongoose = require('mongoose')
  , Union    = require('../models/union')
  , passport = require('passport');

var nameOrId = function(value) {
  if (value.match(/^[0-9a-fA-F]{24}$/)) return {_id: value};
  return {name: value};
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

  Union.findOne(nameOrId(union), function(err, union) {
    if (err) return res.send(500, err);
    if (null === union) return res.send(404, {message: 'Union not found.'});
    res.send(union);
  });
};

exports.new = function(req, res) {
  var union = new Union({});
  res.render('register', {
    title: 'Registrer',
    union: union
  });
};

exports.create = function(req, res) {
  var union = new Union({name: req.body.name, description: req.body.description});
  union.save(function(err) {
    if (err) return handleError(err, req, res);
    res.send(201, union);
  });
};

exports.login = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      console.log("Login error, handle it!");
      return res.render('login', { union: req.user });
    }
    if (!user) {
      console.log("Handle it..");
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

exports.register = function(req, res) {
  var union = new Union({ name: req.body.name });

  Union.register(union, req.body.password, function(err, account) {
    if (err) {
      return res.render('register', {
        union: user
      });
    }

    passport.authenticate('local')(req, res, function() {
      res.redirect('/admin');
    });
  });
};
