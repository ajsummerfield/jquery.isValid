module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['jasmine-jquery', 'jasmine'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    files: [
      'tests/*.js', 'Web/js/libs/jquery-1.10.1.js', 'Web/js/jquery.isValid.js', 'Web/js/moment.js', 'Web/js/checkPostCode.js',
      {
        pattern:  'tests/*.html',
        watched:  true,
        served:   true,
        included: false
      }
    ]
  });
};
