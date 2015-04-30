var app = require('../../app');

exports.adminNotification = function(message) {
  var ravenClient = app.get('raven');
  if (ravenClient) {
    ravenClient.captureMessage(message, {
      level: 'info'
    });
  }
};

exports.sentryError = function(err) {
  var ravenClient = app.get('raven');
  if (ravenClient) {
    ravenClient.captureError(err);
  } else {
    console.error(err);
  }
};
