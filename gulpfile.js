var pkg = require('./package.json');

var gulp = require('gulp');

var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minify_css = require('gulp-minify-css');

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
});

gulp.task('scripts', function () {
    return gulp.src(__dirname + '/Web/js/jquery.isValid.js')
        .pipe(concat('jQuery.isValid.js'))
        .pipe(uglify())
        .pipe(rename('jQuery.isValid.min.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('styles', function () {
    return gulp.src(paths.isValidStyles)
        .pipe(concat('jQuery.isValid.css'))
        .pipe(minify_css())
        .pipe(rename('jQuery.isValid.min.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('default', ['watch']);

gulp.task('dist', ['scripts', 'styles']);