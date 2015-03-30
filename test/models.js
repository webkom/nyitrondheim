var chai              = require('chai')
  , should            = chai.should()
  , Article           = require('../app/models/article')
  , Union             = require('../app/models/union')
  , ResetToken        = require('../app/models/reset-token')
  , helpers           = require('./helpers')
  , clearDatabase     = helpers.clearDatabase
  , createArticles    = helpers.createArticles
  , createUnions      = helpers.createUnions;

describe('#Union', function() {
  beforeEach(function(done) {
    var that = this;
    createUnions(function() {
      Union.findByName('Abakus', function(err, union) {
        if (err) return done(err);
        that.abakus = union;
        done();
      });
    });
  });

  afterEach(function(done) {
    clearDatabase(done);
  });

  it('check union abakus', function() {
    this.abakus.name.should.eql('Abakus');
    this.abakus.program.should.eql('Data- og Kommunikasjonsteknologi');
  });
});

describe('#Article', function() {
  beforeEach(function(done) {
    var that = this;
    createUnions(function() {
      createArticles(function() {
        Union.findByName('Abakus', function(err, union) {
          if (err) return done(err);
          that.abakus = union;
          done();
        });
      });
    });
  });

  afterEach(function(done) {
    clearDatabase(done);
  });

  it('get created articles', function(done) {
    Article.listUnionArticles(5, this.abakus._id, function(err, articles) {
      articles.length.should.equal(1);
      done();
    });
  });
});
