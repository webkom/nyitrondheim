var chai                 = require('chai')
  , request              = require('supertest')
  , app                  = require('../app')
  , helpers              = require('./helpers')
  , Union                = require('../app/models/union')
  , ResetToken           = require('../app/models/reset-token')
  , clearDatabase        = helpers.clearDatabase
  , createUnions         = helpers.createUnions;

chai.should();

describe('#Reset Password API', function() {

  before(function(done) {
    var that = this;
    createUnions(function(err) {
      if (err) return done(err);

      Union.findOne({ slug: 'abakus' }, function(err, union) {
        if (err) return done(err);
        that.abakus = union;
        done();
      });
    });
  });

  beforeEach(function(done) {
    ResetToken.newToken(this.abakus._id, function(err, token) {
      if (err) return done(err);
      this.token = token;
      done();
    }.bind(this));
  });

  after(function(done) {
    clearDatabase(done);
  });

  it('should generate tokens', function(done) {
    request(app)
      .post('/api/reset-password')
      .send({ email: this.abakus.email })
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        var expected = {
          message: 'Token created'
        };
        res.body.should.deep.equal(expected);
        done();
      });
  });

  it('should return 400 when omitting email', function(done) {
    request(app)
      .post('/api/reset-password')
      .expect(400)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        var expected = {
          message: 'Email is required'
        };
        res.body.should.deep.equal(expected);
        done();
      });
  });

  it('should return 404 for invalid emails', function(done) {
    request(app)
      .post('/api/reset-password')
      .send({ email: 'bad@email.com'})
      .expect(404)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        var expected = {
          error: 'NotFoundError',
          message: 'We could not find what you where looking for'
        };
        res.body.should.deep.equal(expected);
        done();
      });
  });

  it('should retrieve tokens', function(done) {
    request(app)
      .get('/api/reset-password/' + this.token.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        var token = res.body.token;
        token.union.email.should.equal('abakus@abakus.no');
        token.token.length.should.equal(24);
        done();
      });
  });

  it('should return 404 when retrieving invalid tokens', function(done) {
    request(app)
      .get('/api/reset-password/badtoken')
      .expect(404)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        var expected = {
          error: 'NotFoundError',
          message: 'We could not find what you where looking for'
        };
        res.body.should.deep.equal(expected);
        done();
      });
  });

  it('should reset passwords', function(done) {
    var newPassword = 'newpassword';
    request(app)
      .post('/api/reset-password/' + this.token.token)
      .send({ password: newPassword })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        var expected = {
          message: 'Password reset'
        };
        res.body.should.deep.equal(expected);
        this.abakus.authenticate(newPassword, done);
      }.bind(this));
  });

  it('should return 400 when omitting password', function(done) {
    request(app)
      .post('/api/reset-password/' + this.token.token)
      .expect(400)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        var expected = {
          message: 'Password is required'
        };
        res.body.should.deep.equal(expected);
        done();
      });
  });
});
