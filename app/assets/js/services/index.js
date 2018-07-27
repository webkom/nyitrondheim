angular
  .module('nitServices', ['LocalStorageModule'])
  .factory('articleService', require('./article-service'))
  .factory('unionService', require('./union-service'))
  .factory('alertService', require('./alert-service'));
