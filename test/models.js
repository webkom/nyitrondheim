var mongoose  = require('mongoose')
  , should    = require('should')
  , Article   = require('../app/models/article')
  , Union     = require('../app/models/union')

describe('#Models', function() {

  before(function(done){
    mongoose.connect('mongodb://localhost/test');
    Union.create(require('./fixtures/unions.json'), function() {
      done();
    });
  });

  after(function(done) {
    Union.remove({}, function(){
    });
    Article.remove({}, function(){
      mongoose.connection.close();
    });

    done();
  });

  it('get created articles', function(done){
    Union.findByName('Abakus', function(err, union) {
      Article.listUnionArticles(5, union, function(err, articles) {
        articles.length.should.equal(0);
        done();
      });
    });
  });

  it('check union abakus', function(done){
    Union.findByName('Abakus', function(err, union) {
      if (err) throw err;
      union.name.should.eql('Abakus');
      union.description.should.eql('Linjeforeningen for data- og kommunikasjonsteknologi.');
      done();
    });
  });
});
