define([
  "application",
  "redfinData"
], function(app) {

  app.filter("heat", ["redfinData", function(data) {
    return function(value) {
      var top = [240, 80, 30];
      var metadata = data.metadata;
      var scaler = value / metadata.all.highest;
      var values = top.map(function(c) {
        return Math.round(255 - (255 - c) * scaler);
      });
      return "rgb(" + values.join(",") + ")";
    };
  }]);

  app.filter("formatPercentage", function() {
    return function(value, precision) {
      if (typeof precision == "undefined") {
        precision = 1;
      }
      var rounded = (value * 100).toFixed(precision);
      return rounded + "%";
    }
  });

  var commafy = function(s) {
    s = s + "";
    for (var i = s.length - 3; i > 0; i -= 3) {
      s = s.slice(0, i) + "," + s.slice(i);
    }
    return s;
  }

  app.filter("formatMoney", function() {
    return function(value) {
      return "$" + commafy(value);
    }
  });

  app.filter("priceRange", function() {
    return function(index, mode) {
      if (!mode) return "";
      var labels = {
        sf: ["<$350k", "350k - 500k", "500k - 750k", ">750k"],
        condo: ["<$175k", "175k - 300k", "300k - 425k", ">425k"]
      };
      return labels[mode][index];
    };
  });

  app.filter("names", function() {
    return function(value) {
      return value.map(function(r) { return r.neighborhood || r.city }).join(", ");
    }
  });

  app.filter("strings", function() {
    var strings = {
      sf: "Single-Family",
      condo: "Condos",
      cities: "All Cities",
      listLabel0: "<10%",
      listLabel1: "10-20%",
      listLabel2: "20-30%",
      listLabel3: "30-40%",
      listLabel4: "40-50%",
      listLabel5: ">50%"
    }

    return function(value) {
      if (value in strings) {
        return strings[value];
      }
      return value;
    }
  })

});