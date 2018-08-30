'use strict';

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const pleeease = require('gulp-pleeease');

// ------------------------------------------------------------------------------
// scss
// ------------------------------------------------------------------------------
gulp.task('scss', function() {
  return gulp
    .src([__dirname + '/scss/**/*.scss'])
    .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
    .pipe(
      sass({
        outputStyle: 'expanded'
      }).on('error', sass.logError)
    )
    .pipe(
      pleeease({
        rem: { rootValue: '10px' },
        mqpacker: true,
        minifier: true
      })
    )
    .pipe(
      autoprefixer({
        browsers: [
          'last 2 versions',
          'ie >= 9',
          'ChromeAndroid >= 6',
          'Android >= 6',
          'iOS >= 9'
        ]
      })
    )
    .pipe(gulp.dest(__dirname + '/../src/webroot/css/'));
});

// ------------------------------------------------------------------------------
// watch
// ------------------------------------------------------------------------------
gulp.task('watch', function() {
  watch(__dirname + '/scss/**/*.scss', function() {
    return gulp.start('scss');
  });
});

// default
gulp.task('default', ['watch']);
