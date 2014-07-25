require([
  "application",
  "share.min.js",
  "filters",
  "heatController",
  "tableController",
  "dropdown",
  "tooltip",
  "filterbox",
  "breadcrumb",
  "arrow"
], function(app, Share) {

  new Share(".share-button", {
    ui: {
      flyout: "bottom left"
    }
  });

  angular.bootstrap(document, [app.name]);

});