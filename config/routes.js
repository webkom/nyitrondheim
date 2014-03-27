var frontpage = require('../app/controllers/frontpage.js');

module.exports = function(app) {
  app.get('/api/frontpage', frontpage.getUnionArticles);
};