require('./services');
require('./controllers');
require('./directives');

var app = angular.module('nitApp', ['ngRoute', 'ngAnimate', 'nitControllers', 'nitDirectives', 'nitServices']);

app.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
   .when('/', {
     templateUrl: 'partials/front',
     controller: 'PagesController'
   })
   .when('/:slug*', {
     templateUrl: 'partials/page',
     controller: 'PageController'
   })
   .otherwise({
     templateUrl: 'partials/front',
     controller: 'PagesController'
   });
});
