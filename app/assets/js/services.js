var nitServices = angular.module('nitServices', ['ngResource']);

nitServices.factory('Article', ['$http', function($http) {
  var urlBase = '/api/unions/';

  var error = function() {
    console.log(arguments);
    alert("Error", arguments);
  };

  return {

    findAll: function(union) {
      return $http.get(urlBase + union + '/articles').error(error);
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
