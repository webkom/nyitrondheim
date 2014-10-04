var mongoose          = require('mongoose')
  , should            = require('should')
  , Article           = require('../app/models/article')
  , Union             = require('../app/models/union')
  , helpers           = require('./helpers')
  , clearDatabase     = helpers.clearDatabase
  , createUnions      = helpers.createUnions;

describe('#Models', function() {

  before(function(done){
    createUnions(done);
  });

  after(function(done) {
    clearDatabase(done);
  });

  it('get created articles', function(done){
    Union.findByName('Abakus', function(err, union) {
      Article.listUnionArticles(5, union._id, function(err, articles) {
        articles.length.should.equal(0);
        done();
      });
    });
  });

  it('check union abakus', function(done){
    Union.findByName('Abakus', function(err, union) {
      if (err) throw err;
      union.name.should.eql('Abakus');
      union.program.should.eql('Data- og Kommunikasjonsteknologi');
      done();
    });
  });
});
