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
    unionService.save();
    $scope.closeModal();
  };
}]);

nitControllers.controller('PageController', ['$scope', '$routeParams', function($scope, $routeParams) {
  console.log($scope.chosenFraternity);
  console.log($routeParams)
}]);

nitControllers.controller('AdminController',
['$scope', 'Article', function($scope, Article) {
  $scope.union = '533ddf1d704547f33ef1df98'; // test

  $scope.articles = [];
  $scope.article = {priority: 1};
  $scope.priorities = _.range(1, 6);

  $scope.chooseArticle = function(article) {
    $scope.article = article;
  };

  $scope.findAll = function() {
    Article.findAll($scope.union)
      .success(function (articles) {
        $scope.articles = articles;
        $scope.createArticle();
      });
  };

  $scope.findAll();

  $scope.createArticle = function() {
    $scope.article = {priority: 1};
  };

  $scope.saveArticle = function(article) {
    Article.save($scope.union, article).success(function(data) {
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
    Article.destroy($scope.union, article).success(function(data) {
      $scope.articles.splice($scope.articles.indexOf($scope.article), 1);
      $scope.article = {};
    });
  };
}]);
