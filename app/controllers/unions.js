var util = require('util'),
  passport = require('passport'),
  slug = require('slug'),
  errorHandler = require('express-error-middleware'),
  Union = require('../models/union');

var allowedFields = 'name slug program _id school description email';

exports.list = function(req, res, next) {
  Union.find({}, allowedFields, function(err, unions) {
    if (err) return next(err);
    res.send(unions);
  });
};

exports.show = function(req, res, next) {
  Union.findBySlugOrId(req.params.union, allowedFields, function(err, union) {
    if (err) return next(err);
    if (!union) {
      return next(new errorHandler.errors.NotFoundError());
    }

    res.send(union);
  });
};

exports.login = function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) return next(err);
    if (!user) {
      res.status(401);
      return res.render('login', { login_error: true });
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/admin');
    });
  })(req, res, next);
};

exports.logout = function(req, res, next) {
  req.logout();
  res.redirect('/');
};

exports.create = function(req, res, next) {
  var password = req.body.password;
  delete req.body.password;
  req.body.slug = slug(req.body.name).toLowerCase();
  var union = new Union(req.body);
  Union.register(union, password, function(err) {
    if (err) return next(err);
    res.status(201).send(union);
  });
};

exports.update = function(req, res, next) {
  Union.findBySlugOrId(req.params.union, function(err, union) {
    if (err) return next(err);
    if (!union) {
      return next(new errorHandler.errors.NotFoundError());
    }

    function save(union) {
      if (!req.body.slug) {
        req.body.slug = slug(req.body.name);
      }
      union = util._extend(union, req.body);
      union.save(function(err) {
        if (err) return next(err);
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
    } else {
      save(union);
    }
  });
};

exports.delete = function(req, res, next) {
  Union.findBySlugOrId(req.params.union, function(err, union) {
    if (err) return next(err);
    if (!union) {
      return next(new errorHandler.errors.NotFoundError());
    }

    union.remove(function(err) {
      if (err) return next(err);
      res.status(204).send();
    });
  });
};
