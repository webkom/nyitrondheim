var mongoose   = require('mongoose')
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
  union_id: String,
  slug: String,
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
  findBySlug: function (slug,options,cb){
        this
            .find({slug:slug})
            .sort('-priority')

        if(options && options.limit){
          this.limit(options.limit);
        }

        this.exec(cb);
  }

}
module.exports = mongoose.model('Article', articleSchema);




