var express       = require('express')
  , bodyParser    = require('body-parser')
  , cookieParser  = require('cookie-parser')
  , session       = require('express-session')
  , app           = module.exports = express()
  , mongoose      = require('mongoose')
  , passport      = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

app.disable('x-powered-by');
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.set('views', __dirname + '/app/views');
app.set('mongourl', process.env.MONGO_URL || 'mongodb://webkom:aidspenis@oceanic.mongohq.com:10072/nyitrondheim');

app.use(bodyParser());
app.use(cookieParser('cookiesecret'));
app.use(session({
  cookie: { maxAge : 3600000*24*30*12} // A year of cookies :)
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

mongoose.connect(app.get('mongourl'));

mongoose.connection.on('error', function(err) {
  console.log('Mongoose error:', err);
});

mongoose.connection.on('disconnect', function() {
  console.log('Mongoose disconnected, reconnecting..');
  connect();
});

require('./config/routes')(app);

app.get('*', function(req, res) {
  res.render('index');
});

app.listen(app.get('port'), function() {
  console.log('Listening on %d', app.get('port'));
});
