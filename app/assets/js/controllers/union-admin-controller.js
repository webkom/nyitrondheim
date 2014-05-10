/**
 * UnionAdminController
 */

module.exports = ['$scope', 'unionService', function($scope, unionService) {

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
        if (!union._id) {
          $scope.unions.push(data);
          $scope.createUnion();
        }
        else {
          $scope.unions[$scope.unions.indexOf($scope.unions)] = data;
          $scope.union = data;
        }
      });
    };
}];
