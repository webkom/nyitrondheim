var async           = require('async')
  , errorHandler    = require('express-error-middleware')
  , ResetToken      = require('../models/reset-token')
  , Union           = require('../models/union');

exports.load = function(req, res, next, token) {
  ResetToken.findOne({ token: req.params.token })
    .populate('union')
    .exec(function(err, token) {
      if (err) return next(err);
      if (!token) {
        return next(new errorHandler.errors.NotFoundError());
      }

      req.token = token;
      next();
    });
};

exports.create = function(req, res, next) {
  if (!req.body.email) {
    return res.status(400).render('request-reset', { error: 'Epost er nødvendig' });
  }

  Union.findOne({ email: req.body.email }, function(err, union) {
    if (err) return next(err);
    if (!union) {
      return res
        .status(404)
        .render('request-reset', {
          error: 'Denne eposten finnes ikke'
        });
    }

    ResetToken.newToken(union._id, function(err, token) {
      if (err) return next(err);
      // Send email here
      res.status(201).render('request-reset', { success: true });
    });
  });
};

exports.reset = function(req, res, next) {
  if (!req.body.password) {
    return res.render('reset-password', { error: 'Passord er nødvendig' });
  }

  req.token.populate('union', function(err, token) {
    if (err) return next(err);
    async.series([
      function(callback) {
        token.union.setPassword(req.body.password, function(err, union) {
          if (err) return next(err);
          union.save(callback);
        });
      },
      function(callback) {
        req.token.remove(callback);
      } // Send email here
    ], function(err) {
      if (err) return next(err);
      req.logIn(token.union, function(err) {
        if (err) return next(err);
        res.redirect('/panel');
      });
    });
  });
};
