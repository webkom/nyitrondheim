#!/usr/bin/env node

var mongoose        = require('mongoose')
  , _               = require('lodash')
  , slug            = require('slug')
  , async           = require('async')
  , program         = require('commander')
  , Union           = require('../app/models/union')
  , Article         = require('../app/models/article')
  , articleJSON     = require('./data/example-article')
  , unionJSON       = require('./data/unions');

function done(err) {
  if (err) console.log('Error:', err);
  console.log('Done, exiting.');
  mongoose.disconnect();
}

function createUnions(addArticlesToUnions) {
  async.each(unionJSON, function(uJSON, callback) {
    uJSON.slug = slug(uJSON.name).toLowerCase();
    var union = new Union(uJSON);
    Union.register(union, 'temp', function(err, union) {
      union.save(function(err, union) {
        if (err) done('Couldn\'t save union after setting password. ' + err);
        console.log('Created union', union.name + ', with the username', union.slug,
          'and the password "temp"');
        if (addArticlesToUnions) addArticles(union, callback);
        else callback();
      });
    });
  }, done);
}

function addArticles(union, callback) {
  console.log('Creating example articles..');
  var numberOfArticles = 4;
  function next() {
    var exampleArticle = _.clone(articleJSON);
    exampleArticle.title = exampleArticle.title + ' ' + numberOfArticles;
    var article = new Article(exampleArticle);
    article.union = union._id;
    article.save(function() {
      numberOfArticles--;
      if (numberOfArticles > 0) next();
      else callback();
    });
  }
  next();
}

program
  .command('unions [database]')
  .description('Bootstraps the database with a set of unions from various schools in Trondheim.')
  .option('-a, --articles', 'Include example articles.')
  .option('-c, --clear', 'Clears the unions before bootstrapping.')
  .option('-d, --drop', 'Drops both the article and union collections.')
  .option('-f, --force', 'Needed to bootstrap a non-localhost database, or to bootstrap a non-empty database.')
  .action(function(database, options) {
    if (!database) {
      database = 'mongodb://localhost:27017';
      console.log('No database specified, setting database to localhost.');
    }

    if (options.force || _.contains(database, 'localhost')) {
      mongoose.connect(database, function(err) {
        if (err) done('Couldn\'t connect to database, ' + database);
        if ((options.clear || options.drop) && mongoose.connection.collections.unions) {
          mongoose.connection.collections.unions.remove(function(err) {
            if (err) done('Couldn\'t clear unions. ' + err);
            if (options.drop && mongoose.connection.collections.articles) {
              mongoose.connection.collections.articles.remove(function(err) {
                if (err) done('Couldnt\'t clear articles. ' + err);
                createUnions(options.articles);
              });
            }
            else createUnions(options.articles);
          });
        }
        else createUnions(options.articles);
      });
    }
    else {
      console.log('--force is needed to bootstrap a non-localhost database.');
    }
  });

program
  .command('articles [database]')
  .description('Bootstraps the database with example articles.')
  .option('-c, --clear', 'Clears the articles before bootstrapping.')
  .option('-f, --force', 'Needed to bootstrap a non-localhost database, or to bootstrap a non-empty database.')
  .action(function(database, options) {
    if (!database) {
      database = 'mongodb://localhost:27017';
      console.log('No database specified, setting database to localhost.');
    }
    if (options.force || _.contains(database, 'localhost')) {
      mongoose.connect(database, function(err) {
        if (err) done('Couldn\'t connect to database, ' + database);
        if (options.clear) {
          mongoose.connection.collections.articles.remove(function(err) {
            if (err) done('Coudln\'t delete collection articles. ' + err);
            Union.find({}, function(err, unions) {
              if (err) done('Couldn\'t find any unions. ' + err);
              async.each(unions, addArticles, done);
            });
          });
        }
        else {
          Article.find({}, function(err, articles) {
            if (err) done('Couldn\'t find articles. ' + err);
            if (!articles.length || options.force) {
              Union.find({}, function(err, unions) {
                if (err) done('Couldn\'t find any unions. ' + err);
                async.each(unions, addArticles, done);
              });
            }
            else {
              console.log('Existing articles in database, run with -f to continue or -c to clear existing.');
              done();
            }
          });
        }
      });
    }
    else {
      console.log('--force is needed to bootstrap a non-localhost database.');
    }
  });

program.parse(process.argv);
if (!program.args.length) program.help();
