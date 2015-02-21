var pkg = require('./package.json');

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var debug = require('gulp-debug');
var durandal = require('gulp-durandal');
var minifyHTML = require('gulp-minify-html');
var karma = require('karma').server;
var imagemin = require('gulp-imagemin');
var livereload = require('gulp-livereload');

var paths = {
    root: pkg.instance,
    app: pkg.instance + '/app',
    scripts: pkg.instance + '/app/**/*.js',
    html: pkg.instance + '/app/**/*.html',
    libs: pkg.instance + '/content/lib/**/*.js',
    sass: pkg.instance + '/content/sass/**/*.scss',
    fonts: [pkg.instance + '/content/lib/bootstrap/fonts/*.*',
        pkg.instance + '/content/lib/font-awesome/fonts/*.*',
        pkg.instance + '/content/fonts/*.*'],
    css: [pkg.instance + '/content/lib/bootstrap/css/bootstrap.min.css',
        pkg.instance + '/content/lib/font-awesome/css/font-awesome.min.css',        
        pkg.instance + '/content/lib/durandal/css/durandal.css',
        pkg.instance + '/content/lib/jplayer/css/player.css',
        pkg.instance + '/content/lib/leaflet-0.7.3/leaflet.css',
        pkg.instance + '/content/lib/css/site.css'],
    images: [pkg.instance + '/content/lib/jplayer/img/*',
        pkg.instance + '/content/lib/leaflet-0.7.3/images/*',
        pkg.instance + '/content/img/*'],
    favicon: pkg.instance + '/favicon.ico'
};

gulp.task('build', function (callback) {
    runSequence('clean', 'lint',
        ['sass', 'deps-css', 'fonts', 'minify-html', 'scripts', 'libs', 'images'],
//        'test', // - this break azure - need to fix at some point.
        callback);
});

gulp.task('build-almond', function (callback) {
    runSequence('clean',
        ['lint', 'sass', 'deps-css', 'fonts', 'favicon', 'images'],
        'durandal',
//        'test',
        callback);
});

//Clean build folders
gulp.task('clean', function () {
    return gulp.src(['build/app', 'build/content/sass', 'build/content/lib', 'build/specs', 'build/test-main.js'], { read: false })
      .pipe(clean());
});

// Lint Task
gulp.task('lint', function () {
    return gulp.src(paths.scripts)
        .pipe(jshint({ sub: true })) // ignore dot notation errors
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function () {
    return gulp.src(paths.sass)
        //.pipe(debug({ verbose: true }))
        .pipe(sass())
        .pipe(gulp.dest('build/content/css'))
        .pipe(minifyCSS({ keepBreaks: true }))
        .pipe(rename({
            suffix: '.min.' + pkg.version
        }))
        .pipe(gulp.dest('build/content/css'));
});

// Compile Our dependency CSS
gulp.task('deps-css', function () {
    return gulp.src(paths.css)
        .pipe(concat('deps.css'))
        .pipe(gulp.dest('build/content/css'))
        .pipe(minifyCSS({ keepBreaks: true }))
        .pipe(rename('deps.min.' + pkg.version + '.css'))
        .pipe(gulp.dest('build/content/css'));
});

// Copy FaviIcon
gulp.task('favicon', function () {
    return gulp.src(paths.favicon)
        .pipe(gulp.dest('build/'));
});

gulp.task('images', function () {
    return gulp.src(paths.images)
      // Pass in options to the task
      .pipe(imagemin({ optimizationLevel: 5 }))
      .pipe(gulp.dest('build/content/img'));
});

// Copy our fonts
gulp.task('fonts', function () {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('build/content/fonts'));
});

gulp.task('durandal', function () {
    return durandal({
        baseDir: paths.app,
        output: 'site.min.' + pkg.version + '.js',
        almond: true,
        minify: true
    })
        .pipe(gulp.dest('build/content/lib'));
});

// Minfiy HTML
gulp.task('minify-html', function () {
    var opts = { comments: true, spare: true };
    gulp.src(paths.html)
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('build/app'));
});

// Concatenate & Minify JS
gulp.task('scripts', function () {
    return gulp.src([paths.scripts])
        .pipe(uglify())
        .pipe(gulp.dest('build/app'));
});

// Concatenate & Minify Libs
gulp.task('libs', function () {
    return gulp.src([paths.libs])
        .pipe(uglify())
        .pipe(gulp.dest('build/content/lib'));
});

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
    livereload.changed("debug.html");
});

// Watch for file changes and re-run tests on each change
gulp.task('tdd', function (done) {
    livereload.listen();
    gulp.watch(pkg.instance + '/specs/**/*.js', ["reload"]);
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, function() {
        done();
    });
});

// Watch Files For Changes
//gulp.task('watch', function () {
//    gulp.watch(paths.scripts, ['lint', 'scripts']);
//    gulp.watch('scss/*.scss', ['sass']);
//});


// Default Task
gulp.task('default', ['build-almond']);