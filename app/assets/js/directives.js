var nitDirectives = angular.module('nitDirectives', []);

nitDirectives.directive('dhxScheduler', function() {
  return {
    restrict: 'A',
    scope: false,
    transclude: true,
    template: '<div class="dhx_cal_navline" ng-transclude></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>',

    link: function($scope, $element, $attrs, $controller) {

      $element.addClass('dhx_cal_container');

      scheduler.init($element[0], new Date(), 'month');
    }
  };
});
