var mongoose    = require('mongoose')
  , slug        = require('slug')
  , Union       = require('./union')
  , helpers     = require('./helpers')
  , checkIfId   = helpers.checkIfId
  , Schema      = mongoose.Schema;

var articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String
  },
  body:  {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  union: {
    type: Schema.ObjectId,
    required: true,
    ref: 'Union'
  },
  event: {
    type: Boolean,
    default: false
  },
  approved: {
    type: Boolean,
    default: false
  },
  start: Date,
  end: Date,
  startTime: String,
  endTime: String,
  location: String,
  color: {
    type: String,
    default: '#d9534f'
  },
  imageName: String,
  image: String,
  imageCropped: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModified: Date
});

articleSchema.pre('save', function(next) {
  if (!this.slug) this.slug = slug(this.title).toLowerCase();
  next();
});

articleSchema.statics = {

  findById: function(articleId, unionIdOrSlug, cb) {
    if (checkIfId(unionIdOrSlug)) {
      return this.find({_id: articleId, union: unionIdOrSlug}).sort('-createdAt').exec(cb);
    }

    Union.findBySlug(unionIdOrSlug, function(err, union) {
      return this.find({_id: articleId, union: union}).sort('-createdAt').exec(cb);
    }.bind(this));
  },

  findBySlug: function (slug, unionIdOrSlug, cb){
    if (checkIfId(unionIdOrSlug)) {
      return this.find({slug: slug, union: unionIdOrSlug}).sort('-createdAt').exec(cb);
    }

    Union.findBySlug(unionIdOrSlug, function(err, union) {
      return this.find({slug: slug, union: union}).sort('-createdAt').exec(cb);
    }.bind(this));
  },

  findBySlugOrId: function(slugOrId, unionIdOrSlug, cb) {
    if (checkIfId(slugOrId)) {
      return this.findById(slugOrId, unionIdOrSlug, cb);
    }

    return this.findBySlug(slugOrId, unionIdOrSlug, cb);
  },

  listAll: function(limit, cb) {
    return this.find().sort('-createdAt').limit(limit).exec(cb);
  },

  listUnionArticles: function(limit, unionIdOrSlug, cb) {
    if (checkIfId(unionIdOrSlug)) {
      return this.find({union: unionIdOrSlug}).sort('-createdAt').limit(limit).exec(cb);
    }

    Union.findBySlug(unionIdOrSlug, function(err, union) {
      return this.find({union: union}).sort('-createdAt').limit(limit).exec(cb);
    }.bind(this));
  },

  listUnionEvents: function(limit, unionIdOrSlug, cb) {
    if (checkIfId(unionIdOrSlug)) {
      return this.find({union: unionIdOrSlug, event: true}).sort('-createdAt').limit(limit).exec(cb);
    }

    Union.findBySlug(unionIdOrSlug, function(err, union) {
      return this.find({union: union, event: true}).sort('-createdAt').limit(limit).exec(cb);
    }.bind(this));
  }
};

module.exports = mongoose.model('Article', articleSchema);
