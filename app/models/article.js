var mongoose = require('mongoose')
, Schema     = mongoose.Schema
, env        = process.env.NODE_ENV || 'development'
;

//TODO: Should be able to upload images with the articles, thus the model needs to be able to remove these files 
//      when the article is deleted (use imager).

/*Should fix foreign key stuff for article schema, liek: {
    type: Schema.ObjectId, 
    ref: 'StudentUnion'
  },*/

var articleSchema = new Schema({
  title: String,
  body:  String,
  description: {
    type: String,
    default: ''
  },
  author: String,
  priority: Number,
  small_image: String,
  large_image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

articleSchema.path('title').required('true', 'Title is a required field');
articleSchema.path('body').required('true', 'Body is a required field');

// Add methods for putting data the db

articleSchema.statics = {

  // Find article by id:
  load: function(id, cb) {
    this
      .findOne({
        _id: id
      })
      .populate('author', 'name')
      .exec(cb);
  },

  listUnion: function(numberOfArticles, author, cb) {
    this
      .find({ author: author })
      .sort('-priority')
      .limit(numberOfArticles)
      .exec(cb);
  }
}

var Article = mongoose.model('Article', articleSchema);


// DEBUG OBJECTS:
Article.remove({}, function(err) {
  console.log("hei");
});

var testArticle2 = new Article({
  title: 'Hei',
  body: 'Hei2',
  description: 'Hei3',
  author: 'Abakus',
  priority: 5,
  small_image: 'Url1',
  large_image: 'Url2',
});
var testArticle = new Article({
  title: 'Hei',
  body: 'Hei2',
  description: 'Hei3',
  author: 'Abakus',
  priority: 10,
  small_image: 'Url1',
  large_image: 'Url2',
});

var testArticle3 = new Article({
  title: 'Hei',
  body: 'Hei2',
  description: 'Hei3',
  author: 'Abakus',
  priority: 1,
  small_image: 'Url1',
  large_image: 'Url2',
});
testArticle3.save(function (err) {
  if (err) return handleError(err);
  console.log("saved");
});
testArticle2.save(function (err) {
  if (err) return handleError(err);
  console.log("saved");
});
testArticle.save(function (err) {
  if (err) return handleError(err);
  console.log("saved");
});