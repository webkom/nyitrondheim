var nitServices = angular.module('nitServices', ['ngResource', 'LocalStorageModule']);

var urlBase = '/api/unions/';

nitServices.factory('articleService', ['$http', function($http) {
  var error = function() {
    console.log(arguments);
  };

  return {

    findAll: function(union) {
      return $http.get(urlBase + union + '/articles').error(error);
    },

    findBySlug: function(union, slug) {
      return $http.get(urlBase + union + '/articles/' + slug).error(error);
    },

    create: function(union, article) {
      return $http.post(urlBase + union + '/articles', article).error(error);
    },

    update: function(union, article) {
      return $http.put(urlBase + union + '/articles/' + article.slug, article).error(error);
    },

    destroy: function(union, article) {
      return $http.delete(urlBase + union + '/articles/' + article.slug).error(error);
    },

    save: function(union, article) {
      if (article._id) return this.update(union, article);
      return this.create(union, article);
    }
  };
}]);


nitServices.factory('unionService', ['$http', 'localStorageService', function($http, localStorageService) {

  return {
    last: function() {
      return localStorageService.get('union');
    },

    save: function(union) {
      localStorageService.add('union', union);
    },

    findAll: function() {
      return $http.get(urlBase).error(console.log);
    },

    findByName: function(name) {
      return $http.get(urlBase + name).error(console.log);
    }
  };
}]);
