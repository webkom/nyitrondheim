var util        = require('util')
  , multiparty  = require('multiparty')
  , fs          = require('fs')
  , gm          = require('gm')
  , moment      = require('moment')
  , mkdirp      = require('mkdirp')
  , path        = require('path')
  , slug        = require('slug')
  , _           = require('lodash')
  , Article     = require('../models/article')
  , handleError = require('./errors').handleError;

var saveImage = function(article, image, done) {
  var ending = path.extname(image.originalFilename);
  var unionPath = __dirname + '/../../public/images/unions/' + article.union;
  var newPath = '/' + article._id + ending;
  var newPathCropped = '/' + article._id + '_cropped' + ending;

  mkdirp(unionPath, function(err) {
    if (err) return done(err);
    gm(image.path)
      .resize(350, null, '>') // Resize to a width of 500px
      .noProfile()
      .write(unionPath + newPathCropped, function(err) {
        if (err) {
          return done(err);
        }
        article.imageCropped = 'unions/' + article.union + newPathCropped;
        fs.rename(image.path, unionPath + newPath, function(err) {
          if (err) return done(err);
          article.image = 'unions/' + article.union + newPath;
          article.imageName = image.originalFilename;
          return done(null, article);
        });
      });
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

var saveForm = function(req, res, create) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    var parsedFields = {};
    _.forOwn(fields, function(value, key) {
      parsedFields[key] = value[0];
    });

    // Bool is turned into a string so need to strict compare it to true..
    if (parsedFields.event && parsedFields.event === 'true') {
      parsedFields.start = moment(parsedFields.start.slice(1, parsedFields.start.length-1)).toDate();
      parsedFields.end = moment(parsedFields.end.slice(1, parsedFields.end.length-1)).toDate();
    }

    var article;
    if (create) {
      article = new Article(parsedFields);
      article.union = req.params.union;

      if (article.slug === undefined || !article.slug.length) {
        article.slug = slug(article.title).toLowerCase();
      }
    }
    else {
      article = util._extend(req.article, parsedFields);
      // Kind of hacky, but if you remove an image it needs to go from the document somehow.
      _.each(article._doc, function(value, key) {
        if (value === 'null') {
          article._doc[key] = undefined;
        }
      });
    }

    function saveSend(err, article) {
      if (err) return handleError(err, res);
      article.save(function(err) {
        if (err) return handleError(err, res);
        var status = create ? 201 : 200;
        res.status(status).send(article);
      });
    }
    if (!_.isEmpty(files)) {
      saveImage(article, files.file[0], saveSend);
    }
    else saveSend(null, article);
  });
};

exports.create = function(req, res) {
  saveForm(req, res, true);
};

exports.update = function(req, res) {
  saveForm(req, res, false);
};

exports.delete = function(req, res) {
  var article = req.article;
  article.remove(function(err) {
    if (err) return handleError(err, res);
    res.status(204).send();
  });
};
