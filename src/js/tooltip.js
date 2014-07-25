define([
  "application"
], function(app) {

  app.directive("toolTip", function() {
    return {
      restrict: "E",
      transclude: true,
      scope: {
        position: "@"
      },
      template: "<div class='{{position}} tooltip-container'><span class='content' ng-transclude></span></div>"
    };
  });

})