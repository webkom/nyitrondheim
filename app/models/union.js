var mongoose   = require('mongoose')
  , slug       = require('mongoose-slug')
  , Schema     = mongoose.Schema;

var unionSchema = new Schema({
  name: String,
  description: {
    type: String,
    default: ''
  },
  smallImage: String,
  largeImage: String
});

unionSchema.plugin(slug('name'));

unionSchema.statics = {

  findById: function(id, cb) {
    this.findOne({_id: id}).exec(cb);
  },

  findByName: function(name, cb) {
    return this.findOne({name: name}).exec(cb);
  },
};

module.exports = mongoose.model('Union', unionSchema);
