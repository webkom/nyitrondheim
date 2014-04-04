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
  console.log($scope.chosenFraternity);
}]);

nitControllers.controller('AdminController',
['$scope', 'Article', function($scope, Article) {
  $scope.union = '533ddf1d704547f33ef1df98'; // test

  $scope.findAll = function() {
    Article.findAll($scope.union)
      .success(function (articles) {
        $scope.articles = articles;
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
    $scope.chosenArticle = article;
  };

  $scope.createNewArticle = function() {
    $scope.chosenArticle = {};
    $scope.chosenArticle.priority = 1;
  };

  $scope.createNewArticle();

  $scope.submitArticle = function() {
    console.log("submitting", $scope.chosenArticle);
    if ($scope.chosenArticle._id) {
      Article.update($scope.union, $scope.chosenArticle)
        .success(function(data, status, headers, config) {
          $scope.articles[$scope.articles.indexOf($scope.chosenArticle)] = data;
          $scope.chosenArticle = data;
          console.log("success", data, status);
        });
    }
    else {
      Article.create($scope.union, $scope.chosenArticle)
        .success(function(data, status, headers, config) {
          $scope.articles.push(data);
          $scope.createNewArticle();
          console.log("success", data, status);
        });
    }
  };

  $scope.deleteArticle = function() {
    console.log("deleting");
    Article.delete($scope.union, $scope.chosenArticle)
      .success(function(data, status, headers, config) {
        $scope.articles.splice($scope.articles.indexOf($scope.chosenArticle), 1);
        $scope.createNewArticle();
        console.log('success', data, status);
      });
  };
}]);
