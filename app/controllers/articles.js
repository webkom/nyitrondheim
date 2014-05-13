var util        = require('util')
  , Article     = require('../models/article')
  , multiparty  = require('multiparty')
  , fs          = require('fs')
  , gm          = require('gm')
  , moment      = require('moment')
  , mkdirp      = require('mkdirp')
  , path        = require('path')
  , slug        = require('slug')
  , _           = require('lodash');

var handleError = function(err, req, res) {
  console.log(err);
  res.send(500, err);
};

var saveImage = function(article, image, fn) {
  var ending = path.extname(image.originalFilename);
  var unionPath = __dirname + '/../../public/images/unions/' + article.union;
  var newPath = unionPath + '/' + article._id + ending;
  var newPathCropped = unionPath + '/' + article._id + '_cropped' + ending;

  mkdirp(unionPath, function(err) {
    if (err) return fn(err);
    gm(image.path)
      .resize(500) // Resize to a width of 500px
      .noProfile()
      .write(newPathCropped, function(err) {
        if (err) return fn(err);
        article.imageCropped = newPathCropped;
        fs.rename(image.path, newPath, function(err) {
          if (err) return fn(err);
          article.image = newPath;
          article.imageName = image.originalFilename;
          return fn(null,  article);
        });
      });
  });
};

exports.load = function(req, res, next) {
  function cb(err, article) {
    if (err) return handleError(err, req, res);
    req.article = article[0];
    if (!req.article) return res.send(404, {message: 'Article Not Found'});
    next();
  }
  if (req.params.article.match(/^[0-9a-fA-F]{24}$/)) {
    Article.findById(req.params.article, req.params.union, cb);
  }
  else {
    Article.findBySlug(req.params.article, req.params.union, cb);
  }
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

    if (parsedFields.event) {
      parsedFields.start = moment(parsedFields.start.slice(1, parsedFields.start.length-1)).toDate();
      parsedFields.end = moment(parsedFields.end.slice(1, parsedFields.end.length-1)).toDate();
    }

    var article = new Article(parsedFields);
    article.union = req.params.union;
    if (!article.slug) {
      article.slug = slug(article.name);
    }

    function saveSend(err, article) {
      if (err) return handleError(err, req, res);
      article.save(function(err) {
        if (err) return handleError(err, req, res);
        res.send(201, article);
      });
    }
    if (!_.isEmpty(files)) {
      saveImage(article, files.file[0], saveSend);
    }
    else saveSend(null, article);
  });
};

exports.update = function(req, res) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    var parsedFields = {};
    _.forOwn(fields, function(value, key) {
      parsedFields[key] = value[0];
    });

    if (parsedFields.event === 'true') {
      parsedFields.start = moment(parsedFields.start.slice(1, parsedFields.start.length-1)).toDate();
      parsedFields.end = moment(parsedFields.end.slice(1, parsedFields.end.length-1)).toDate();
    }

    if (!req.article.slug) {
      req.article.slug = slug(req.article.name);
    }
    var article = util._extend(req.article, parsedFields);

    function saveSend(err, article) {
      if (err) return handleError(err, req, res);
      article.save(function(err) {
        if (err) return handleError(err, req, res);
        res.send(201, article);
      });
    }

    if (!_.isEmpty(files)) {
      saveImage(article, files.file[0], saveSend);
    }
    else saveSend(null, article);
  });
};

exports.delete = function(req, res) {
  var article = req.article;
  article.remove(function(err) {
    if (err) return handleError(err, req, res);
    res.send(204);
  });
};
