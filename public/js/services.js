var nitServices = angular.module('nitServices', ['ngResource']);

nitServices.factory('Article', ['$http', function($http) {
    var urlBase = '/api/unions/';
    var articleFactory = {};

    articleFactory.getArticles = function(union) {
      return $http.get(urlBase + union + '/articles');
    }

    return articleFactory;
  }
]);