define([
  "application",
  "redfinData"
], function(app) {

  app.controller("tableController", ["$scope", "redfinData", function($scope, data) {

    data.ready.then(function() {
      $scope.data = data;
    });

    $scope.pick = function(row) {
      if (row.hoods) {
        data.filter = row.city;
      }
    }

  }]);

})