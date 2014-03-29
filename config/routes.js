var frontpage = require('../app/controllers/frontpage.js')
    ,articles  = require('../app/controllers/articles.js')
    ,unions    = require('../app/controllers/unions.js');




module.exports = function(app) {


  app.get('/api/frontpage', frontpage.getUnionArticles);

  app.get('/api/articles/:slug', articles.getArticles);

  app.get('/api/unions/:union', unions.getUnion);



};