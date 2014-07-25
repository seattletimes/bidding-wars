define([
  "application",
  "redfinData"
], function(app) {

  app.directive("arrow", ["redfinData", function(data) {
    return {
      restrict: "A",
      link: function(scope, element, attr) {
        var arrow = attr.arrow;
        var change = function() {
          var match;
          if (arrow == "location") {
            match = data.sortKey in { city: true, neighborhood: true };
          } else {
            match = data.sortKey == arrow;
          }
          element.toggleClass("sorted", match);
          element.toggleClass("down", match && data.sortDesc);
        }
        scope.$watch(change);
      }
    }
  }]);
});