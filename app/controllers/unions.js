var util        = require('util')
  , passport    = require('passport')
  , slug        = require('slug')
  , _           = require('lodash')
  , Union       = require('../models/union')
  , handleError = require('./errors').handleError;

var nameOrId = function(value) {
  if (value.match(/^[0-9a-fA-F]{24}$/)) return {_id: value};
  return {name: value};
};

var slugOrId = function(value) {
  if (value.match(/^[0-9a-fA-F]{24}$/)) return {_id: value};
  return {slug: value};
};

exports.list = function(req, res) {
  Union.find({}, 'name slug program _id school description', function(err, unions) {
    if (err) return handleError(err, res);
    res.send(unions);
  });
};

exports.show = function(req, res) {
  var union = req.params.union;

  Union.findOne(slugOrId(union), 'name slug program _id school description', function(err, union) {
    if (err) return handleError(err, res);
    if (null === union) return res.status(404).send({ message: 'Union not found.' });
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
  var password = req.body.password;
  delete req.body.password;
  req.body.slug = slug(req.body.name).toLowerCase();
  var union = new Union(req.body);
  Union.register(union, password, function (err) {
    if (err) return handleError(err, res);
    res.status(201).send(union);
  });
};

exports.update = function(req, res) {
  Union.findOne(slugOrId(req.params.union), function(err, union) {
    if (err) return handleError(err, res);
    if (!union) return res.status(404).send({ message: 'Union Not Found' });
    function save(union) {
      if (!req.body.slug) {
        req.body.slug = slug(req.body.name);
      }
      union = util._extend(union, req.body);
      union.save(function (err) {
        if (err) return handleError(err, res);
        res.status(200).send(union);
      });
    }
    if (req.body.password) {
      union.setPassword(req.body.password, function(err, user) {
        delete req.body.password;
        delete req.body.hash;
        delete req.body.salt;
        save(user);
      });
    }
    else {
      save(union);
    }
  });
};

exports.delete = function(req, res) {
  Union.findOne(slugOrId(req.params.union), function(err, union) {
    if (err) return handleError(err, res);
    if (!union) return res.send(404, { message: 'Union Not Found' });
    union.remove(function(err) {
      if (err) return handleError(err, res);
      res.status(204).send();
    });
  });
};
