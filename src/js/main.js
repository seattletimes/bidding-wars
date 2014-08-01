require([
  "application",
  "share.min.js",
  "filters",
  "heatController",
  "tableController",
  "filterbox",
  "breadcrumb",
  "arrow",
  "tooltip"
], function(app, Share) {

  new Share(".share-button", {
    ui: {
      flyout: "top left"
    }
  });

  angular.bootstrap(document, [app.name]);

});