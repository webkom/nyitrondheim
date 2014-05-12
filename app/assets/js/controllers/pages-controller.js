/**
 * PagesController
 */

module.exports = ['$rootScope', '$scope', '$routeParams', 'articleService', function($rootScope, $scope, $routeParams, articleService) {

  $scope.articles = [];
  $scope.loading = true;

  $rootScope.title = 'Hjem';

  $scope.update = function() {
    $scope.loading = true;
    articleService.findAll($scope.chosenUnion._id).then(function(articles) {
      console.log($scope.articles)
      $scope.articles = articles;
      $scope.loading = false;
    });
  };

  $scope.$on('union:changed', function(e) {
    $scope.update();
  });

  $scope.update();
}];
