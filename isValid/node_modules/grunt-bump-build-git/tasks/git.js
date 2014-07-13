/*
 * grunt git task
 * https://github.com/blueimp/grunt-bump-build-git
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*global module, require */
module.exports = function (grunt) {
    'use strict';

    function GitTask(task) {
        if (!task.args.length) {
            return grunt.fail.warn('Missing git command argument.');
        }
        var method = this[task.args[0]];
        if (typeof method !== 'function') {
            return grunt.fail.warn('Invalid git command argument.');
        }
        this.options = grunt.config('build') || {};
        if (grunt.util.kindOf(this.options.packageConfig) === 'undefined') {
            this.options.packageConfig = 'pkg';
        }
        this.task = task;
        method.call(this);
    }

    grunt.registerTask(
        'git',
        'Git add, commit and tag.',
        function () {
            return new GitTask(this);
        }
    );

    function extend(dst) {
        grunt.util.toArray(arguments).forEach(function (obj) {
            var key;
            if (obj && obj !== dst) {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        dst[key] = obj[key];
                    }
                }
            }
        });
        return dst;
    }

    extend(GitTask.prototype, {
        extend: extend,

        escape: function (str) {
            // Escape a string for usage as shell argument:
            return require('util').inspect(str).replace(/\\\'/g, '\'"\'"\'');
        },

        exec: function (cmd) {
            var failLogger = 'fail',
                noWrite,
                result;
            if (grunt.option('no-write')) {
                failLogger = 'log';
                switch (cmd.split(' ')[1]) {
                case 'add':
                case 'commit':
                    cmd += ' --dry-run';
                    break;
                default:
                    noWrite = true;
                }
            }
            grunt.log.writeln('Executing command: ' + cmd.cyan +
                ((noWrite && ' (dry-run)') || ''));
            if (noWrite) {
                return;
            }
            result = require('shelljs').exec(cmd, {silent: true});
            if (result.code !== 0) {
                return grunt[failLogger].warn('Error (' + result.code + ')\n\n' +
                    result.output + '\n');
            }
            grunt.log.write(result.output);
        },

        add: function () {
            var params = this.task.args[1] || '--all';
            this.exec('git add ' + params);
        },

        commit: function () {
            var message = this.task.args[1];
            if (!message) {
                return grunt.fail.warn('Missing Git commit message.');
            }
            this.exec('git commit -m ' + this.escape(message));
        },

        tag: function () {
            var version = grunt.config([this.options.packageConfig, 'version']),
                message = this.task.args[1];
            if (!version) {
                return grunt.fail.warn('Missing package version.');
            }
            this.exec(
                'git tag -a ' + this.escape(version) +
                    (message ? ' -m ' + this.escape(message) : '')
            );
        }

    });
};
