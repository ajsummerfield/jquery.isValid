/*
 * grunt bump task
 * https://github.com/blueimp/grunt-bump-build-git
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint regexp: true, unparam: true */
/*global module, require */
module.exports = function (grunt) {
    'use strict';
    grunt.registerTask(
        'bump',
        'Update package version number.',
        function (version) {
            var semver = require('semver'),
                options = grunt.config('build') || {},
                files,
                currentVersion,
                match,
                release,
                labels;
            if (grunt.util.kindOf(options.packageConfig) === 'undefined') {
                options.packageConfig = 'pkg';
            }
            if (grunt.util.kindOf(options.packages) === 'undefined') {
                options.packages = '*.json';
            }
            if (grunt.util.kindOf(options.jsonSpace) === 'undefined') {
                options.jsonSpace = 2;
            }
            files = grunt.file.expand({filter: 'isFile'}, options.packages);
            if (!files.length || !grunt.file.exists(files[0])) {
                return grunt.fail.warn('No package files found.');
            }
            if (options.packageConfig) {
                currentVersion = grunt.config([options.packageConfig, 'version']);
            }
            if (!currentVersion) {
                currentVersion = grunt.file.readJSON(files[0]).version;
            }
            if (!semver.valid(currentVersion)) {
                return grunt.fail.warn(
                    'Current package version is not a valid semver identifier: ' +
                        String(currentVersion).cyan
                );
            }
            if (version) {
                match = /^(major|minor|patch|pre(?:release)?)(.*)$/.exec(version);
                if (match) {
                    release = match[1];
                    labels = match[2];
                    version = semver.inc(
                        currentVersion,
                        release === 'pre' ? 'prerelease' : release
                    ) + (labels || '');
                    if (!semver.valid(version)) {
                        return grunt.fail.warn(
                            'Invalid semver prerelease or build metadata label: ' +
                                labels.cyan
                        );
                    }
                } else {
                    if (!semver.valid(version)) {
                        return grunt.fail.warn(
                            'Invalid semver identifier: ' + version.cyan
                        );
                    }
                }
                if (semver.gt(currentVersion, version)) {
                    return grunt.fail.warn(
                        'Current package version is greater: ' +
                            currentVersion.cyan + ' > ' + version.cyan
                    );
                }
            } else {
                version = currentVersion
                    .split('+')[0] + '+build.' + new Date().getTime();
            }
            if (options.packageConfig) {
                grunt.config([options.packageConfig, 'version'], version);
            }
            files.forEach(function (file) {
                var json = grunt.file.readJSON(file);
                json.version = version;
                grunt.file.write(
                    file,
                    JSON.stringify(json, options.jsonReplacer, options.jsonSpace) + '\n'
                );
                grunt.log.writeln('Updated ' + file.cyan + ' version to ' + version.cyan);
            });
        }
    );
};
