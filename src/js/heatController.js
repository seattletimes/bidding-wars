define([
  "application"
], function(app) {

  app.controller("heatController", ["$scope", "redfinData", function($scope, data) {

    $scope.data = data;

    $scope.modes = [
      { label: "Single-family", data: "sf" },
      { label: "Condos", data: "condo" }
    ];

    $scope.options = [];

    $scope.selectBox = function(column) {
      if (!column.length) return;
      if (data.selected == column) {
        data.selected = null;
      } else {
        data.selected = column;
      }
    }

  }]);

})