/**
 * UnionAdminController
 */

module.exports = ['$scope', '$timeout', 'unionService', 'alertService',
function($scope, $timeout, unionService, alertService) {

  $scope.union = {};
  $scope.unions = [];
  $scope.loading = true;

  unionService.findAll().success(function(unions) {
    $scope.loading = false;
    $scope.unions = unions;
  });

  $scope.chooseUnion = function(union, selectedIndex) {
    $scope.selectedIndex = selectedIndex;
    $scope.union = union;
  };

  $scope.createUnion = function() {
    $scope.union = {};
    $scope.selectedIndex = 0;
  };

  $scope.saveUnion = function(union) {
    unionService.save(union)
      .success(function(data) {
        alertService.addSuccess();
        if (!union._id) {
          $scope.unions.push(data);
          $scope.createUnion();
        }
        else {
          $scope.unions[$scope.unions.indexOf($scope.unions)] = data;
          $scope.union = data;
        }
      })
      .error(function(err) {
        console.log('Error:', err);
        alertService.addError();
      });
  };

  $scope.destroyUnion = function(union) {
    unionService.destroy(union).success(function(data) {
      alertService.addSuccess();
      $scope.unions.splice($scope.unions.indexOf(union), 1);
      $scope.union = {};
    })
    .error(function(err) {
      console.log('Error:', err);
      alertService.addError();
    });
  };
}];
