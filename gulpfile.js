var pkg = require('./package.json');

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var karma = require('karma').server;
var debug = require('gulp-debug');
var livereload = require('gulp-livereload');

var paths = {
    scripts: pkg.instance + '/js/**/*.js',
    html: pkg.instance + '/index.html',
    css: pkg.instance + '/css/**/*.css'
};

// Run test once and exit
gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    })
    .on('done', done())
    .on('error',  function (err) {
        throw err;
    });
});

gulp.task('reload', function () {
    console.log("reload");
    livereload.changed("debug.html");
});

// Watch for file changes and re-run tests on each change
gulp.task('tdd', function (done) {
    gulp.watch('specs/MainSpec.js', ["reload"]);
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, function() {
        done();
    });
});

// Default Task
gulp.task('default', ['tdd']);