var express             = require('express')
  , errorHandler        = require('express-error-middleware')
  , multer              = require('multer')
  , path                = require('path')
  , crypto              = require('crypto')
  , helpers             = require('./helpers')
  , ensureAuthenticated = helpers.ensureAuthenticated
  , articles            = require('../../app/controllers/articles')
  , unions              = require('../../app/controllers/unions');

var EXTENSION_LOOKUP = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif'
};

var router = express.Router();
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve('public', 'images', 'unions'));
  },
  filename: function (req, file, cb) {
    // multer doesn't figure out the extension, so let's make a guess:
    var extension = EXTENSION_LOOKUP[file.mimetype];
    var filename = crypto.randomBytes(16).toString('hex');
    if (!extension) {
      cb(new Error('Invalid mimetype'));
    } else {
      cb(null, filename + extension);
    }
  }
});

var multipart = multer({
  limits: { fieldSize: 5 * 1024 * 1024 }, // 5 MB
  storage: storage
}).single('file');

router.param('article', articles.load);

router.get('/articles', articles.all);

router.get('/unions/:union', unions.show);
router.get('/unions'       , unions.list);
router.post('/unions'      , ensureAuthenticated, unions.create);
router.put('/unions/:union', ensureAuthenticated, unions.update);
router.delete('/unions/:union', ensureAuthenticated, unions.delete);

router.get('/unions/:union/articles' , articles.getUnionArticles);
router.post('/unions/:union/articles', ensureAuthenticated, multipart, articles.create);

router.get('/unions/:union/events', articles.getUnionEvents);

router.get('/unions/:union/articles/:article', articles.show);
router.put('/unions/:union/articles/:article', ensureAuthenticated, multipart, articles.update);
router.delete('/unions/:union/articles/:article', ensureAuthenticated, articles.delete);

router.use(errorHandler.NotFoundMiddleware);

module.exports = router;
