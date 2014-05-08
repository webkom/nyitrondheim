var mongoose              = require('mongoose')
  , slug                  = require('mongoose-slug')
  , Schema                = mongoose.Schema
  , passportLocalMongoose = require('passport-local-mongoose');

var unionSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ''
  },

  school: {
    type: String,
    default: 'NTNU'
  },

  smallImage: String,
  largeImage: String
});

unionSchema.statics = {

  findById: function(id, cb) {
    this.findOne({_id: id}).exec(cb);
  },

  findByName: function(name, cb) {
    return this.findOne({name: name}).exec(cb);
  },
};

unionSchema.plugin(passportLocalMongoose, {
  usernameField: 'name'
});
unionSchema.plugin(slug('name'));

module.exports = mongoose.model('Union', unionSchema);
