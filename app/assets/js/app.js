
require('./services');
require('./controllers');

var app = angular.module('nitApp', ['ngRoute', 'ngAnimate', 'LocalStorageModule', 'nitControllers', 'nitServices']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/:slug', {
     templateUrl: 'partials/page',
     controller: 'PageController'
  })
});
