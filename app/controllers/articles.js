var mongoose = require('mongoose')
    , Article  = mongoose.model('Article')
    ;


exports.getArticles = function(req, res) {

  Article.findBySlug(req.params.slug,req.query,function(err,articles){
    if (err) return res.render('500');
    res.send(articles);
  });

}

