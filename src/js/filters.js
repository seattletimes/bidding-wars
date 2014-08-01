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
    return function(value, precision, first) {
      if (typeof precision == "undefined") {
        precision = 1;
      }
      var rounded = (value * 100).toFixed(precision);
      if (typeof first == "undefined" || first) rounded += "%";
      return rounded;
    }
  });

  var commafy = function(s) {
    s = s + "";
    for (var i = s.length - 3; i > 0; i -= 3) {
      s = s.slice(0, i) + "," + s.slice(i);
    }
    return s;
  }

  app.filter("formatNumber", function() {
    return function(value) {
      return commafy(value);
    }
  });

  app.filter("formatMoney", function() {
    return function(value, first) {
      if (typeof first == "undefined" || first) {
        return "$" + commafy(value);
      }
      return commafy(value);
    }
  });

  app.filter("priceRange", function() {
    return function(index, mode) {
      if (!mode) return "";
      var labels = {
        sf: ["Less than $350,000", "$350,000 - $500,000", "$500,000 - $750,000", "More than $750,000"],
        condo: ["Less than $175,000", "$175,000 - $300,000", "$300,000 - $425,000", "More than $425,000"]
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
  });

  app.filter("location", function() {
    return function(value, mode) {
      if (mode == "cities") {
        return value > 1 ? "cities" : "city";
      }
      return value > 1 ? "neighborhoods" : "neighborhood";
    }
  });

});