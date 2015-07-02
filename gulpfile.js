var pkg = require('./package.json');

var gulp = require('gulp');

var karma = require('karma').server;
var debug = require('gulp-debug');
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minify_css = require('gulp-minify-css');

var jasmine = require('gulp-jasmine');
var notify = require('gulp-notify');

var paths = {
    scripts: __dirname + '/Web/js/**/*.js',
    isValidScipts: [__dirname + '/Web/js/jquery.isValid.js', __dirname + '/Web/js/checkPostCode.js'],
    html: __dirname + '/Web/index.html',
    css: __dirname + '/Web/css/**/*.css',
    isValidStyles: __dirname + '/Web/css/jquery.isValid.css'
};

gulp.task('reload', function () {
    console.log("reload");
    livereload.changed("debug.html");
});

gulp.task('hint', function() {
  gulp.src(__dirname + '/Web/js/jquery.isValid.js')
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

gulp.task('watch', function() {
    gulp.watch(__dirname + '/Web/js/jquery.isValid.js', ['hint']);
    return karma.server.start({
      configFile: __dirname + '/karma.conf.js'
    });
});

gulp.task('scripts', function () {
    return gulp.src(paths.isValidScipts)
        .pipe(concat('jQuery.isValid.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename('jQuery.isValid.min.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('styles', function () {
    return gulp.src(paths.isValidStyles)
        .pipe(concat('jQuery.isValid.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(minify_css())
        .pipe(rename('jQuery.isValid.min.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('tests', function () {
  gulp.src(__dirname + '/tests/*.js')
    .pipe(jasmine())
    .on('error', notify.onError({
      title: 'Jasmine Test Failed'
    }));
});

gulp.task('test', function (done) {
  return karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done);
});

gulp.task('default', ['watch']);

gulp.task('dist', ['scripts', 'styles']);
