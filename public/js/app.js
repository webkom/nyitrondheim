
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

var app = angular.module('nitApp', ['ngRoute', 'ngAnimate', 'LocalStorageModule', 'nitControllers', 'nitServices']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/:slug', {
     templateUrl: 'partials/page',
     controller: 'PageController'
  })
});
