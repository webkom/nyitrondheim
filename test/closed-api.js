var slug                 = require('slug')
  , _                    = require('lodash')
  , chai                 = require('chai')
  , async                = require('async')
  , request              = require('supertest')
  , passportStub         = require('passport-stub')
  , app                  = require('../app')
  , helpers              = require('./helpers')
  , Union                = require('../app/models/union')
  , Article              = require('../app/models/article')
  , clearDatabase        = helpers.clearDatabase
  , createUnions         = helpers.createUnions
  , createArticles       = helpers.createArticles
  , createAdminUser      = helpers.createAdminUser
  , should               = chai.should();

describe('#Closed API', function() {

  var articleFixture = require('./fixtures/article');

  passportStub.install(app);

  beforeEach(function(done) {
    clearDatabase(function() {
      async.parallel([
        function(callback) {
          createAdminUser(function(err, admin) {
            if (err) return done(err);
            passportStub.login({ slug: 'generelt' });
            callback();
          });
        },
        function(callback) {
          createUnions(function() {
            createArticles(callback);
          });
        }
      ], done);
    });
  });

  afterEach(function(done) {
    clearDatabase(done);
  });

  it('should create an union', function(done) {
    var union = {
      name: 'test',
      program: 'test',
      school: 'test',
      password: 'test'
    };

    request(app)
      .post('/api/unions')
      .send(union)
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        Union.findOne({ name: 'test' }, function(err, createdUnion) {
          if (err) return done(err);
          createdUnion.slug.should.eql(slug(union.name).toLowerCase());
          done();
        });
      });
  });

  it('should update an union', function(done) {
    Union.findOne({ slug: 'generelt' }, function(err, union) {
      if (err) return done(err);
      union.program = 'updated';

      request(app)
        .put('/api/unions/generelt')
        .send(union)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          Union.findOne({ slug: 'generelt' }, function(err, union) {
            if (err) return done(err);
            union.program.should.eql('updated');
            done();
          });
        });
    });
  });

  it('should delete an union', function(done) {
    request(app)
      .del('/api/unions/abakus')
      .expect(204)
      .end(function(err, res) {
        if (err) return done(err);
        Union.findOne({ name: 'Abakus' }, function(err, union) {
          if (err) return done(err);
          should.not.exist(union);
          done();
        });
      });
  });

  it('should create an article', function(done) {
    var article = _.clone(articleFixture);
    article.title = 'new_test';

    Union.findOne({ slug: 'abakus' }, function(err, union) {
      if (err) return done(err);
      request(app)
        .post('/api/unions/' + union._id + '/articles')
        .attach('file', 'test/fixtures/test-image.jpeg')
        .field('title', article.title)
        .field('description', article.description)
        .field('body', article.body)
        .field('approved', String(article.approved))
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          var createdArticle = res.body;
          createdArticle.title.should.eql(article.title);
          done();
        });
    });
  });

  it('should update an article', function(done) {
    var article = _.clone(articleFixture);
    article.title = 'updated';

    Union.findOne({ slug: 'abakus' }, function(err, union) {
      if (err) return done(err);
      request(app)
        .put('/api/unions/' + union._id + '/articles/testartikkel')
        .field('title', article.title)
        .field('description', article.description)
        .field('body', article.body)
        .field('approved', String(article.approved))
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          var createdArticle = res.body;
          createdArticle.title.should.eql(article.title);
          done();
        });
    });
  });

  it('should delete an article', function(done) {
    request(app)
      .del('/api/unions/abakus/articles/testartikkel')
      .expect(204)
      .end(function(err, res) {
        if (err) return done(err);
        Union.findOne({ name: 'Abakus' }, function(err, union) {
          if (err) return done(err);
          Article.findOne({ union: union._id }, function(err, article) {
            if (err) return done(err);
            should.not.exist(article);
            done();
          });
        });
      });
  });

});
