
/**
 * Loading Indicator Directive
 * <nit-loading-indicator/>
 */

exports.nitLoadingIndicator = function() {
  return {
    restrict: 'E',
    template: '<div ng-class="{loading:loading}"><div class="loading-indicator spinner"><div class="dot1"></div><div class="dot2"></div></div></div>'
  };
};
