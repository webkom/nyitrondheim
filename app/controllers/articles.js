var gm          = require('gm')
  , path        = require('path')
  , slug        = require('slug')
  , _           = require('lodash')
  , Article     = require('../models/article')
  , handleError = require('./errors').handleError;

var saveImage = function(article, image, done) {
  var unionFolder = path.dirname(image.path);
  var croppedFile = image.name.split('.')[0] + '_cropped.' + image.extension;
  var newPath = path.resolve(unionFolder, croppedFile);

  gm(image.path)
      .resize(350, null, '>')
      .noProfile()
      .write(newPath, function(err) {
        if (err) return done(err);
        var base = 'unions/';
        article.image = base + image.name;
        article.imageCropped = base + croppedFile;
        article.imageName = image.originalname;
        return done(null, article);
      });
};

exports.load = function(req, res, next) {
  function cb(err, article) {
    if (err) return handleError(err, res);
    req.article = article[0];
    if (!req.article) return res.status(404).send({message: 'Article Not Found'});
    next();
  }

  Article.findBySlugOrId(req.params.article, req.params.union, cb);
};

exports.show = function(req, res) {
  res.send(req.article);
};

exports.all = function(req, res) {
  var limit = req.query.limit|0;
  Article.listAll(limit, function(err, articles) {
    if (err) return handleError(err, res);
    res.send(articles);
  });
};

exports.getUnionArticles = function(req, res) {
  var limit = req.query.limit|0;
  Article.listUnionArticles(limit, req.params.union, function(err, articles) {
    if (err) return handleError(err, res);
    res.send(articles);
  });
};

exports.getUnionEvents = function(req, res) {
  var limit = req.query.limit|0;
  Article.listUnionEvents(limit, req.params.union, function(err, articles) {
    if (err) return handleError(err, res);
    res.send(articles);
  });
};

var saveArticle = function(req, res) {
  var update = req.method === 'PUT';

  var article;
  if (update) {
    article = _.assign(req.article, req.body);
  } else {
    article = new Article(req.body);
    article.union = req.params.union;
  }

  article.slug = article.slug || slug(article.title).toLowerCase();

  function save(err, saveArticle) {
    if (err) return handleError(err, res);

    saveArticle.save(function(err, createdArticle) {
      if (err) return handleError(err, res);

      // Send 201 if it's a new article
      res.status(update ? 200 : 201);
      res.json(createdArticle);
    });
  }

  if (req.files.file) {
    saveImage(article, req.files.file, save);
  } else {
    save(null, article);
  }
};

exports.create = function(req, res) {
  saveArticle(req, res);
};

exports.update = function(req, res) {
  saveArticle(req, res);
};

exports.delete = function(req, res) {
  var article = req.article;
  article.remove(function(err) {
    if (err) return handleError(err, res);
    res.status(204).send();
  });
};
