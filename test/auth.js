var chai                 = require('chai')
  , request              = require('supertest')
  , app                  = require('../app')
  , helpers              = require('./helpers')
  , clearDatabase        = helpers.clearDatabase
  , createAdminUser      = helpers.createAdminUser
  , should               = chai.should()
  , expect               = chai.expect
  , assert               = chai.assert;

describe('#Auth', function() {

  before(function(done) {
    clearDatabase(function() {
      createAdminUser(function(err, admin) {
        if (err) return done(err);
        done();
      });
    });
  });

  after(function(done) {
    clearDatabase(done);
  });

  it('should login and redirect to admin', function(done) {
    request(app)
      .post('/login')
      .send({ slug: 'generelt', password: 'test' })
      .expect(302)
      .end(function(err, res) {
        res.header.location.should.include('/admin');
        done();
      });
  });
});
