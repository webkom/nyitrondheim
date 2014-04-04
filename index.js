var express     = require('express')
  , app         = module.exports = express()
  , mongoose    = require('mongoose');

app.configure(function() {
  app.disable('x-powered-by');
  app.set('port', process.env.PORT || 3000);
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/app/views');
  app.set('mongourl', process.env.MONGO_URL || 'mongodb://webkom:aidspenis@oceanic.mongohq.com:10072/nyitrondheim');
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.static(__dirname + '/public'));
  app.locals.pretty = true;
});

mongoose.connect(app.get('mongourl'));

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

app.get('/partials/:partial', function(req, res) {
  res.render('partials/' + req.param('partial').replace('.', '/'));
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/admin', function(req, res) {
  res.render('admin');
});

require('./config/routes')(app);

app.listen(app.get('port'), function() {
  console.log('Listening on %d', app.get('port'));
});
