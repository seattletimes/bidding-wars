define([
  "application",
  "text!_crumb.html"
], function(app, template) {

  app.directive("breadCrumb", function() {

    return {
      restrict: "E",
      transclude: true,
      template: template,
      scope: {
        model: "=",
        base: "@default"
      },
      link: function(scope, element, attrs) {
        scope.clear = function() {
          scope.model = scope.base || null;
        }

        scope.$watch("model", function(value) {
          var visible = value != scope.base;
          element.css({
            opacity: visible * 1,
            display: visible ? "inline-block" : "none"
          });
        });
      }
    }

  });

});