var mongoose = require('mongoose')
    , util   = require('util')
    , Article  = mongoose.model('Article')
    ;


exports.load = function(req, res, next, id) {
  Article.findBySlug(req.params.slug, req.params.union, function(err, article) {
    if (err) return res.render('500');
    req.article = article[0];
    next();
  });

};

exports.show = function(req, res) {
  res.send(req.article);
}

exports.getUnionArticles = function(req, res) {
  var limit = parseInt(req.query.limit);
  if (isNaN(limit)) {
    limit = 0;
  }
  Article.listUnionArticles(limit, req.params.union, function(err, articles) {
    if (err) return res.render('500');
    res.send(articles);
  });
}

exports.new = function(req, res) {
  var article = new Article({});
  article.union_id = req.params.union;

  res.render('new_article', {
    title: 'Submit Test',
    article: article
  });
}

exports.create = function(req, res) {
  var article = new Article(req.body);
  article.union_id = req.params.union;
  article.save(function (err) {
    if (err) return console.log(err);
    console.log('Saved article');
    res.redirect('/api/unions/' + article.union_id + '/articles');
  });
}

exports.edit = function(req, res) {
  res.render('new_article', {
    title: "Endre Artikkel",
    article: req.article,
  });
}

exports.update = function(req, res) {
  article = util._extend(req.article, req.body);
  article.save(function (err) {
    if (err) return console.log(err);
    console.log('Updated article');
    res.redirect('/api/unions/' + article.union_id + '/articles/' + article.slug);
  });
}

exports.delete = function(req, res) {
  var article = req.article;
  article.remove(function(err) {
    // Should probably flash a message or something too.
    console.log('Article deleted');
    res.redirect('/api/unions/' + article.union_id + '/articles');
  });
}