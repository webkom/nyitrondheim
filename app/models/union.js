var mongoose              = require('mongoose')
  , passportLocalMongoose = require('passport-local-mongoose')
  , slug                  = require('slug')
  , helpers               = require('./helpers')
  , checkIfId             = helpers.checkIfId
  , Schema                = mongoose.Schema;

var unionSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    match: /^[\w]+@[\w]+\.[\w]+$/
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

  findById: function(id, fields, cb) {
    if (typeof fields === 'function') {
      cb = fields;
      fields = null;
    }
    this.findOne({_id: id}).select(fields).exec(cb);
  },

  findByName: function(name, fields, cb) {
    if (typeof fields === 'function') {
      cb = fields;
      fields = null;
    }
    return this.findOne({name: name}).select(fields).exec(cb);
  },

  findBySlug: function(slug, fields, cb) {
    if (typeof fields === 'function') {
      cb = fields;
      fields = null;
    }
    return this.findOne({slug: slug}).select(fields).exec(cb);
  },

  findBySlugOrId: function(slugOrId, fields, cb)  {
    if (typeof fields === 'function') {
      cb = fields;
      fields = null;
    }

    if (checkIfId(slugOrId)) {
      return this.findOne({ _id: slugOrId }).select(fields).exec(cb);
    }

    return this.findOne({ slug: slugOrId }).select(fields).exec(cb);
  }
};

unionSchema.plugin(passportLocalMongoose, {
  usernameField: 'slug'
});

module.exports = mongoose.model('Union', unionSchema);
