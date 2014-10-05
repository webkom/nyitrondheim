var express             = require('express')
  , helpers             = require('./helpers')
  , ensureAuthenticated = helpers.ensureAuthenticated
  , articles            = require('../../app/controllers/articles')
  , unions              = require('../../app/controllers/unions');

var router = express.Router();

router.param('article', articles.load);

router.get('/articles', articles.all);

router.get('/unions/:union', unions.show);
router.get('/unions'       , unions.list);
router.post('/unions'      , ensureAuthenticated, unions.create);
router.put('/unions/:union', ensureAuthenticated, unions.update);
router.delete('/unions/:union', ensureAuthenticated, unions.delete);

router.get('/unions/:union/articles' , articles.getUnionArticles);
router.post('/unions/:union/articles', ensureAuthenticated, articles.create);

router.get('/unions/:union/events', articles.getUnionEvents);

router.get('/unions/:union/articles/:article', articles.show);
router.put('/unions/:union/articles/:article', ensureAuthenticated, articles.update);
router.delete('/unions/:union/articles/:article', ensureAuthenticated, articles.delete);

router.use(function(req, res) {
  res.status(404).send({
    error: 'Bad API call.',
    status: 404
  });
});

module.exports = router;
