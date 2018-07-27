/**
 * Ny i Trondheim
 */
require('../css/style.styl');

require('../../../public/vendor/jquery-ui/ui/jquery-ui.js');
require('../../../public/vendor/ng-file-upload/angular-file-upload-html5-shim.js');
require('../../../public/vendor/angular/angular.min.js');
require('../../../public/vendor/angular-i18n/angular-locale_no.js');
require('../../../public/vendor/angular-local-storage/angular-local-storage.min.js');
require('../../../public/vendor/angular-route/angular-route.min.js');
require('../../../public/vendor/lodash/dist/lodash.min.js');
require('../../../public/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js');
require('../../../public/vendor/fullcalendar/fullcalendar.js');
require('../../../public/vendor/angular-ui-calendar/src/calendar.js');
require('../../../public/vendor/textAngular/textAngular-sanitize.js');
require('../../../public/vendor/textAngular/textAngular.js');
require('../../../public/vendor/momentjs/min/moment.min.js');
require('../../../public/vendor/ng-file-upload/angular-file-upload.js');

var app = angular.module('nitApp', [
  'ngRoute',
  'nitControllers',
  'nitServices',
  'ui.calendar',
  'ui.bootstrap',
  'textAngular',
  'angularFileUpload',
  'LocalStorageModule'
]);

/**
 * Route Setup
 */

app.config([
  '$routeProvider',
  '$locationProvider',
  function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

    $routeProvider
      .when('/', {
        templateUrl: 'partials/front',
        controller: 'PagesController'
      })
      .when('/kalender', {
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
        templateUrl: 'partials/404',
        controller: 'PagesController'
      });
  }
]);

/**
 * textAngular configuration
 */

app.config([
  '$provide',
  function($provide) {
    $provide.decorator('taOptions', [
      '$delegate',
      function(taOptions) {
        taOptions.toolbar = [
          ['bold', 'italics', 'underline', 'h1', 'h2', 'ul', 'quote'],
          ['undo', 'redo', 'clear'],
          ['insertImage', 'insertLink', 'unlink', 'html']
        ];
        return taOptions;
      }
    ]);
  }
]);

/**
 * Controllers
 */

require('./controllers');

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
