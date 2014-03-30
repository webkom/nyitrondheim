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


