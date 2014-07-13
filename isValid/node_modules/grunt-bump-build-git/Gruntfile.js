/*
 * grunt-bump-build-git Gruntfile
 * https://github.com/blueimp/grunt-bump-build-git
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*global module */

module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Copy files for the test setup:
        copy: {
            fixtures: {
                expand: true,
                cwd: 'test/fixtures/',
                src: ['*.json'],
                dest: 'tmp/'
            },
            prerelease: {
                expand: true,
                cwd: 'tmp/',
                src: ['*.json', 'version.txt'],
                dest: 'tmp/prerelease/'
            },
            patch: {
                expand: true,
                cwd: 'tmp/',
                src: ['*.json', 'version.txt'],
                dest: 'tmp/patch/'
            },
            minor: {
                expand: true,
                cwd: 'tmp/',
                src: ['*.json', 'version.txt'],
                dest: 'tmp/minor/'
            },
            major: {
                expand: true,
                cwd: 'tmp/',
                src: ['*.json', 'version.txt'],
                dest: 'tmp/major/'
            },
            version: {
                expand: true,
                cwd: 'tmp/',
                src: ['*.json', 'version.txt'],
                dest: 'tmp/version/'
            }
        },

        // The test package configuration as config property:
        pkg: grunt.file.readJSON('test/fixtures/package.json'),

        // Configuration to be run (and then tested).
        build: {
            tasks: ['writeVersion'],
            packages: 'tmp/*.json'
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Register a custom task to test the package config version update
    // and build tasks setting:
    grunt.registerTask('writeVersion', function () {
        grunt.file.write('tmp/version.txt', grunt.config('pkg.version'));
    });

    // Register a custom task to set the build.gitAdd config option:
    grunt.registerTask('gitAddConfigCustom', function () {
        grunt.config('build.gitAdd', 'tmp/\\*');
    });

    // Register a custom task to disable the build.gitAdd task:
    grunt.registerTask('gitAddConfigFalse', function () {
        grunt.config('build.gitAdd', false);
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // Override the git task for testing purposes:
    grunt.registerTask('git', function () {
        var git = {};
        if (grunt.file.exists('tmp/git/calls.json')) {
            git = grunt.file.readJSON('tmp/git/calls.json');
        }
        git[this.nameArgs] = (git[this.nameArgs] || 0) + 1;
        grunt.file.write('tmp/git/calls.json', JSON.stringify(git));
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run,
    // first clean the "tmp" dir,
    // then run the copy and plugin's tasks,
    // then test the result.
    grunt.registerTask('test', [
        'clean',
        'copy:fixtures',
        'build:prerelease',
        'copy:prerelease',
        'build:patch',
        'copy:patch',
        'build:minor+test.4',
        'copy:minor',
        'build:major-rc.1',
        'copy:major',
        'build:3.4.5-rc.6+test.7',
        'copy:version',
        'build:major:test',
        'gitAddConfigCustom',
        'build::notag',
        'gitAddConfigFalse',
        'build::notag',
        'nodeunit'
    ]);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
