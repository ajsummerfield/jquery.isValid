/*
 * grunt-bump-build-git Tests
 * https://github.com/blueimp/grunt-bump-build-git
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*global exports, require */

(function () {
    'use strict';

    var grunt = require('grunt');

    exports.build = {

        prerelease: function (test) {
            test.expect(3);
            var actual = grunt.file.read('tmp/prerelease/package.json'),
                expected = grunt.file.read('test/expected/prerelease/package.json');
            test.equal(
                actual,
                expected,
                'Should bump the prerelease version in package.json.'
            );
            actual = grunt.file.read('tmp/prerelease/bower.json');
            expected = grunt.file.read('test/expected/prerelease/bower.json');
            test.equal(
                actual,
                expected,
                'Should bump the prerelease version in bower.json.'
            );
            actual = grunt.file.read('tmp/prerelease/version.txt');
            test.equal(
                actual,
                grunt.file.readJSON('tmp/prerelease/package.json').version,
                'Should update the package config version.'
            );
            test.done();
        },

        patch: function (test) {
            test.expect(3);
            var actual = grunt.file.read('tmp/patch/package.json'),
                expected = grunt.file.read('test/expected/patch/package.json');
            test.equal(
                actual,
                expected,
                'Should bump the patch version in package.json.'
            );
            actual = grunt.file.read('tmp/patch/bower.json');
            expected = grunt.file.read('test/expected/patch/bower.json');
            test.equal(
                actual,
                expected,
                'Should bump the patch version in bower.json.'
            );
            actual = grunt.file.read('tmp/patch/version.txt');
            test.equal(
                actual,
                grunt.file.readJSON('tmp/patch/package.json').version,
                'Should update the package config version.'
            );
            test.done();
        },

        minor: function (test) {
            test.expect(3);
            var actual = grunt.file.read('tmp/minor/package.json'),
                expected = grunt.file.read('test/expected/minor/package.json');
            test.equal(
                actual,
                expected,
                'Should bump the minor version in package.json.'
            );
            actual = grunt.file.read('tmp/minor/bower.json');
            expected = grunt.file.read('test/expected/minor/bower.json');
            test.equal(
                actual,
                expected,
                'Should bump the minor version in bower.json.'
            );
            actual = grunt.file.read('tmp/minor/version.txt');
            test.equal(
                actual,
                grunt.file.readJSON('tmp/minor/package.json').version,
                'Should update the package config version.'
            );
            test.done();
        },

        major: function (test) {
            test.expect(3);
            var actual = grunt.file.read('tmp/major/package.json'),
                expected = grunt.file.read('test/expected/major/package.json');
            test.equal(
                actual,
                expected,
                'Should bump the major version in package.json.'
            );
            actual = grunt.file.read('tmp/major/bower.json');
            expected = grunt.file.read('test/expected/major/bower.json');
            test.equal(
                actual,
                expected,
                'Should bump the major version in bower.json.'
            );
            actual = grunt.file.read('tmp/major/version.txt');
            test.equal(
                actual,
                grunt.file.readJSON('tmp/major/package.json').version,
                'Should update the package config version.'
            );
            test.done();
        },

        version: function (test) {
            test.expect(3);
            var actual = grunt.file.read('tmp/version/package.json'),
                expected = grunt.file.read('test/expected/version/package.json');
            test.equal(
                actual,
                expected,
                'Should set the version in package.json.'
            );
            actual = grunt.file.read('tmp/version/bower.json');
            expected = grunt.file.read('test/expected/version/bower.json');
            test.equal(
                actual,
                expected,
                'Should set the version in bower.json.'
            );
            actual = grunt.file.read('tmp/version/version.txt');
            test.equal(
                actual,
                grunt.file.readJSON('tmp/version/package.json').version,
                'Should update the package config version.'
            );
            test.done();
        },

        meta: function (test) {
            var actual = grunt.file.readJSON('tmp/package.json');
            test.ok(
                /\+build\.\d+$/.test(actual.version),
                'Should update the meta build version in package.json.'
            );
            actual = grunt.file.readJSON('tmp/bower.json');
            test.ok(
                /\+build\.\d+$/.test(actual.version),
                'Should update the meta build version in bower.json.'
            );
            test.done();
        },

        git: function (test) {
            var actual = grunt.file.readJSON('tmp/git/calls.json');
            test.ok(actual);
            test.equal(actual['git:add'], 1, 'Should run git:add once.');
            test.equal(actual['git:commit:test'], 1, 'Should run git:commit:test once.');
            test.equal(actual['git:tag:test'], 1, 'Should run git:tag:test once.');
            test.equal(actual['git:add:tmp/\\*'], 1, 'Should run git:add:tmp/\\* once.');
            test.equal(actual['git:commit:notag'], 2, 'Should run git:commit:notag twice.');
            test.ok(!actual['git:add:undefined'], 'Should not run git:add:undefined.');
            test.ok(!actual['git:tag:notag'], 'Should not run git:tag:notag.');
            test.done();
        }

    };

}());
