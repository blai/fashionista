'use strict';
var path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'lib/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    jsbeautifier: {
      files: ['package.json', 'Gruntfile.js', 'tasks/**/*.js'],
      options: {
        'indent_size': 2,
        'indent_char': ' ',
        'indent_level': 0,
        'indent_with_tabs': false,
        'preserve_newlines': true,
        'max_preserve_newlines': 10,
        'jslint_happy': false,
        'brace_style': 'collapse',
        'keep_array_indentation': false,
        'keep_function_indentation': false,
        'space_before_conditional': true,
        'eval_code': false,
        'indent_case': false,
        'unescape_strings': false
      }
    },

    // Unit tests.
    mochacli: {
      options: {
        require: ['should'],
        reporter: 'nyan', // 'landing', 'spec'
        color: true,
        bail: true
      },
      all: ['test/*.js']
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-jsbeautifier');

  grunt.registerTask('default', ['jsbeautifier', 'jshint', 'mochacli']);
};
