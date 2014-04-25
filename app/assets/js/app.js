require('./services');
require('./controllers');

var app = angular.module('nitApp', ['ngRoute', 'ngAnimate', 'nitControllers', 'nitServices']);

app.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
   .when('/:slug', {
     templateUrl: 'partials/page',
     controller: 'PageController'
   })
   .otherwise({
     templateUrl: 'partials/front',
     controller: 'PagesController'
   });

});
