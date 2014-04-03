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
  console.log("HEI");
  $scope.newArticle = true;
  Article.getArticles($scope.union)
    .success(function (articles) {
      $scope.articles = articles;
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
    $scope.chosenArticle = article;
    $scope.chosenPriority = article.priority;
    $scope.newArticle = false;
  }

  $scope.createNewArticle = function() {
    $scope.newArticle = true;
    $scope.chosenArticle = {};
    $scope.chosenPriority = 1;
  }

  $scope.submitArticle = function() {
    console.log("submitting", $scope.chosenArticle);
    if ($scope.newArticle) {
      Article.newArticle($scope.union, $scope.chosenArticle)
        .success(function(success) {
          console.log("succ", success);
        })
        .error(function(error) {
          console.log("error", error);
        });
    }
    else {
      Article.editArticle($scope.union, $scope.chosenArticle)
        .success(function(success) {
          console.log("success", success);
        })
        .error(function(error) {
          console.log("error", error);
        });
    }
  }

  $scope.deleteArticle = function() {
    console.log("deleting");
    Article.deleteArticle($scope.union, $scope.chosenArticle)
      .success(function(success) {
        console.log('success', success);
      })
      .error(function(error) {
        console.log('error', error);
      });
  }

}]);