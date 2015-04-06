var async        = require('async')
  , errorHandler = require('express-error-middleware')
  , ResetToken   = require('../models/reset-token')
  , Union        = require('../models/union');

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

exports.retrieve = function(req, res, next) {
  res.json({ token: req.token });
};

exports.create = function(req, res, next) {
  if (!req.body.email) {
    return res.status(400).json({
      message: 'Email is required'
    });
  }

  Union.findOne({ email: req.body.email }, function(err, union) {
    if (err) return next(err);
    if (!union) {
      return next(new errorHandler.errors.NotFoundError());
    }

    var token = new ResetToken({ union: union._id });
    token.save(function(err, createdToken) {
      if (err) return next(err);
      // Send email here
      res.status(201).json({
        message: 'Token created'
      });
    });
  });
};

exports.reset = function(req, res, next) {
  if (!req.body.password) {
    return res.status(400).json({
      message: 'Password is required'
    });
  }

  function done(err) {
    if (err) return next(err);
    res.json({
      message: 'Password reset'
    });
  }

  req.token.populate('union', function(err, token) {
    if (err) return done(err);
    async.series([
      function(callback) {
        token.union.setPassword(req.body.password, callback);
      },
      function(callback) {
        req.token.remove(callback);
      } // Send email here
    ], done);
  });
};
