module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        cssmin: {
            minify: {
                expand: true,
                src: ['css/jquery.isValid.css', '!*.min.css'],
                ext: 'isValid.min.css'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'js/<%= pkg.name %>.js',
                dest: 'js/<%= pkg.name %>.min.js'
            }
        },
        
        jshint: {
            src: ['js/*.js'],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: false,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                  alert: true,
                  require: true,
                  define: true,
                  requirejs: true,
                  describe: true,
                  expect: true,
                  it: true,
                  L: true
                }
            }
        },
        build: {
            tasks: ['default'],
            packageConfig: 'pkg',
            packages: '*.json',
            jsonSpace: 2,
            jsonReplacer: undefined,
            gitAdd: '--all'
        },

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bump-build-git');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'cssmin']);

};