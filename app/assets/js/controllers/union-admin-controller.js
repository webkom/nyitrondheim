/**
 * UnionAdminController
 */

module.exports = ['$scope', '$timeout', 'unionService', function($scope, $timeout, unionService) {

  $scope.union = {};
  $scope.unions = [];
  $scope.loading = true;

  unionService.findAll().success(function(unions) {
    $scope.loading = false;
    $scope.unions = unions;
  });

  $scope.alerts = {
    danger: { type: 'danger', msg: 'Oops, noe gikk galt :(. Prøv igjen!' },
    success: { type: 'success', msg: 'Ferdig!' }
  };

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
        $scope.addAlert($scope.alerts.success);
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
        $scope.addAlert($scope.alerts.danger);
      });
  };

  $scope.destroyUnion = function(union) {
    unionService.destroy(union).success(function(data) {
      $scope.addAlert($scope.alerts.success);
      $scope.unions.splice($scope.unions.indexOf(union), 1);
      $scope.union = {};
    })
    .error(function(err) {
      console.log('Error:', err);
      $scope.addAlert($scope.alerts.danger);
    });
  };

  $scope.addAlert = function(alert) {
    $scope.alert = alert;
    // Fade the alert out after a second, remove it after 0,7 seconds.
    $timeout(function() {
      $scope.fade = true;
      $timeout(function() {
        $scope.alert = null;
        $scope.fade = false;
      }, 700);
    }, 1000);
  };

}];
