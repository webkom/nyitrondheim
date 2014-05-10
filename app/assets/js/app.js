
var app = angular.module('nitApp',
  ['ngRoute', 'nitServices', 'ui.calendar', 'ui.bootstrap', 'textAngular', 'angularFileUpload', 'LocalStorageModule']);

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

app.config(['$provide', function($provide){
  $provide.decorator('taOptions', ['$delegate', function(taOptions){
    taOptions.toolbar = [
        ['bold', 'italics', 'underline', 'redo', 'undo', 'clear'],
        ['insertImage', 'insertLink', 'unlink']
    ];
    return taOptions;
  }]);
}]);

/**
 * Controllers
 */

app.controller('MainController', require('./controllers/main-controller'))
app.controller('PageController', require('./controllers/page-controller'))
app.controller('PagesController', require('./controllers/pages-controller'))
app.controller('CalendarController', require('./controllers/calendar-controller'))
app.controller('AdminController', require('./controllers/admin-controller'))
app.controller('UnionAdminController', require('./controllers/union-admin-controller'));

/**
 * Services
 */

require('./services');


/**
 * Filters
 */

var filters = require('./filters');
Object.keys(filters).forEach(function(filter) {
  app.filter(filter, filters[filter]);
});

/**
 * Directives
 */

var directives = require('./directives');
Object.keys(directives).forEach(function(directive) {
  app.directive(directive, directives[directive]);
});
