/**
 * PagesController
 */

module.exports = [
  '$rootScope',
  '$scope',
  '$routeParams',
  'articleService',
  function($rootScope, $scope, $routeParams, articleService) {
    $scope.articles = [];
    $scope.loading = true;

    $rootScope.title = 'Hjem';
    $scope.generalUnionSlug = 'generelt';

    $scope.update = function() {
      $scope.loading = true;
      articleService.findAll($scope.generalUnionSlug).then(function(articles) {
        $scope.articles = articles;
        $scope.loading = false;
      });
    };

    $scope.$on('union:changed', function(e) {
      $scope.update();
    });

    $scope.update();
  }
];
