var express     = require('express')
  , stylus      = require('stylus')
  , nib         = require('nib')
  , browserify  = require('browserify-middleware')
  , app         = module.exports = express();

var env         = process.env.NODE_ENV || 'development'
  , config      = require('./config/config')[env]
  , mongoose    = require('mongoose');

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/app/views');
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(stylus.middleware({
    src: __dirname + '/public/assets',
    dest: __dirname + '/public',
    compile: function(str, path) {
      return stylus(str)
        .set('filename', path)
        .use(nib());}
  }));
  app.use(express.static(__dirname + '/public'));

  app.locals.pretty = true;
});

var db = mongoose.connect('mongodb://webkom:aidspenis@oceanic.mongohq.com:10072/nyitrondheim');

mongoose.connection.on('error', function(err) {
  console.log('Mongoose error:', err);
});

mongoose.connection.on('disconnect', function() {
  console.log('Mongoose disconnected, reconnecting..');
  connect();
});

mongoose.connection.on('connect', function() {
  console.log('inne');
});

app.get('/app.js', browserify('./public/js/app.js'));

app.get('/partials/:partial', function(req, res) {
  res.render('partials/' + req.param('partial').replace('.', '/'));
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/admin', function(req, res) {
  res.render('admin');
});

require('./app/models/article.js');
require('./app/models/union.js');

require('./config/routes')(app);

app.listen(app.get('port'), function() {
  console.log('Listening on %d', app.get('port'));
});
