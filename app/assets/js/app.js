require('./services');
require('./controllers');
require('./directives');

var app = angular.module('nitApp', ['ngRoute', 'ngAnimate', 'nitControllers', 'nitDirectives', 'nitServices', 'ui.calendar', 'ui.bootstrap', 'textAngular']);

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


app.config(function($provide){
  // this demonstrates how to register a new tool and add it to the default toolbar
  $provide.decorator('taOptions', ['$delegate', function(taOptions){
    // $delegate is the taOptions we are decorating
    // here we override the default toolbars and classes specified in taOptions.
    taOptions.toolbar = [
        ['bold', 'italics', 'underline', 'redo', 'undo', 'clear'],
        ['insertImage', 'insertLink', 'unlink']
    ];
    return taOptions; // whatever you return will be the taOptions
  }]);
});
