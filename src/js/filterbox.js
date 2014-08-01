define([
  "application",
  "text!_filter.html"
], function(app, template) {

  app.directive("filterBox", function() {

    return {
      restrict: "E",
      scope: {
        model: "=",
        select: "&",
        placeholder: "@"
      },
      template: template,
      link: function(scope, element, attrs) {

        scope.results = [];
        scope.selectedIndex = 0;

        var ul = element.find("ul")[0];

        scope.$watch("search", function(value) {
          if (!scope.search) {
            scope.results = []
            return;
          };
          var re = new RegExp(value, "i");
          scope.results = scope.model
            .filter(function(item) {
              return item.neighborhood ? item.neighborhood.match(re) : item.city.match(re);
            })
            .sort(function(a, b) {
              var aValue = a.neighborhood || a.city;
              var bValue = b.neighborhood || b.city;
              if (aValue < bValue) return -1;
              if (bValue < aValue) return 1;
              return 0;
            });
        });

        scope.selectItem = function(item) {
          scope.select({ value: item });
          element.find("ul")[0].scrollTop = 1;
          scope.results = [];
          scope.search = "";
        };

        element.on("keyup", function(e) {
          if (e.keyCode == 38) { //up
            scope.selectedIndex--;
          } else if (e.keyCode == 40) { //down
            scope.selectedIndex++;
          } else if (e.keyCode == 13) { //enter
            scope.selectItem(scope.results[scope.selectedIndex]);
          } else if (e.keyCode == 27) { //esc
            scope.results = [];
            element.find("input")[0].blur();
          } else { //just typing
            scope.selectedIndex = 0;
          }
          scope.selectedIndex %= scope.results.length;
          if (scope.selectedIndex < 0) {
            scope.selectedIndex = scope.results.length + scope.selectedIndex;
          }
          scope.$apply();
          setTimeout(function() {
            var selected = ul.querySelector(".selected")
            if (!selected) return;
            var top = selected.offsetTop
            if (top < ul.scrollTop || top >= ul.scrollTop + ul.offsetHeight) {
              ul.scrollTop = top;
            }
          }, 100);
        });

      }
    }

  })

});