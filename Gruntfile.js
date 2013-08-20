module.exports = function(grunt) {

  var processedConstants = Object.create(null);
  var rawConstants = grunt.file.readJSON('src/constants.json');

  for (var c in rawConstants) {
    processedConstants['__PW_' + c] = rawConstants[c];
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: ['dist/']
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js']
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['dev']
    },
    compress: {
      dist: {
        options: {
          archive: 'dist/pixelwars.zip',
          mode: 'zip',
          level: 9
        },
        files: [
          {expand: true, cwd: 'dist/', src: ['*.min.js']},
          {expand: true, cwd: 'dist/', src: ['index.html']}
        ]
      }
    },
    concat: {
      dist: {
        options: {
          process: function(src) {
            return src.replace(/('use strict'|"use strict");/g, '');
          }
        },
        files: {
          'dist/engine.js': ['src/engine.js', 'src/engine/*.js'],
          'dist/game.js': ['src/game.js', 'src/game/*.js']
        }
      },
      dev: {
        options: {
          process: function(src) {
            return 'var __PW_CONSTANTS = ' + src;
          }
        },
        files: {
          'dist/constants.js': ['src/constants.json']
        }
      }
    },
    uglify: {
      dist: {
        options: {
          hoist_funs: false,
          report: 'min',
          compress: {
            global_defs: processedConstants
          }
        },
        files: {
          'dist/engine.min.js': ['dist/engine.js'],
          'dist/game.min.js': ['dist/game.js']
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          removeComments: true
        },
        files: {
          'dist/index.html': 'src/index.html'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('dev', ['jshint', 'concat:dev']);
  grunt.registerTask('package', ['jshint', 'clean', 'concat', 'uglify', 'htmlmin', 'compress']);

  grunt.registerTask('default', ['package']);

};
