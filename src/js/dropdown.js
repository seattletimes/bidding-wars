define([
  "application",
  "text!_dropdown.html"
], function(app, template) {
  app.directive("dropDown", function() {
    var timer = null;

    return {
      restrict: "E",
      template: template,
      transclude: true,
      scope: {
        model: "=",
        options: "="
      },
      link: function(scope, element, attrs) {
        if (!scope.options) {
          scope.options = [];
        }

        element.on("click", function(e) {
          var $target = angular.element(e.target);
          var value = $target.attr("data-value");
          if (value) {
            for (var i = 0; i < scope.options.length; i++) {
              var option = scope.options[i];
              if (option.data == value) {
                scope.selected = option;
                scope.model = option.data;
                scope.$apply();
                break;
              }
            }
          }
          element.toggleClass("open");
        });

        //don't immediately leave in case users are moving to the menu
        element.on("mouseleave", function(e) {
          timer = setTimeout(function() {
            element.removeClass("open");
          }, 300);
        });

        //on move, clear the "close" timer
        element.on("mousemove", function(e) {
          clearTimeout(timer);
          timer = null;
        });

        scope.selected = scope.options[0];
        var onchange = function() {
          for (var i = 0; i < scope.options.length; i++) {
            if (scope.options[i].data == scope.model) {
              scope.selected = scope.options[i];
              return;
            }
          }
          scope.selected = scope.options[0];
        };
        scope.$watch("model", onchange);
        scope.$watch("options", onchange);
      }
    }
  });
});