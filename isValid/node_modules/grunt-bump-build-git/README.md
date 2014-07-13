# grunt bump build git

> Bump the version, build the project and add, commit and tag in git in one step.

## Table of contents

- [Getting Started](#getting-started)
- [The build task](#the-build-task)
	- [Overview](#overview)
	- [Usage Examples](#usage-examples)
		- [Setup](#setup)
		- [Build test](#build-test)
		- [Releases](#releases)
		- [Git integration](#git-integration)
	- [Options](#options)
		- [build.tasks](#buildtasks)
		- [build.packageConfig](#buildpackageconfig)
		- [build.packages](#buildpackages)
		- [build.jsonSpace](#buildjsonspace)
		- [build.jsonReplacer](#buildjsonreplacer)
- [Contributing](#contributing)
- [Release History](#release-history)

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bump-build-git --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bump-build-git');
```

## The build task

### Overview
This task allows you to bump your project version, update all available package files (`package.json`, `bower.json`, etc.), build the project with your custom tasks and the updated package confg version and add, commit and tag the new release in git - all in one step.

### Usage Examples

#### Setup
This task doesn't require any configuration setup, but allows to set custom options the following way:

In your project's Gruntfile, add a section named `build` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  build: {
    tasks: ['default'],
    packageConfig: 'pkg',
    packages: '*.json',
    jsonSpace: 2,
    jsonReplacer: undefined,
    gitAdd: '--all'
  },
})
```

#### Build test
Build the project and create a new meta version (e.g. 1.2.3+build.1382987826059):

```sh
grunt build
```

#### Releases
Build the project and bump the major version (major.minor.patch):

```sh
grunt build:major
```

Build the project and bump the minor version (major.minor.patch):

```sh
grunt build:minor
```

Build the project and bump the patch version (major.minor.patch):

```sh
grunt build:patch
```

Build the project and bump the version to a major/minor/patch prerelease:

```sh
grunt build:major-rc.1
```

Build the project and bump the prerelease version (major.minor.patch-prerelease):

```sh
grunt build:pre
```

Build the project with a specific [semver](http://semver.org/) identifier as version:

```sh
grunt build:1.2.3-rc.4+test.5
```

#### Git integration
Build the project and run `git add`, `git commit` and `git tag` automatically:

```sh
grunt build:patch:"Fixed #42"
```

This adds all unstaged files and commits the changes with the given message to the Git repository.  
The message is also used to create an annotated tag with the updated package version as tag name.  

To build and commit a test version without creating a tag, run the following command:

```sh
grunt build::"Test build"
```

**Colons in commit messages:**

If you want to use colons in commit messages, escape them with a backslash:

```sh
grunt build:minor:"Set visibility\:true by default."
```

### Options

#### build.tasks
Type: `Array`  
Default value: `['default']`

The list of custom tasks to run after bumping the package version and before running the git tasks.

#### build.packageConfig
Type: `String`  
Default value: `'pkg'`

The name of the config object with the package version.

#### build.packages
Type: `String`  
Default value: `'*.json'`

The location of the JSON package files, passed as parameter to [grunt.file.expand](http://gruntjs.com/api/grunt.file#grunt.file.expand).

#### build.jsonSpace
Type: `Integer`  
Default value: `2`

The `space` parameter to [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) used to render the JSON package files.

#### build.jsonReplacer
Type: `function|Array`  
Default value: `undefined`

The `replacer` parameter to [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) used to render the JSON package files.

#### build.gitAdd
Type: `String|Boolean`  
Default value: `'--all'`

The shell parameters passed to [git add](https://www.kernel.org/pub/software/scm/git/docs/git-add.html).  
Set to `false` to disable calling `git add` on build runs.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

 * 2013-12-27   v1.1.1   Escape colons in git commit messages.
 * 2013-11-28   v1.1.0   Added `gitAdd` build option.
 * 2013-10-29   v1.0.0   Initial release.
