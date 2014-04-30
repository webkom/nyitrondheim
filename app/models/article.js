var mongoose   = require('mongoose')
  , slug       = require('mongoose-slug')
  , Union      = require('./union')
  , Schema     = mongoose.Schema;

/**
 * @todo Should be able to upload images with the articles, thus the model needs to be able to remove these files
 * when the article is deleted (use imager).
 */
var articleSchema = new Schema({
  title: {
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
    ref: 'Union'
  },
  priority: Number,
  event: Boolean,
  start: Date,
  end: Date,
  startTime: String,
  endTime: String,
  location: String,
  smallImage: String,
  largeImage: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

articleSchema.plugin(slug('title'));

articleSchema.statics = {

  findBySlug: function (slug, unionId, cb){
    if (unionId.match(/^[0-9a-fA-F]{24}$/))
      return this.find({slug: slug, union: unionId}).sort('-priority').exec(cb);

    Union.findByName(unionId, function(err, union) {
      return this.find({slug: slug, union: union}).sort('-priority').exec(cb);
    }.bind(this));
  },

  listUnionArticles: function(limit, unionId, cb) {
    if (unionId.match(/^[0-9a-fA-F]{24}$/))
      return this.find({union: unionId}).sort('-priority').limit(limit).exec(cb);

    Union.findByName(unionId, function(err, union) {
      return this.find({union: union}).sort('-priority').limit(limit).exec(cb);
    }.bind(this));
  },

  listUnionEvents: function(limit, unionId, cb) {
    if (unionId.match(/^[0-9a-fA-F]{24}$/))
      return this.find({union: unionId, event: true}).sort('-priority').limit(limit).exec(cb);

    Union.findByName(unionId, function(err, union) {
      return this.find({union: union, event: true}).sort('-priority').limit(limit).exec(cb);
    }.bind(this));
  }
};

module.exports = mongoose.model('Article', articleSchema);
