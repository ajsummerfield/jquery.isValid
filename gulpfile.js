var pkg = require('./package.json');

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var karma = require('karma').server;
var debug = require('gulp-debug');
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

// Reload the debug page
gulp.task('reload', function () {
    console.log("reload");
    livereload.changed("debug.html");
});

// Watch for file changes and re-run tests on each change
gulp.task('tests', function (done) {
    livereload.listen();
    gulp.watch([__dirname + '/Web/specs/MainSpec.js', __dirname + '/Web/js/isValid.js'], ["reload"]);
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, function() {
        done();
    });
});

gulp.task('hint', function() {
  gulp.src(__dirname + '/Web/js/isValid.js')
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

gulp.task('watch', function() {
    gulp.watch(__dirname + '/Web/js/isValid.js', ['hint']);
});

// Concatenate & Minify JS
gulp.task('scripts', function () {
    return gulp.src(paths.isValidScipts)
        .pipe(concat('jQuery.isValid.js'))
        .pipe(uglify())
        .pipe(rename('jQuery.isValid.min.js'))
        .pipe(gulp.dest('dist/js'));
});

// Concatenate & Minify CSS
gulp.task('styles', function () {
    return gulp.src(paths.isValidStyles)
        .pipe(concat('jQuery.isValid.css'))
        .pipe(minify_css())
        .pipe(rename('jQuery.isValid.min.css'))
        .pipe(gulp.dest('dist/css'));
});

// Default Task
gulp.task('default', ['watch']);

gulp.task('dist', ['scripts', 'styles']);