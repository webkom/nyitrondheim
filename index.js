var app = require('./app');

app.set('address', process.env.ADDRESS || 'localhost');
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), app.get('address'), function() {
  console.log('Listening on %d', app.get('port'));
});
