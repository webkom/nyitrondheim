#!/usr/bin/env node

var mongoose        = require('mongoose')
  , _               = require('lodash')
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
  _.forEach(unionJSON, function(uJSON, index) {
    var union = new Union(uJSON);
    union.save(function(err, union) {
      union.setPassword('temp', function(err, union) {
        union.save(function(err, union) {
          if (err) console.log('Couldn\'t save union after setting password.', err);
          console.log('Created union', union.name, ' with the password "temp"');
          console.log('ind, len', index === unionJSON.length-1);
          if (addArticlesToUnions) {
            addArticles(union, (index === unionJSON.length-1));
          }
          else if (index === unionJSON.length-1) {
            done();
          }
        });
      });
    });
  });
}

function addArticles(union, last) {
  console.log('Creating example articles..');
  var numberOfArticles = 4;
  (function next() {
    var exampleArticle = _.clone(articleJSON);
    exampleArticle.title = exampleArticle.title + ' ' + numberOfArticles;
    var article = new Article(exampleArticle);
    article.union = union._id;
    article.save(function() {
      console.log('Saving article.');
      numberOfArticles--;
      if (numberOfArticles > 0) next();
      else if (last) {
        done();
      }
    });
  })();
}

program
  .command('bootstrap [database]')
  .description('Bootstraps the database with a set of unions from various schools in Trondheim.')
  .option('-a, --articles', 'Include example articles.')
  .option('-c, --clear', 'Clears the database before bootstrapping.')
  .option('-f, --force', 'Needed to bootstrap a non-localhost database.')
  .action(function(database, options) {
    if (!database) {
      database = 'mongodb://localhost:27017';
      console.log('No database specified, setting database to localhost.');
    }
    if (options.force || _.contains(database, 'localhost')) {
      mongoose.connect(database, function(err) {
        if (err) console.log('Couldn\'t connct to database, database');
        if (options.clear) {
          mongoose.connection.db.dropDatabase(function(err) {
            if (err) console.log('Couldn\'t drop database.', err);
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

program.parse(process.argv);
if (!program.args.length) program.help();
