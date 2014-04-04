var nitControllers = angular.module('nitControllers', []);

nitControllers.controller('MainController',
['$scope', '$routeParams', 'localStorageService', function($scope, $routeParams, localStorageService) {

  $scope.fraternities = ["Abakus", "Online", "Volvox og Alkymisten", "Pareto", "EMIL", "Nabla", "Delta", "Janus", "AF Smørekoppen", "Mordi", "C++"];

  $scope.name = $routeParams.slug;
  $scope.chosenFraternity = localStorageService.get('fraternity');

  $scope.modalOpen = false;
  $scope.openModal = function() {
    $scope.modalOpen = true;
  };

  $scope.closeModal = function() {
    $scope.modalOpen = false;
  };

  $scope.chooseFraternity = function(fraternity) {
    $scope.chosenFraternity = fraternity;
    localStorageService.add('fraternity', fraternity);
    $scope.closeModal();
  };
}]);

nitControllers.controller('PageController', ['$scope', '$routeParams', function($scope, $routeParams) {
  console.log($scope.chosenFraternity)
}]);

nitControllers.controller('AdminController',
['$scope', 'Article', function($scope, Article) {
  $scope.union = '533ddf1d704547f33ef1df98'; // test

  $scope.articles = [];
  $scope.article  = {};

  $scope.findAll = function() {
    Article.findAll($scope.union)
      .success(function (articles) {
        $scope.articles = articles;
        $scope.article = $scope.articles[0];
      });
  };

  $scope.findAll();

  // Create priority array from max priority
  var maxPriority = 5;
  $scope.priorities = [];
  for (var i = 1; i <= maxPriority; i++) {
    $scope.priorities.push(i);
  }

  $scope.chooseArticle = function(article) {
    $scope.article = article;
  };

  $scope.createArticle = function() {
    $scope.article = {};
  };

  $scope.saveArticle = function(article) {
    Article.save($scope.union, article).success(function(data) {
      if (!article._id) $scope.articles.push(data);
    });
  };

  $scope.destroyArticle = function(article) {
    Article.destroy($scope.union, article).success(function(data) {
      $scope.articles.splice($scope.articles.indexOf($scope.article), 1);
      $scope.article = {};
    });
  };
}]);
