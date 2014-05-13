var mongoose    = require('mongoose')
  , slug        = require('mongoose-slug')
  , Union       = require('./union')
  , Schema      = mongoose.Schema;

var articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
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
  }
});

articleSchema.statics = {

  findById: function(articleId, unionId, cb) {
    if (unionId.match(/^[0-9a-fA-F]{24}$/)) {
      return this.find({_id: articleId, union: unionId}).sort('-createdAt').exec(cb);
    }


    Union.findBySlug(unionId, function(err, union) {
      return this.find({_id: articleId, union: union}).sort('-createdAt').exec(cb);
    }.bind(this));
  },

  findBySlug: function (slug, unionId, cb){
    console.log('finding with,', slug, unionId);
    if (unionId.match(/^[0-9a-fA-F]{24}$/)) {
      return this.find({slug: slug, union: unionId}).sort('-createdAt').exec(cb);
    }

    Union.findBySlug(unionId, function(err, union) {
      return this.find({slug: slug, union: union}).sort('-createdAt').exec(cb);
    }.bind(this));
  },

  listAll: function(limit, cb) {
    return this.find().sort('-createdAt').limit(limit).exec(cb);
  },

  listUnionArticles: function(limit, unionId, cb) {
    if (unionId.match(/^[0-9a-fA-F]{24}$/)) {
      return this.find({union: unionId}).sort('-createdAt').limit(limit).exec(cb);
    }

    Union.findBySlug(unionId, function(err, union) {
      return this.find({union: union}).sort('-createdAt').limit(limit).exec(cb);
    }.bind(this));
  },

  listUnionEvents: function(limit, unionId, cb) {
    if (unionId.match(/^[0-9a-fA-F]{24}$/)) {
      return this.find({union: unionId, event: true}).sort('-createdAt').limit(limit).exec(cb);
    }

    Union.findBySlug(unionId, function(err, union) {
      return this.find({union: union, event: true}).sort('-createdAt').limit(limit).exec(cb);
    }.bind(this));
  }
};

module.exports = mongoose.model('Article', articleSchema);
