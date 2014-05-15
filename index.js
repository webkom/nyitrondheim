var express       = require('express')
  , bodyParser    = require('body-parser')
  , cookieParser  = require('cookie-parser')
  , session       = require('express-session')
  , app           = module.exports = express()
  , mongoose      = require('mongoose')
  , passport      = require('passport')
  , routes        = require('./config/routes')
  , MongoStore    = require('connect-mongo')(session)
  , LocalStrategy = require('passport-local').Strategy;

app.disable('x-powered-by');
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.set('views', __dirname + '/app/views');
// Change this according to the database you use (or export the var MONGO_URL).
app.set('mongourl', process.env.MONGO_URL || 'mongodb://localhost:27017/nit');

function expressConfig() {
  app.use(bodyParser());
  app.use(cookieParser());

  app.use(session({
    cookie: { maxAge : 1000*60*60},
    secret: process.env.COOKIE_SECRET || 'localsecret',
    store: new MongoStore({
      mongoose_connection: mongoose.connections[0],
      collection: 'sessions'
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.static(__dirname + '/app/assets/vendor'));
  app.use(express.static(__dirname + '/public'));
  app.use(require('prerender-node'));

  app.locals.pretty = true;

  var Union = require('./app/models/union.js');
  passport.use(Union.createStrategy());
  passport.serializeUser(Union.serializeUser());
  passport.deserializeUser(Union.deserializeUser());

  routes.routes(app);

  app.get('/admin*', routes.ensureAuthenticated, routes.ensureAdmin, function(req, res) {
    res.render('admin', {
      union: req.user,
      title: 'Adminpanel'
    });
  });

  app.get('*', function(req, res) {
    res.render('index');
  });

  app.listen(app.get('port'), function() {
    console.log('Listening on %d', app.get('port'));
  });

  console.log('Done with setup.');
}

mongoose.connect(app.get('mongourl'), function(err) {
  if (err) return console.log('Couldn\'t connect to database.', err);
  console.log('Connected to database.');
  expressConfig();
});

mongoose.connection.on('error', function(err) {
  console.log('Mongoose error:', err);
});

mongoose.connection.on('disconnected', function(err) {
  console.log('Mongoose disconnected, reconnecting..'); // Should auto reconnect
});
