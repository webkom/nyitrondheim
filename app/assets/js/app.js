require('./services');
require('./controllers');
require('./directives');

var app = angular.module('nitApp', ['ngRoute', 'ngAnimate', 'nitControllers', 'nitDirectives', 'nitServices']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/:slug', {
    templateUrl: 'partials/page',
    controller: 'PageController'
   })
   .when('/calendar', {
    templateUrl: 'calendar',
    controller: 'CalendarController',
   })
   .otherwise({
     templateUrl: 'partials/front',
     controller: 'PageController'
   });
});
