var async           = require('async')
  , _               = require('lodash')
  , slug            = require('slug')
  , mongoose        = require('mongoose')
  , unionFixtures   = require('./fixtures/unions')
  , articleFixture  = require('./fixtures/article')
  , adminFixture    = require('./fixtures/admin-union')
  , Union           = require('../app/models/union')
  , Article         = require('../app/models/article');

exports.clearDatabase = function(done) {
  var collections = _.values(mongoose.connection.collections);
  async.map(collections, function(collection, callback) {
    collection.remove(callback);
  }, done);
};

exports.createArticles = function(done) {
  Union.find({}, function(err, unions) {
    if (err) return done(err);
    async.each(unions, function(union, callback) {
      var article = _.clone(articleFixture);
      article.union = union._id;
      Article.create(article, callback);
    }, done);
  });
};

exports.createUnions = function(done) {
  Union.create(unionFixtures, function(err, unions) {
    if (err) return done(err);
    done();
  });
};

exports.createAdminUser = function(done) {
  var union = new Union(adminFixture);
  union.slug = slug(union.name).toLowerCase();
  Union.register(union, 'test', function(err, union) {
    if (err) return done(err);
    done(null, union);
  });
};
