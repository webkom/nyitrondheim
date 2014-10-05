var express       = require('express')
  , bodyParser    = require('body-parser')
  , cookieParser  = require('cookie-parser')
  , session       = require('express-session')
  , app           = module.exports = express()
  , mongoose      = require('mongoose')
  , passport      = require('passport')
  , routes        = require('./config/routes')
  , routeHelpers  = require('./config/routes/helpers')
  , MongoStore    = require('connect-mongo')(session)
  , LocalStrategy = require('passport-local').Strategy;

app.disable('x-powered-by');
app.set('view engine', 'jade');
app.set('views', __dirname + '/app/views');
app.set('mongourl', process.env.MONGO_URL || 'mongodb://localhost:27017/nit');

mongoose.connect(app.get('mongourl'), function(err) {
  if (err) throw err;
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(session({
  cookie: { maxAge : 1000*60*60*24*30*3}, // Three months
  secret: process.env.COOKIE_SECRET || 'localsecret',
  store: new MongoStore({
    mongoose_connection: mongoose.connection,
    collection: 'sessions'
  }),
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/app/assets/vendor'));
app.use(express.static(__dirname + '/public'));
app.use(require('prerender-node'));

app.locals.pretty = true;

var Union = require('./app/models/union');
passport.use(Union.createStrategy());
passport.serializeUser(Union.serializeUser());
passport.deserializeUser(Union.deserializeUser());

routes(app);

app.get('/admin*', routeHelpers.ensureAuthenticated, routeHelpers.ensureAdmin, function(req, res) {
  res.render('admin', {
    union: req.user,
    title: 'Adminpanel'
  });
});

app.get('*', function(req, res) {
  res.render('index');
});
