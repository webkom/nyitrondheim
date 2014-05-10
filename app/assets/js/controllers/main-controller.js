/**
 * MainController
 */

module.exports = ['$scope', '$routeParams', 'unionService', function($scope, $routeParams, unionService) {

  $scope.name = $routeParams.slug;
  $scope.unions = [];
  $scope.chosenUnion = unionService.last();
  $scope.before = true;

  $scope.modalOpen = false;
  $scope.openModal = function() {
    $scope.modalOpen = true;
  };

  $scope.closeModal = function() {
    $scope.modalOpen = false;
  };

  unionService.findAll().success(function(unions) {
    $scope.unions = unions.map(function(union) {
      union.schoolSlug = union.school.toLowerCase();
      return union;
    });
  });

  $scope.chooseUnion = function(union) {
    $scope.chosenUnion = union;
    unionService.pick(union);
    $scope.closeModal();
    $scope.$broadcast('union:changed', union);
  };
}];
