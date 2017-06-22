'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var connect = require('gulp-connect');

var listOfCssFiles = 'src/css/*.css';

var listOfJsFiles = 'src/js/*.js';

var concatenatedCssFile = 'angular-map-it.css';
var minifiedCssFile = 'angular-map-it.min.css';
var concatenatedJsFile = 'angular-map-it.js';
var minifiedJsFile = 'angular-map-it.min.js';
var buildDirectory = 'dist';

// Lint Task - make sure no error in JS files
gulp.task('verifyJs', function() {
    var jshint = require('gulp-jshint');
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// Concatenate CSS files
gulp.task('concatCssFiles', function() {
    return gulp.src(listOfCssFiles)
        .pipe(concat(concatenatedCssFile))
        .pipe(gulp.dest(buildDirectory));
});

// minify CSS files
gulp.task('minifyCssFiles', function() {
    var minifyCss = require('gulp-minify-css');
    return gulp.src(listOfCssFiles)
        .pipe(concat(minifiedCssFile))
        .pipe(minifyCss())
        .pipe(gulp.dest(buildDirectory));
});

// Concatenate JS files
gulp.task('concatJsFiles', function() {
    return gulp.src(listOfJsFiles)
        .pipe(concat(concatenatedJsFile))
        .pipe(gulp.dest(buildDirectory));
});

// minify JS files
gulp.task('minifyJsFiles', function() {
    var uglify = require('gulp-uglify');
    return gulp.src(listOfJsFiles)
        .pipe(concat(minifiedJsFile))
        .pipe(uglify())
        .pipe(gulp.dest(buildDirectory));
});


//clean build directory
gulp.task('cleanBuildDirectory', function() {
  var del = require('del');
  return del([buildDirectory+'/*'], function (err, deletedFiles) {
    console.log('Files deleted:', deletedFiles.join(', '));
    });
});

//task to prepare production package
gulp.task('prepareBuildPackage', function () {
    runSequence('verifyJs', 'cleanBuildDirectory',
      'concatCssFiles', 'minifyCssFiles',
      'concatJsFiles','minifyJsFiles'
    );
});

//http server setup
gulp.task('connect', function() {
  connect.server({
    livereload: true,
    root: ['example'],
    port: 7070
  });
});

// copy CSS files to example folder
gulp.task('copyCssFilesToExample', function() {
    // var minifyCss = require('gulp-minify-css');
    return gulp.src(listOfCssFiles)
        .pipe(concat(concatenatedCssFile))
        // .pipe(minifyCss())
        .pipe(gulp.dest('example/css'));
});

// copy JS files to example folder
gulp.task('copyJsFilesToExample', function() {
    // var uglify = require('gulp-uglify');
    return gulp.src(listOfJsFiles)
        .pipe(concat(concatenatedJsFile))
        // .pipe(uglify())
        .pipe(gulp.dest('example/js'));
});


// Watch src Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['verifyJs', 'copyJsFilesToExample']);
    gulp.watch('src/css/*.css', ['copyCssFilesToExample']);
});

//default gulp command starts http server
gulp.task('default', function () {
    runSequence('verifyJs', 'copyJsFilesToExample', 'copyCssFilesToExample', 'connect', 'watch');
});
