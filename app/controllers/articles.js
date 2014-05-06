var mongoose    = require('mongoose')
  , util        = require('util')
  , Article     = require('../models/article')
  , multiparty  = require('multiparty')
  , fs          = require('fs')
  , gm          = require('gm')
  , slug        = require('slug')
  , _           = require('lodash');

var handleError = function(err, req, res) {
  console.log(err);
  res.send(500, err);
};

var saveImage = function(updatedArticle, image, req, res) {
  var arr = image.originalFilename.split('.');
  var ending = '.' + arr[arr.length-1];
  var newPath = __dirname + '/../../public/images/articles/' + req.params.union + '/' + updatedArticle._id + ending;
  var newPathCropped = __dirname + '/../../public/images/articles/' + req.params.union + '/' + updatedArticle._id + '_cropped' + ending;
  fs.exists(__dirname + '/../../public/images/articles/' + req.params.union, function(exists) {
    function cb() {
      gm(image.path)
        .resize(500) // Resize to a width of 500px
        .noProfile()
        .write(newPathCropped, function(err) {
          if (err) return handleError(err, req, res);
          updatedArticle.imageCropped = newPathCropped;
          fs.rename(image.path, newPath, function(err) {
            if (err) return handleError(err, req, res);
            updatedArticle.image = newPath;
            updatedArticle.save(function (err) {
              // maybe do it sync instead and only save the article once
              if (err) return handleError(err, req, res);
              res.send(201, updatedArticle);
            });
          });
        });
    }
    if (!exists) {
      fs.mkdir(__dirname + '/../../public/images/articles/' + req.params.union, function(err) {
        if (err) return handleError(err, req, res);
        cb();
      });
    }
    else cb();
  });
}

exports.load = function(req, res, next, id) {
  Article.findBySlug(req.params.slug, req.params.union, function(err, article) {
    if (err) return handleError(err, req, res);
    req.article = article[0];
    if (!req.article) return res.send(404, {message: 'Article Not Found'});
    next();
  });
};

exports.show = function(req, res) {
  res.send(req.article);
};

exports.all = function(req, res) {
  var limit = req.query.limit|0;
  Article.listAll(limit, function(err, articles) {
    if (err) return handleError(err, req, res);
    res.send(articles);
  });
};

exports.getUnionArticles = function(req, res) {
  var limit = req.query.limit|0;
  Article.listUnionArticles(limit, req.params.union, function(err, articles) {
    if (err) return handleError(err, req, res);
    res.send(articles);
  });
};

exports.getUnionEvents = function(req, res) {
  var limit = req.query.limit|0;
  Article.listUnionEvents(limit, req.params.union, function(err, articles) {
    if (err) return handleError(err, req, res);
    res.send(articles);
  });
};

exports.create = function(req, res) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    var parsedFields = {};
    _.forOwn(fields, function(value, key) {
      parsedFields[key] = value[0];
    });
    var article = new Article(parsedFields);
    article.union = req.params.union;
    article.save(function (err) {
      if (err) return handleError(err, req, res);
      if (!_.isEmpty(files)) saveImage(article, files.file[0], req, res);
      res.send(201, article);
    });
  });
};

exports.update = function(req, res) {
  var article = util._extend(req.article, req.body);
  article.save(function (err) {
    if (err) return handleError(err, req, res);
    res.send(200, article);
  });
};

exports.delete = function(req, res) {
  var article = req.article;
  article.remove(function(err) {
    if (err) return handleError(err, req, res);
    res.send(204);
  });
};
