var express     = require('express')
  , stylus      = require('stylus')
  , nib         = require('nib')
  , browserify  = require('browserify-middleware')
  , app         = module.exports = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
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

app.get('/app.js', browserify('./public/js/nit.js'));

app.get('/partials/:partial', function(req, res) {
  res.render('partials/' + req.param('partial').replace('.', '/'));
});

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(app.get('port'), function() {
  console.log('Listening on %d', app.get('port'));
});