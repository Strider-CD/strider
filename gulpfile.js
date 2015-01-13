'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');
var less = require('gulp-less');
var rename = require('gulp-rename');
var del = require('del');
var argv = require('yargs').argv;

gulp.task('clean', function (cb) {
  del(['./dist'], cb);
});

gulp.task('styles', function () {
  return gulp.src('./client/styles/strider.less')
    .pipe(less({ sourceMap: true }))
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('./dist/styles'));
});

gulp.task('browserify', function () {
  var bundler = argv.watch ? watchify(browserify('./client/app.js', watchify.args)) : browserify('./client/app.js');

  function bundle() {
    return bundler.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('app.js'))
      .pipe(gulp.dest('./dist/scripts'));
  }

  if (argv.watch) {
    bundler.on('update', function (ids) {
      console.log(new Date().toString() + ': Files changed: ', ids);
      bundle();
    });
  }

  return bundle();
});

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'browserify'), function () {
  if (!argv.watch) {
    console.log('Finished! Exiting..');
    process.exit();
  }
  else {
    console.log('Watching..');
  }
}));
