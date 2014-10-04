var async           = require('async')
  , _               = require('lodash')
  , unionFixtures   = require('./fixtures/unions')
  , articleFixture  = require('./fixtures/article')
  , Union           = require('../app/models/union')
  , Article         = require('../app/models/article');

exports.clearDatabase = function(done) {
  async.parallel([
    function(cb) {
      Union.collection.remove(cb);
    },
    function(cb) {
      Article.collection.remove(cb);
    }
  ], done);
};

exports.createArticles = function(done) {
  Union.find({}, function(err, unions) {
    if (err) throw err;
    async.each(unions, function(union, callback) {
      var article = _.clone(articleFixture);
      article.union = union._id;
      Article.create(article, callback);
    }, done);
  });
};

exports.createUnions = function(done) {
  Union.create(unionFixtures, function(err, unions) {
    if (err) throw err;
    done();
  });
}
