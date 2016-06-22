/**
 * Created by Osvaldo on 23/09/15.
 */

app.controller("homeController", ['$scope', function ($scope) {
  $scope.showtexto = false;

  $scope.mostrapublic = function () {
    $scope.showtexto = true;
  };

  $scope.ocultapublic = function () {
    $scope.showtexto = false;
  };

}]);