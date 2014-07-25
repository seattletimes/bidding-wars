define([
  "application"
], function(app) {

  app.service("redfinData", ["$http", "$q", function($http, q) {

    var cities = [];
    var cityMap = {};
    var neighborhoods = [];
    var source = {
      sf: {
        cities: [],
        neighborhoods: [],
        all: []
      },
      condo: {
        cities: [],
        neighborhoods: [],
        all: []
      }
    }

    var rows = 6;
    var columns = 4;

    var buckets = {
      sf: ["x<350", "x<500", "x<750", "true"],
      condo: ["x<175", "x<300", "x<425", "true"]
    };

    ["sf", "condo"].forEach(function(key) {
      buckets[key] = buckets[key].map(function(comparison) {
        return new Function("x", "return " + comparison);
      });
    });

    var mode = "sf";
    var filter = "cities";
    var selected = null;
    var hood = null;

    var getFiltered = function() {
      if (filter == "cities") {
        return source[mode].cities;
      }
      if (filter == "neighborhoods") {
        return source[mode].neighborhoods;
      }
      return source[mode].neighborhoods.filter(function(item) {
        return item.city == filter;
      });
    };

    var binData = function(data) {
      var bins = [];
      var priceComp = buckets[mode];
      //pre-populate empty bins
      for (var r = 0; r < rows; r++) {
        bins[r] = [];
        for (var c = 0; c < columns; c++) {
          bins[r][c] = [];
        }
      }
      for (var i = 0; i < data.length; i++) {
        var row = data[i];
        //find index of above list % sales
        var aboveList = Math.min(Math.floor(row.aboveList * 10), rows - 1);
        //run through price filters to find the first matching index
        var price = priceComp.map(function(f) {
          return f(row.price / 1000);
        }).indexOf(true);
        bins[aboveList][price].push(row);
      }
      var across = {
        totals: [],
        highest: []
      };
      var down = {
        totals: [],
        highest: []
      };
      var all = {
        total: 0,
        highest: 0
      }
      //iterate through grid to find metadata
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < columns; c++) {
          var item = bins[r][c];
          var count = item.length;
          across.totals[r] = count + (across.totals[r] || 0);
          if (!across.highest[r] || across.highest[r] < count) {
            across.highest[r] = count;
          }
          down.totals[c] = count + (down.totals[c] || 0);
          if (!down.highest[c] || down.highest[c] < count) {
            down.highest[c] = count;
          }
          all.total += count;
          if (all.highest < count) {
            all.highest = count;
          }
        }
      }
      facade.metadata = {
        across: across,
        down: down,
        all: all
      }
      facade.binned = bins;
    }

    var facade = {
      list: [],
      binned: [],
      get selected() {
        return selected;
      },
      set selected(value) {
        selected = value;
        hood = null;
      },
      get selectedHood() {
        return hood;
      },
      set selectedHood(value) {
        hood = value;
      },
      filterCities: [],
      metadata: {},
      get mode() {
        return mode;
      },
      set mode(value) {
        mode = value;
        var data = getFiltered();
        this.selected = null;
        this.list = data;
        binData(data);
      },
      get filter() {
        return filter;
      },
      set filter(value) {
        filter = value;
        facade.selectedCity = cityMap[value];
        facade.sortKey = value == "cities" ? "city" : "neighborhood";
        var data = getFiltered();
        this.selected = null;
        this.list = data;
        binData(data);
      },
      source: source,
      get all() {
        return source[mode].all
      },
      selectBin: function(item) {
        facade.filter = item.city;
        if (!item.neighborhood) return;
        for (var i = 0; i < facade.binned.length; i++) {
          var row = facade.binned[i];
          for (var j = 0; j < row.length; j++) {
            var col = row[j];
            if (col.indexOf(item) >= 0) {
              facade.selected = col;
              facade.selectedHood = item;
              return;
            }
          }
        }
      },
      sortKey: "city",
      sortDesc: false,
      sortList: function(key) {
        if (key == "location") {
          if (facade.filter == "cities") {
            key = "city";
          } else {
            key = "neighborhood";
          }
        }
        if (key == facade.sortKey) {
          facade.sortDesc = !facade.sortDesc;
        } else {
          facade.sortDesc = false;
        }
        facade.sortKey = key;
        var list = facade.selected || facade.list;
        list.sort(function(a, b) {
          var result = 0;
          if (a[key] < b[key]) result = -1;
          if (a[key] > b[key]) result = 1;
          if (facade.sortDesc && result) {
            result *= -1;
          }
          return result;
        });
      }
    };

    //load data and create promise for subscribers
    var ready = q.defer();
    facade.ready = ready.promise;
    $http.get("data.json").success(function(data) {
        source.sf.all = data.sf;
        source.condo.all = data.condo;

      ["sf", "condo"].forEach(function(key) {
        source[key].cities = data[key].filter(function(item) {
          if (!item.neighborhood) {
            cityMap[item.city] = item;
            return true;
          }
          return false;
        });

        source[key].neighborhoods = data[key].filter(function(item) {
          if (item.neighborhood) {
            if (item.city in cityMap) cityMap[item.city].hoods = true;
            return true;
          }
          return false;
        });

        var filtered = getFiltered();
        facade.list = filtered;
        binData(filtered);
      });
      var cities = {};
      var all = source.sf.neighborhoods
        .map(function(h) { return h.city })
        .forEach(function(h) { cities[h] = true; });
      facade.filterCities = Object.keys(cities);

      ready.resolve();

    });

    return facade;

  }]);

});