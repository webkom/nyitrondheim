var async           = require('async')
  , errorHandler    = require('express-error-middleware')
  , app             = require('../../app')
  , ResetToken      = require('../models/reset-token')
  , Union           = require('../models/union')
  , sendMail        = require('../mail').sendMail;

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


function sendResetLink(email, resetLink, callback) {
  app.render('emails/reset-request', { resetLink: resetLink }, function(err, text) {
    if (err) return callback(err);
    sendMail({
      from: process.env.NOREPLY_EMAIL || 'no-reply@nyitrondheim.no',
      to: email,
      subject: 'Ny i Trondheim - Glemt Passord',
      text: text
    }, callback);
  });
}

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
      sendResetLink(req.body.email, token.token, function(err) {
        if (err) return next(err);
        res.status(201).render('request-reset', { success: true });
      });
    });
  });
};

function sendResetDone(email, callback) {
  app.render('emails/reset-done', function(err, text) {
    if (err) return callback(err);
    sendMail({
      from: process.env.NOREPLY_EMAIL || 'no-reply@nyitrondheim.no',
      to: email,
      subject: 'Ny i Trondheim - Passord Endret',
      text: text
    }, callback);
  });
}

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
      }
    ], function(err) {
      if (err) return next(err);
      req.logIn(token.union, function(err) {
        if (err) return next(err);
        res.redirect('/panel');
        sendResetDone(token.union.email, function(err) {
          if (err) console.error(err);
        });
      });
    });
  });
};
