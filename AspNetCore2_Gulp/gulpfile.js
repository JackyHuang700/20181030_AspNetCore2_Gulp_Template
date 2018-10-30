'use strict'

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin')
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var proxy = require('http-proxy-middleware');
var middleware = proxy('**', { target: 'http://localhost:53032', changeOrigin: true });

gulp.pkg = require('./package.json');

gulp.task('clean', function () {
  return gulp.src('wwwroot/vendors/*', {read: false}).pipe(clean())
});


gulp.task('copyVendors', function() {

  var copyVendorsList = {
    // dest : source
    'wwwroot/vendors/test' : [
      'ClientApp/css/test.css', 
      'ClientApp/js/test.js'],
  }
  for (var i in copyVendorsList) {
      gulp.src(copyVendorsList[i]).pipe(gulp.dest(`${i}`));
  }
});


gulp.task('scss', function(){
  return gulp.src('./ClientApp/scss/test2.scss')
  .pipe(sass())
  .pipe(autoprefixer())
  // .pipe(gulp.dest('wwwroot/vendors/scss'))
  .pipe(cssmin())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('wwwroot/vendors/test'))
  .pipe(browserSync.stream());
});

gulp.task('serve', ['clean', 'copyVendors', 'scss'], function() {

  browserSync.init({
      port: 3001,
      open: false,
      server: {
          baseDir: ['./', '.wwwroot']
      },
      //https:true,
      middleware: [middleware]
  });

});

gulp.task('default', ['serve']);