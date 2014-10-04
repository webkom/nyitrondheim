var slug                 = require('slug')
  , mongoose             = require('mongoose')
  , chai                 = require('chai')
  , async                = require('async')
  , request              = require('supertest')
  , app                  = require('../app')
  , helpers              = require('./helpers')
  , Union                = require('../app/models/union')
  , clearDatabase        = helpers.clearDatabase
  , createUnions         = helpers.createUnions
  , createArticles       = helpers.createArticles
  , should               = chai.should()
  , expect               = chai.expect
  , assert               = chai.assert;

describe('#Open-API', function() {

  var unionFixtures = require('./fixtures/unions.json');
  var articleFixture = require('../scripts/data/example-article.json');

  before(function(done) {
    createUnions(function() {
      createArticles(done);
    });
  });

  after(function(done) {
    clearDatabase(done);
  });

  it('should list all the unions', function(done) {
    request(app)
      .get('/api/unions')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        var unions = res.body;
        unions.should.have.length(unionFixtures.length);
        done();
      });
  });

  it('should list all articles', function(done) {
    request(app)
      .get('/api/articles')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        var articles = res.body;
        articles.should.have.length(unionFixtures.length);
        done();
      });
  });

  it('should show a specific union', function(done) {
    request(app)
      .get('/api/unions/abakus')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        var union = res.body;
        union.slug.should.eql(slug(union.name).toLowerCase());
        union.program.should.eql('Data- og Kommunikasjonsteknologi');
        done();
      });
  })

});
