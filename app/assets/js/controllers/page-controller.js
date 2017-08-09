/**
 * PageController
 */

module.exports = ['$rootScope', '$scope', '$location', '$routeParams', 'articleService', function($rootScope, $scope, $location, $routeParams, articleService) {
  $scope.loading = true;
  $scope.article = {};

  $rootScope.title = '';
  $scope.dateToHumanReadable = function(date) {
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    return [
      (dd < 10 ? '0' : '') + dd,
      (mm < 10 ? '0' : '') + mm,
      date.getFullYear()
    ].join('.');
  };

  $scope.update = function() {
    $scope.loading = true;
    if ($routeParams.unionSlug && $routeParams.articleSlug) {
      var union = $routeParams.unionSlug;
      articleService.findBySlug(union, $routeParams.articleSlug).success(function(article) {
        $scope.article = article;
        $rootScope.title = $scope.article.title;

        $scope.lastModified = $scope.dateToHumanReadable(
          new Date(article.lastModified || article.createdAt)
        );
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
