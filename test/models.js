var mongoose    = require('mongoose')
    , should    = require('should')
    , article   = require('./../app/models/article.js')
    , union     = require('./../app/models/union.js')
    ;

describe('Create and get articles', function(){


  before(function(done){

    //Article model test
    Article = mongoose.model('Article');

    mongoose.connect('mongodb://localhost/test');
    var testArticle = new Article({
      title: 'Hei1',
      body: 'Hei',
      slug: "ANUS",
      description: 'Hei3',
      union_id: 'abakus',
      priority: 5,
      small_image: 'Url1',
      large_image: 'Url2'
    });
    testArticle.save(function (err) {
      if (err) throw err;
    });

    var testArticle2 = new Article({
      title: 'Hei2',
      body: 'Hei2 asd',
      slug: 'KUK',
      description: 'Hei3',
      union_id: 'indok',
      priority: 10,
      small_image: 'Url1',
      large_image: 'Url2'
    });
    testArticle2.save(function (err) {
      if (err) throw err;
    });

    var testArticle3 = new Article({
      title: 'Hei3',
      body: 'Hei3',
      slug: 'ANUS',
      description: 'Hei3',
      union_id: 'marin',
      priority: 1,
      small_image: 'Url1',
      large_image: 'Url2'
    });
    testArticle3.save(function (err) {
      if (err) throw err;
    });
    var testArticle4 = new Article({
      title: 'Hei4',
      body: 'Hei4',
      slug: 'ANUS',
      description: 'Hei4',
      union_id: 'marin',
      priority: 1,
      small_image: 'Url1',
      large_image: 'Url2'
    });
    testArticle3.save(function (err) {
      if (err) throw err;
    });

    // Union model test
    Union = mongoose.model('Union');


    var testUnion = new Union({
      _id: 'abakus',
      name: 'Abakus',
      description: 'aids e kult',
      small_image: '',
      large_image: ''
    });
    testUnion.save(function (err) {
      if (err) throw err;
    });
    var testUnion2 = new Union({
      _id: 'mimir',
      name: 'Mimir',
      description: 'komtek sakk mah dekk',
      small_image: '',
      large_image: ''
    });
    testUnion2.save(function (err) {
      if (err) throw err;
    });

    var testUnion3 = new Union({
      _id: 'marin',
      name: 'Marin',
      description: 'vann e kult',
      small_image: '',
      large_image: ''
    });
    testUnion3.save(function (err) {
      if (err) throw err;
    });
    var testUnion4 = new Union({
      _id: 'indok',
      name: 'Indøk',
      description: 'kuk e kult',
      small_image: '',
      large_image: ''
    });
    testUnion4.save(function (err) {
      if (err) throw err;
    });

    done();
  });


  after(function(done){
    Union.remove({}, function(){
    });
    Article.remove({}, function(){
      mongoose.connection.close();
    });

    done();

  });

  it('get created articles', function(done){
    Article.findBySlug('ANUS',function(err, article){
      if (err) throw err;
      article[0].slug.should.eql('ANUS');
      done();
    });

  });

  it('check union abakus', function(done){
    Union.findById('abakus',function(err, union){
      if (err) throw err;
      union._id.should.eql('abakus');
      union.description.should.eql('aids e kult');
      done();
    });

  });

  it('check union marin', function(done){
    Union.findById('abakus',function(err, union){
      if (err) throw err;
      union._id.should.eql('abakus');
      union.description.should.eql('aids e kult');
      done();
    });

  });



});