var pkg = require('./package.json');

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var karma = require('karma').server;
var debug = require('gulp-debug');
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');

var paths = {
    scripts: __dirname + '/Web/js/**/*.js',
    html: __dirname + '/Web/index.html',
    css: __dirname + '/Web/css/**/*.css'
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

gulp.task('lint', function() {
  gulp.src(__dirname + '/Web/js/isValid.js')
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

gulp.task('watch', function() {
    gulp.watch(__dirname + '/Web/js/isValid.js', ['lint']);
});

// Default Task
gulp.task('default', ['watch']);