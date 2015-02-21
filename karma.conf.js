module.exports = function(config) {
    config.set({

        basePath: 'Athena.Web',

        frameworks: ['jasmine-jquery', 'jasmine-ajax', 'jasmine', 'requirejs'],

        files: [
            'test-main.js',
            { pattern: 'app/**/*.js', included: false },
            { pattern: 'app/**/*.html', included: false },
            { pattern: 'content/lib/**/*.js', included: false },
            { pattern: 'specs/**/*.js', included: false }
        ],

        exclude: [
        ],

        preprocessors: {
            'app/**/*.js': ['coverage']
        },

        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        },

        reporters: ['progress', 'html'],
        // reporters: ['progress', 'html', 'coverage'],

        hostname: '127.0.0.1',
        port: 9876,

        colors: true,

        logLevel: config.LOG_DEBUG,

        autoWatch: true,

        browsers: ['Chrome'],

        singleRun: false
    });
};
