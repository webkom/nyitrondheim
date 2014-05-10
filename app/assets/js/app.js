require('./services');
require('./controllers');

var app = angular.module('nitApp',
  ['ngRoute', 'nitControllers', 'nitServices', 'ui.calendar', 'ui.bootstrap', 'textAngular', 'angularFileUpload']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');
  $routeProvider
   .when('/', {
     templateUrl: 'partials/front',
     controller: 'PagesController'
   })
   .when('/calendar', {
     templateUrl: 'partials/calendar',
     controller: 'CalendarController'
   })
   .when('/admin', {
    templateUrl: 'partials/admin/overview',
    controller: 'AdminController'
   })
   .when('/admin/overview', {
    templateUrl: 'partials/admin/overview',
    controller: 'AdminController'
   })
   .when('/admin/specific', {
    templateUrl: 'partials/admin/specific',
    controller: 'AdminController'
   })
   .when('/admin/unions', {
    templateUrl: 'partials/admin/unions',
    controller: 'UnionAdminController'
   })
   .when('/:unionSlug/:articleSlug*', {
     templateUrl: 'partials/page',
     controller: 'PageController'
   })
   .otherwise({
     templateUrl: 'partials/front',
     controller: 'PagesController'
   });
}]);

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

app.filter('limitDescription', function() {
  return function(input) {
    input = input || '';
    var arr = input.split('.');
    if (arr[0].length > 95) {
      return arr[0].slice(0, 95) + '…';
    }
    return arr[0] + '.';
  };
});

app.filter('exists', function() {
  return function(obj) {
    return obj !== null && obj !== undefined && obj !== 'null' && obj !== 'undefined';
  };
});

app.directive('nitLoadingIndicator', function() {
  return {
    restrict: 'E',
    template: '<div ng-class="{loading:loading}"><div class="loading-indicator spinner"><div class="dot1"></div><div class="dot2"></div></div></div>'
  };
});
