var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
  port: process.env.SMTP_PORT,
  host: process.env.SMTP_HOST
}));

exports.sendMail = function(options, callback) {
  if (process.env.SEND_MAIL) {
    return transporter.sendMail(options, callback);
  }
  callback();
};
