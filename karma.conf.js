module.exports = function(config) {
    config.set({

        basePath: 'Web',

        frameworks: ['jasmine-jquery', 'jasmine'],

        files: [
            { pattern: 'js/**/*.js' },
            { pattern: 'specs/MainSpec.js' }
        ],

        exclude: [
        ],

        preprocessors: {
            'js/jquery.isValid.js': ['coverage']
        },

        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        },

        reporters: ['progress', 'html'],

        hostname: '127.0.0.1',
        port: 9876,

        colors: true,

        logLevel: config.LOG_DEBUG,

        autoWatch: true,

        browsers: ['Chrome'],

        singleRun: false
    });
};
