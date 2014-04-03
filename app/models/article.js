var mongoose   = require('mongoose')
  , slug       = require('mongoose-slug')
  , Schema     = mongoose.Schema

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

  slug: String,
  priority: Number,
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
    this
      .find({slug: slug, union: unionId})
      .sort('-priority')
      .exec(cb);
  },

  listUnionArticles: function(limit, unionId, cb) {
    this
      .find({union: unionId}, 'union title description priority small_image slug')
      .sort('-priority')
      .limit(limit)
      .exec(cb);
  }
}

module.exports = mongoose.model('Article', articleSchema);
