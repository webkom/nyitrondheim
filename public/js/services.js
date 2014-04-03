var nitServices = angular.module('nitServices', ['ngResource']);

nitServices.factory('Article', ['$http', function($http) {
    var urlBase = '/api/unions/';
    var articleFactory = {};

    articleFactory.findAll = function(union) {
      return $http.get(urlBase + union + '/articles')
        .error(function(data, status, headers, config) {
          console.log("error", status);
        });
    }

    articleFactory.newArticle = function(union, article) {
      console.log("posting", union, article);
      return $http.post(urlBase + union + '/articles', article)
        .error(function(data, status, headers, config) {
          console.log("error", status);
        });
    }

    articleFactory.editArticle = function(union, article) {
      return $http.put(urlBase + union + '/articles/' + article.slug, article)
        .error(function(data, status, headers, config) {
          console.log("error", status);
        });
    }

    articleFactory.deleteArticle = function(union, article) {
      return $http.delete(urlBase + union + '/articles/' + article.slug)
        .error(function(data, status, headers, config) {
          console.log("error", status);
        });
    }

    return articleFactory;
  }
]);
