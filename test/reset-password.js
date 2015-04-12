var chai                 = require('chai')
  , request              = require('supertest')
  , app                  = require('../app')
  , helpers              = require('./helpers')
  , Union                = require('../app/models/union')
  , ResetToken           = require('../app/models/reset-token')
  , clearDatabase        = helpers.clearDatabase
  , createUnions         = helpers.createUnions;

chai.should();

describe('#Reset Password', function() {

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
      .post('/reset-password')
      .send({ email: this.abakus.email })
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        res.text.should.contain('En epost har blitt sendt ut med videre instruksjoner.')
        done();
      });
  });

  it('should render with an error when omitting email', function(done) {
    request(app)
      .post('/reset-password')
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        res.text.should.contain('Epost er nødvendig')
        done();
      });
  });

  it('should render with an error for invalid emails', function(done) {
    request(app)
      .post('/reset-password')
      .send({ email: 'bad@email.com'})
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        res.text.should.contain('Denne eposten finnes ikke')
        done();
      });
  });

  it('should retrieve tokens', function(done) {
    request(app)
      .get('/reset-password/' + this.token.token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.text.should.contain(this.token.token);
        done();
      }.bind(this));
  });

  it('should return 404 when retrieving invalid tokens', function(done) {
    request(app)
      .get('/reset-password/badtoken')
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('should reset passwords', function(done) {
    var newPassword = 'newpassword';
    request(app)
      .post('/reset-password/' + this.token.token)
      .send({ password: newPassword })
      .expect(302)
      .expect('location', '/panel')
      .end(function(err, res) {
        if (err) return done(err);
        done();
      }.bind(this));
  });

  it('should return 400 when omitting password', function(done) {
    request(app)
      .post('/reset-password/' + this.token.token)
      .expect(400)
      .end(function(err, res) {
        res.text.should.contain('Passord er nødvendig')
        done();
      });
  });
});
