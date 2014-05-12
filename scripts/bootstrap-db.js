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

function done() {
  console.log('Done, exiting.');
  mongoose.disconnect();
}

function createUnions(addArticlesToUnions) {
  async.each(unionJSON, function(uJSON, callback) {
    uJSON.slug = slug(uJSON.name).toLowerCase();
    var union = new Union(uJSON);
    Union.register(union, 'temp', function(err, union) {
      union.save(function(err, union) {
        if (err) return console.log('Couldn\'t save union after setting password.', err);
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
  .option('-c, --clear', 'Clears the database before bootstrapping.')
  .option('-f, --force', 'Needed to bootstrap a non-localhost database, or to bootstrap a non-empty database.')
  .action(function(database, options) {
    if (!database) {
      database = 'mongodb://localhost:27017';
      console.log('No database specified, setting database to localhost.');
    }
    if (options.force || _.contains(database, 'localhost')) {
      mongoose.connect(database, function(err) {
        if (err) return console.log('Couldn\'t connct to database,', database);
        if (options.clear) {
          mongoose.connection.db.dropDatabase(function(err) {
            if (err) return console.log('Couldn\'t drop database.', err);
            createUnions(options.articles);
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
  .option('-f, --force', 'Needed to bootstrap a non-localhost database, or to bootstrap a non-empty database.')
  .action(function(database, options) {
    if (!database) {
      database = 'mongodb://localhost:27017';
      console.log('No database specified, setting database to localhost.');
    }
    if (options.force || _.contains(database, 'localhost')) {
      mongoose.connect(database, function(err) {
        if (err) return console.log('Couldn\'t connct to database,', database);
        Article.find({}, function(err, articles) {
          if (err) return console.log('Couldn\'t find articles.', err);
          if (!articles.length || options.force) {
            Union.find({}, function(err, unions) {
              if (err) return console.log('Couldn\'t find any unions.', err);
              async.each(unions, addArticles, done);
            });
          }
        });
      });
    }
    else {
      console.log('--force is needed to bootstrap a non-localhost database.');
    }
  });

program.parse(process.argv);
if (!program.args.length) program.help();
