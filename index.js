var express       = require('express')
  , app           = module.exports = express()
  , mongoose      = require('mongoose')
  , passport      = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

app.configure(function() {
  app.disable('x-powered-by');
  app.set('port', process.env.PORT || 3000);
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/app/views');
  app.set('mongourl', process.env.MONGO_URL || 'mongodb://webkom:aidspenis@oceanic.mongohq.com:10072/nyitrondheim');
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.cookieParser('testsecret'));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.static(__dirname + '/public'));
  app.locals.pretty = true;
});

var Union = require('./app/models/union.js');
console.log("UNION?" + Union);
passport.use(Union.createStrategy());
passport.serializeUser(Union.serializeUser());
passport.deserializeUser(Union.deserializeUser());
mongoose.connect(app.get('mongourl'));

mongoose.connection.on('error', function(err) {
  console.log('Mongoose error:', err);
});

mongoose.connection.on('disconnect', function() {
  console.log('Mongoose disconnected, reconnecting..');
  connect();
});

require('./config/routes')(app);

app.listen(app.get('port'), function() {
  console.log('Listening on %d', app.get('port'));
});
