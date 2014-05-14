
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

/**
 * Focus-Input Directive
 * Add focus-input to an input, will focus it when the given value is true.
 */

exports.focusInput = function() {
  return function(scope, elem, attr) {
    scope.$on(attr.focusInput, function(e) {
      elem[0].focus();
    });
  };
};
