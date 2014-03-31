var mongoose = require('mongoose')
    , Article  = mongoose.model('Article')
    ;

exports.getArticleBySlug = function(req, res) {
  Article.findBySlug(req.params.slug, req.params.union, function(err,articles){
    if (err) return res.render('500');
    res.send(articles);
  });
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
  res.render('new_article', {
    title: 'Submit Test',
    union_id: req.params.union,
    article: new Article({})
  });
}

exports.create = function(req, res) {
  var article = new Article(req.body);
  article.union_id = req.params.union;
  article.save(function (err) {
    if (err) return handleError(err);
    console.log('Saved article');
    res.redirect('/api/unions/' + article.union_id + '/articles');
  });
}