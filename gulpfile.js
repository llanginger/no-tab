var gulp          = require("gulp");
var sass          = require("gulp-sass");
var autoprefixer  = require("gulp-autoprefixer");

gulp.task("styles", function() {
  gulp.src("./app/sass.**/*.sass")
      .pipe(sass())
      .pipe(gulp.dest("./app/css"))
})
