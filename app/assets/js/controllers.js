var nitControllers = angular.module('nitControllers', []);

nitControllers.controller('MainController',
  ['$scope', '$routeParams', 'unionService', function($scope, $routeParams, unionService) {

  $scope.name = $routeParams.slug;
  $scope.unions = [];
  $scope.chosenUnion = unionService.last();

  $scope.modalOpen = false;
  $scope.openModal = function() {
    $scope.modalOpen = true;
  };

  $scope.closeModal = function() {
    $scope.modalOpen = false;
  };

  unionService.findAll().success(function(unions) {
    $scope.unions = unions;
  });

  $scope.chooseUnion = function(union) {
    $scope.chosenUnion = union;
    unionService.save(union);
    $scope.closeModal();
    $scope.$broadcast('union:changed', union);
  };
}]);

nitControllers.controller('PageController',
  ['$scope', '$routeParams', 'articleService', function($scope, $routeParams, articleService) {
  $scope.article = {};
  $scope.slug = $routeParams.slug;

  $scope.update = function() {
    if ($scope.slug) {
      articleService.findBySlug($scope.chosenUnion._id, $scope.slug).success(function(article) {
        $scope.article = article;
      });
    }
  };

  $scope.$on('union:changed', function() {
    $scope.update();
  });

  $scope.update();
}]);

nitControllers.controller('PagesController',
  ['$scope', '$routeParams', 'articleService', function($scope, $routeParams, articleService) {

  $scope.articles = [];

  $scope.update = function() {
    articleService.findAll($scope.chosenUnion.slug).success(function(articles) {
      $scope.articles = articles;
    });
  };

  $scope.$on('union:changed', function(e) {
    $scope.update();
  });

  $scope.update();
}]);

nitControllers.controller('AdminController',
  ['$scope', 'articleService', function($scope, articleService) {

  $scope.union = union._id;
  $scope.articles = [];
  $scope.article = {priority: 1};
  $scope.priorities = _.range(1, 6);

  $scope.chooseArticle = function(article, selectedIndex) {
    $scope.selectedIndex = selectedIndex;
    $scope.article = article;
  };

  $scope.findAll = function() {
    articleService.findAll($scope.union).success(function (articles) {
      $scope.articles = articles;
      $scope.createArticle();
    });
  };

  $scope.findAll();

  $scope.createArticle = function() {
    $scope.selectedIndex = 0;
    $scope.article = {priority: 1};
  };

  $scope.saveArticle = function(article) {
    articleService.save($scope.union, article).success(function(data) {
      if (!article._id) {
        $scope.articles.push(data);
        $scope.createArticle();
      }
      else {
        $scope.articles[$scope.articles.indexOf($scope.article)] = data;
        $scope.article = data;
      }
    });
  };

  $scope.destroyArticle = function(article) {
    articleService.destroy($scope.union, article).success(function(data) {
      $scope.articles.splice($scope.articles.indexOf($scope.article), 1);
      $scope.article = {};
    });
  };
}]);
