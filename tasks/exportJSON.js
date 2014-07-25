module.exports = function(grunt) {

  var mustSell = 10;

  grunt.registerTask("csv-json", function() {
    grunt.task.requires("state", "csv");
    grunt.file.write("build/data.json", JSON.stringify({
      sf: grunt.data.csv.biddingSF.filter(function(d) { return d.sold >= mustSell && d.price }),
      condo: grunt.data.csv.biddingC.filter(function(d) { return d.sold >= mustSell && d.price })
    }));
  });

};