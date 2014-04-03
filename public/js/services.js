var nitServices = angular.module('nitServices', ['ngResource']);

nitServices.factory('Article', ['$http', function($http) {
    var urlBase = '/api/unions/';
    var articleFactory = {};

    articleFactory.getArticles = function(union) {
      return $http.get(urlBase + union + '/articles');
    }

    articleFactory.newArticle = function(union, article) {
      return $http.post(urlBase + union + '/articles', article);
    }

    articleFactory.editArticle = function(union, article) {
      return $http.put(urlBase + union + '/articles/' + article.slug, article);
    }

    return articleFactory;
  }
]);