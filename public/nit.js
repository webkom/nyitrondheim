
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

var app = angular.module('nyitrondheim', ['ngRoute', 'ngAnimate']);

app.config(function($routeProvider, $locationProvider) {

  $routeProvider
   .when('/:slug', {
    templateUrl: 'templates/page.html',
    controller: 'MainController',
  })

  //$locationProvider.html5Mode(true);
});

app.controller('MainController', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.fraternities = ["Abakus", "Online", "Volvox og Alkymisten", "Pareto", "EMIL", "Nabla", "Delta", "Janus", "AF Smørekoppen", "Mordi", "C++"];

  $scope.name = $routeParams.slug;
  $scope.chosenFraternity = null;

  $scope.modalOpen = false;
  $scope.openModal = function() {
    $scope.modalOpen = true;
  };

  $scope.closeModal = function() {
    $scope.modalOpen = false;
  };

  $scope.chooseFraternity = function(fraternity) {
    $scope.chosenFraternity = fraternity;
    $scope.closeModal();
  };
}]);
