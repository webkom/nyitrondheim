var nitServices = angular.module('nitServices', ['ngResource']);

nitServices.factory('Article', ['$http', function($http) {
    var urlBase = '/api/unions/';
    var articleFactory = {};

    articleFactory.getArticles = function(union) {
      return $http.get(urlBase + union + '/articles');
    }

    articleFactory.newArticle = function(union, article) {
      console.log("posting", union, article);
      return $http.post(urlBase + union + '/articles', article);
    }

    articleFactory.editArticle = function(union, article) {
      return $http.put(urlBase + union + '/articles/' + article.slug, article);
    }

    articleFactory.deleteArticle = function(union, article) {
      return $http.delete(urlBase + union + '/articles/' + article.slug);
    }

    return articleFactory;
  }
]);