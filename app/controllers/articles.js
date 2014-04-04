var mongoose = require('mongoose')
  , util     = require('util')
  , Article  = require('../models/article');

var handleError = function(err, req, res) {
  console.log(err);
  res.send(500, err);
};

exports.load = function(req, res, next, id) {
  Article.findBySlug(req.params.slug, req.params.union, function(err, article) {
    if (err) return handleError(err, req, res);
    req.article = article[0];
    if (!req.article) return res.send(404, {message: "Article Not Found"});
    next();
  });
};

exports.show = function(req, res) {
  res.send(req.article);
};

exports.getUnionArticles = function(req, res) {
  var limit = req.query.limit|0;
  Article.listUnionArticles(limit, req.params.union, function(err, articles) {
    if (err) return handleError(err, req, res);
    res.send(articles);
  });
};

exports.create = function(req, res) {
  var article = new Article(req.body);
  article.union = req.params.union;
  article.save(function (err) {
    if (err) return handleError(err, req, res);
    res.send(201, article);
  });
};

exports.update = function(req, res) {
  article = util._extend(req.article, req.body);
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
