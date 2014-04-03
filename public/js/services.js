var nitServices = angular.module('nitServices', ['ngResource']);

nitServices.factory('Article', ['$resource',
  function($resource) {
    return $resource('api/unions/:union/articles', {}, {
      query: {
        method: 'GET',
        params: {union_id: 'abakus'},
        isArray: true
      }
    });
  }
]);