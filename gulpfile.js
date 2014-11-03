"use strict";

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var util = require('gulp-util');

var srcPaths = {
  src: 'src/*.js',
  tests: 'tests/*.test.js'
};

gulp.task('test', function() {
  return gulp.src([srcPaths.tests], { read: false })
    .pipe(mocha({ reporter: 'list' }))
    .on('error', util.log);
});

gulp.task('watch-tests', function() {
  gulp.watch([srcPaths.src, srcPaths.tests], ['test']);
});