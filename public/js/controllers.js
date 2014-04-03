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
  $scope.union = 'abakus'; // test
  console.log("HEI");
  Article.getArticles($scope.union)
    .success(function (articles) {
      $scope.articles = articles;
      console.log($scope.articles[0].title);
    })
    .error(function (error) {
      console.log("error loading shit");
  });

  var maxPriority = 5;
  $scope.priorities = [];
  for (var i = 1; i <= maxPriority; i++) {
    $scope.priorities.push(i);
  }
  $scope.chosenPriority = 1;

  $scope.chooseArticle = function(article) {
    console.log('clicked article');
    $scope.chosenArticle = article;
    $scope.chosenPriority = article.priority;
  }

  $scope.newArticle = function() {
    $scope.chosenArticle = {};
    $scope.chosenPriority = 1;
  }

  $scope.submitArticle = function() {
    console.log("submitting");
    if ($scope.chosenArticle) {
      Article.editArticle($scope.union, $scope.chosenArticle)
        .success(function(wut) {
          console.log("succ", wut);
        })
        .error(function(error) {
          console.log("error", error);
        });
    }
    else {
      Article.newArticle($scope.union, $scope.chosenArticle);
    }
  }
}]);