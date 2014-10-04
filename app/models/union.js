var mongoose              = require('mongoose')
  , Schema                = mongoose.Schema
  , passportLocalMongoose = require('passport-local-mongoose')
  , slug                  = require('slug');

var unionSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  program: {
    type: String,
    required: true
  },

  slug: {
    type: String
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

unionSchema.pre('save', function(next) {
  if (!this.slug) this.slug = slug(this.name).toLowerCase();
  next();
});

unionSchema.statics = {

  findById: function(id, cb) {
    this.findOne({_id: id}).exec(cb);
  },

  findByName: function(name, cb) {
    return this.findOne({name: name}).exec(cb);
  },

  findBySlug: function(slug, cb) {
    return this.findOne({slug: slug}).exec(cb);
  }
};

unionSchema.plugin(passportLocalMongoose, {
  usernameField: 'slug'
});

module.exports = mongoose.model('Union', unionSchema);
