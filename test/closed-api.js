var slug                 = require('slug')
  , _                    = require('lodash')
  , chai                 = require('chai')
  , async                = require('async')
  , request              = require('supertest')
  , passportStub         = require('passport-stub')
  , fs                   = require('fs')
  , path                 = require('path')
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
    var that = this;
    clearDatabase(function() {
      async.parallel([
        function(callback) {
          createAdminUser(function(err, admin) {
            if (err) return done(err);
            passportStub.login({ slug: 'generelt' });
            that.admin = admin;
            callback();
          });
        },
        function(callback) {
          createUnions(function() {
            createArticles(function() {
              Union.findOne({ slug: 'abakus' }, function(err, union) {
                if (err) return callback(err);
                that.abakus = union;
                callback();
              });
            });
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
    this.admin.program = 'updated';

    request(app)
      .put('/api/unions/generelt')
      .send(this.admin)
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

    request(app)
      .post('/api/unions/' + this.abakus._id + '/articles')
      .attach('file', 'test/fixtures/test-image.jpg')
      .field('title', article.title)
      .field('description', article.description)
      .field('body', article.body)
      .field('approved', String(article.approved))
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        var createdArticle = res.body;
        _.each(article, function(value, key) {
          createdArticle[key].should.equal(value);
        });

        var uploadPath = path.resolve('public', 'images');
        async.series([
          fs.readFile.bind(undefined,
                           path.resolve(uploadPath, createdArticle.image)),
          fs.readFile.bind(undefined,
                           path.resolve(uploadPath, createdArticle.imageCropped))
        ], done);
      });
  });

  it('should update an article', function(done) {
    var article = _.clone(articleFixture);
    article.title = 'updated';

    request(app)
      .put('/api/unions/' + this.abakus._id + '/articles/testartikkel')
      .send(article)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        var createdArticle = res.body;
        _.each(article, function(value, key) {
          createdArticle[key].should.equal(value);
        });

        done();
      });
  });

  it('should remove image references through update', function(done) {
    var article = _.clone(articleFixture);
    var that = this;

    request(app)
      .post('/api/unions/' + this.abakus._id + '/articles')
      .attach('file', 'test/fixtures/test-image.jpg')
      .field('title', article.title)
      .field('description', article.description)
      .field('body', article.body)
      .field('approved', String(article.approved))
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function(err, res) {
        var newArticle = res.body;
        newArticle.image = null;
        newArticle.imageCropped = null;
        newArticle.imageName = null;
        request(app)
          .put('/api/unions/' + that.abakus._id + '/articles/' + newArticle.slug)
          .send(newArticle)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            var updatedArticle = res.body;
            should.not.exist(updatedArticle.image);
            should.not.exist(updatedArticle.imageName);
            should.not.exist(updatedArticle.imageCropped);
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
        Article.findOne({ union: this.abakus._id }, function(err, article) {
          if (err) return done(err);
          should.not.exist(article);
          done();
        });
      }.bind(this));
  });

});
