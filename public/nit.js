
// var chooseButton = document.getElementById('choose-fraternity');
// var modalContainer = document.getElementById('modal-container');
//
// chooseButton.addEventListener('click', function() {
//   modalContainer.classList.add('active');
// });
//
// modalContainer.addEventListener('click', function() {
//   modalContainer.classList.remove('active');
// });

var app = angular.module('nyitrondheim', ['ngRoute', 'ngAnimate', 'LocalStorageModule']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/:slug', {
     templateUrl: 'page.html',
     controller: 'PageController'
  })
});

app.controller('MainController',
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

app.controller('PageController', ['$scope', '$routeParams', function($scope, $routeParams) {
  console.log($scope.chosenFraternity)
}]);
