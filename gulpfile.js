//var gulp = require('gulp');
var gulp = require('gulp-run-seq');
var uglify = require('gulp-uglifyjs');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var insert = require('gulp-insert');
var dateFormat = require('dateformat');
var watch = require('gulp-watch');
var concatCss = require('gulp-concat-css');
var urlAdjuster = require('gulp-css-url-adjuster');

var now = new Date();
var outputDate = dateFormat(now, "yyyy/m/d");
var insertString = '/* Date:'+outputDate+' | Cartjs | (c) 2014 Digishot | Jay Hsu | license:ISC */\n';

//default task
gulp.task('default', ['uglify','sass']);

//compress js file
gulp.task('uglify', function(end) {
  setTimeout(function() {end(); }, 1200); //make sure the process end

  gulp.src([
        'cartjs/plugin/jqueryui/jquery-ui.min.js',
        'cartjs/plugin/jqueryui/jquery-ui.touch.min.js',
        'cartjs/cart.js'
        ])
      .pipe(uglify('cartjs.min.js', {
        //outSourceMap: false,
        //wrap: false
      }))
      .pipe(insert.prepend(insertString))
      .pipe(gulp.dest('dist/'));
});

//build sass/minify
gulp.task('sass', function(end) {
  setTimeout(function() {end(); }, 1200); //make sure the process end

  gulp.src([
        'cartjs/plugin/font-awesome-4.6.3/css/font-awesome.min.css',
        'cartjs/css/cart.css'
      ])
      .pipe(concatCss("cartjs.min.css"))
      .pipe(urlAdjuster({
        replace:  ['../fonts/','fonts/']
      }))
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(insert.prepend(insertString))
      .pipe(gulp.dest('dist/'));
});