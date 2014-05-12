/**
 * PageController
 */
 
module.exports = ['$rootScope', '$scope', '$location', '$routeParams', 'articleService', function($rootScope, $scope, $location, $routeParams, articleService) {
  $scope.loading = true;
  $scope.article = {};

  $rootScope.title = '';

  $scope.update = function() {
    $scope.loading = true;
    if ($routeParams.unionSlug && $routeParams.articleSlug) {
      var union = $routeParams.unionSlug;
      articleService.findBySlug(union, $routeParams.articleSlug).success(function(article) {
        $scope.article = article;
        $rootScope.title = $scope.article.title;
        $scope.loading = false;
      }).error(function() {
        $scope.article.title = '404';
        $scope.article.body = 'Fant ikke denne artikkelen.';
        $scope.loading = false;
      });
    }
  };

  $scope.$on('union:changed', function() {
    $scope.update();
  });

  $scope.update();
}];
