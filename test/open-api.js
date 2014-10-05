var slug                 = require('slug')
  , chai                 = require('chai')
  , request              = require('supertest')
  , app                  = require('../app')
  , helpers              = require('./helpers')
  , clearDatabase        = helpers.clearDatabase
  , createUnions         = helpers.createUnions
  , createArticles       = helpers.createArticles
  , should               = chai.should();

describe('#Open API', function() {

  var unionFixtures = require('./fixtures/unions.json');

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
  });

  it('should get the articles for a specific union', function(done) {
    request(app)
      .get('/api/unions/abakus/articles')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        var articles = res.body;
        articles.should.have.length(1);
        done();
      });
  });

  it('should get a specific article for a specific union', function(done) {
    request(app)
      .get('/api/unions/abakus/articles/testartikkel')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        var article = res.body;
        article.slug.should.eql(slug(article.title).toLowerCase());
        done();
      });
  });

});
