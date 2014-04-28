require('./services');
require('./controllers');
require('./directives');

var app = angular.module('nitApp', ['ngRoute', 'ngAnimate', 'nitControllers', 'nitDirectives', 'nitServices', 'ngQuickDate']);

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

app.config(function(ngQuickDateDefaultsProvider) {
  // Configure with icons from font-awesome
  return ngQuickDateDefaultsProvider.set({
    closeButtonHtml: '<i class="fa fa-times"></i>',
    buttonIconHtml: '<i class="fa fa-clock-o"></i>',
    nextLinkHtml: '<i class="fa fa-chevron-right"></i>',
    prevLinkHtml: '<i class="fa fa-chevron-left"></i>',
    dayAbbreviations: ['Sø', 'Ma', 'Ti', 'On', 'To', 'Fr', 'Lø'],
    dateFormat: 'dd/MM/yyyy',
    disableTimepicker: true
  });
});
