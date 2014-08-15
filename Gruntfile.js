module.exports = function(grunt) {

	'use strict';

	var config = {};

	config.jshint = {
		all: ['Gruntfile.js', './app/**/*']
	};

	config.uglify = {
		all: {
			files: {
				'build/sitemarks.built.js': ['src/sitemarks.storage.js', 'src/sitemarks.oink.js', 'src/sitemarks.app.js'],
				'build/sitemarks.loader.min.js': ['src/sitemarks.loader.js']
			}
		}
	};

	config.watch = {
		files: ['./app/**/*'],
		tasks: ['jshint']
	};

	grunt.initConfig(config);

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('default', ['jshint', 'uglify']);
};