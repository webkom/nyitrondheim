var mongoose = require('mongoose')
  , Article  = mongoose.model('Article')
  ;

exports.getUnionArticles = function(req, res) {
  var numberOfArticles = 4;
  Article.listUnionArticles(numberOfArticles, "Abakus", function(err, articles) {
    if (err) return res.render('500');
    console.log('her', articles);
    res.send(articles);
    // Send the articles as JSON with title, short description and small image.
  })
}