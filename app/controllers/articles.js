var gm = require('gm'),
  path = require('path'),
  slug = require('slug'),
  _ = require('lodash'),
  errorHandler = require('express-error-middleware'),
  Article = require('../models/article'),
  helpers = require('./helpers'),
  adminNotification = helpers.adminNotification,
  sentryError = helpers.sentryError;

var saveImage = function(article, image, done) {
  var unionFolder = path.dirname(image.path);
  var parts = image.filename.split('.');

  var extension = parts[parts.length - 1];
  var name = parts.slice(0, parts.length - 1).join('.');
  var croppedFile = name + '_cropped.' + extension;
  var newPath = path.resolve(unionFolder, croppedFile);

  gm(image.path)
    .resize(350, null, '>')
    .noProfile()
    .write(newPath, function(err) {
      if (err) return done(err);
      var base = 'unions/';
      article.image = base + image.filename;
      article.imageCropped = base + croppedFile;
      article.imageName = image.originalname;
      return done(null, article);
    });
};

exports.load = function(req, res, next) {
  function cb(err, article) {
    if (err) return next(err);
    req.article = article[0];
    if (!req.article) {
      return next(new errorHandler.errors.NotFoundError());
    }

    next();
  }

  Article.findBySlugOrId(req.params.article, req.params.union, cb);
};

exports.show = function(req, res, next) {
  res.send(req.article);
};

exports.all = function(req, res, next) {
  var limit = req.query.limit | 0;
  Article.listAll(limit, function(err, articles) {
    if (err) return next(err);
    res.send(articles);
  });
};

exports.getUnionArticles = function(req, res, next) {
  var limit = req.query.limit | 0;
  Article.listUnionArticles(limit, req.params.union, function(err, articles) {
    if (err) return next(err);
    res.send(articles);
  });
};

exports.getUnionEvents = function(req, res, next) {
  var limit = req.query.limit | 0;
  Article.listUnionEvents(limit, req.params.union, function(err, articles) {
    if (err) return next(err);
    res.send(articles);
  });
};

function articleNotification(article, verb) {
  article.populate('union', function(err, populated) {
    if (err) return sentryError(err);
    var type = populated.event ? 'Event' : 'Article';
    var message =
      type +
      ' "' +
      populated.title +
      '" ' +
      verb +
      '.\n' +
      'Author: ' +
      populated.union.name +
      '\n\n' +
      'Description:\n' +
      populated.description +
      '\n\n' +
      'Content:\n' +
      populated.body;
    adminNotification(message);
  });
}

var saveArticle = function(req, res, next) {
  var update = req.method === 'PUT';
  var article;
  if (update) {
    article = _.assign(req.article, req.body);
    article.lastModified = Date.now();
  } else {
    article = new Article(req.body);
    article.union = req.params.union;
  }

  article.slug = article.slug || slug(article.title).toLowerCase();

  function save(err, savedArticle) {
    if (err) return next(err);

    savedArticle.save(function(err, createdArticle) {
      if (err) return next(err);

      // Send 201 if it's a new article
      res.status(update ? 200 : 201);
      res.json(createdArticle);

      var verb = update ? 'updated' : 'created';
      articleNotification(savedArticle, verb);
    });
  }

  if (req.file) {
    saveImage(article, req.file, save);
  } else {
    save(null, article);
  }
};

exports.create = function(req, res, next) {
  saveArticle(req, res, next);
};

exports.update = function(req, res, next) {
  saveArticle(req, res, next);
};

exports.delete = function(req, res, next) {
  var article = req.article;
  article.remove(function(err) {
    if (err) return next(err);
    res.status(204).send();
    articleNotification(article, 'deleted');
  });
};
