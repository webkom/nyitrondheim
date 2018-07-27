var mongoose = require('mongoose'),
  crypto = require('crypto'),
  Schema = mongoose.Schema;

var resetTokenSchema = new Schema({
  union: {
    type: Schema.ObjectId,
    ref: 'Union'
  },
  token: {
    type: String,
    default: function() {
      return crypto.randomBytes(12).toString('hex');
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

resetTokenSchema.static('findLast', function(union, callback) {
  this.findOne({ union: union })
    .sort('-createdAt')
    .exec(callback);
});

resetTokenSchema.static('newToken', function(union, callback) {
  this.remove(
    { union: union },
    function(err) {
      if (err) return callback(err);
      this.create({ union: union }, callback);
    }.bind(this)
  );
});

module.exports = mongoose.model('ResetToken', resetTokenSchema);
