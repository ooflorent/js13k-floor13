module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-preprocess');

  grunt.loadTasks('tasks');

  var processedConstants = Object.create(null);
  var rawConstants = grunt.file.readJSON('src/constants.json');

  for (var c in rawConstants) {
    processedConstants['__PW_' + c] = rawConstants[c];
  }

  var files = {
    engine: [
      '<%= dirs.engine %>/objects.js',
      '<%= dirs.engine %>/utils.js',
      '<%= dirs.engine %>/cooldown.js',
      '<%= dirs.engine %>/input.js',
      '<%= dirs.engine %>/ticker.js',
      '<%= dirs.engine %>/managers/eventmanager.js',
      '<%= dirs.engine %>/managers/entitymanager.js',
      '<%= dirs.engine %>/managers/groupmanager.js',
      '<%= dirs.engine %>/managers/systemmanager.js',
      '<%= dirs.engine %>/managers/tagmanager.js',
      '<%= dirs.engine %>/display/textures.js',
      '<%= dirs.engine %>/display/rendering.js',
      '<%= dirs.engine %>/display/buffer.js',
    ],
    game: [
      '<%= dirs.game %>/astar.js',
      '<%= dirs.game %>/dungeon.js',
      '<%= dirs.game %>/tilemap.js',
      '<%= dirs.game %>/main.js',
      '<%= dirs.game %>/components.js',
      '<%= dirs.game %>/entitycreator.js',
      '<%= dirs.game %>/weaponcreator.js',
      '<%= dirs.game %>/systems/aisystem.js',
      '<%= dirs.game %>/systems/bulletsystem.js',
      '<%= dirs.game %>/systems/camerasystem.js',
      '<%= dirs.game %>/systems/collisionsystem.js',
      '<%= dirs.game %>/systems/damagesystem.js',
      '<%= dirs.game %>/systems/doorsystem.js',
      '<%= dirs.game %>/systems/expirationsystem.js',
      '<%= dirs.game %>/systems/fogsystem.js',
      '<%= dirs.game %>/systems/hudsystem.js',
      '<%= dirs.game %>/systems/keyboardcontrolsystem.js',
      '<%= dirs.game %>/systems/movementsystem.js',
      '<%= dirs.game %>/systems/pathfollowsystem.js',
      '<%= dirs.game %>/systems/renderingsystem.js',
      '<%= dirs.game %>/systems/spritedirectionsystem.js',
    ],
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dirs: {
      build: 'dist',
      engine: 'src/engine',
      game: 'src/game',
    },
    env: {
      dev: {
        NODE_ENV: 'dev',
      },
      dist: {
        NODE_ENV: 'dist',
      },
    },
    clean: {
      build: ['dist/'],
    },
    jshint: {
      options: {
        '-W030': true,
        '-W082': true,
        '-W084': true,
        '-W086': true,
        '-W088': true,
        '-W018': true,
        '-W120': true,
      },
      files: ['Gruntfile.js', 'src/**/*.js'],
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['dev'],
    },
    compress: {
      dist: {
        options: {
          archive: 'dist/pixelwars.zip',
          mode: 'zip',
          level: 9,
        },
        files: [
          {expand: true, cwd: 'dist/', src: ['p.js', 's.css', 'index.html']},
          {expand: true, flatten: true, src: ['assets/*.png']},
        ],
      },
    },
    concat: {
      dist: {
        options: {
          // Globals must be adjusted before packaging the final version.
          // Dropping some of them produce a bigger JavaScript file but
          // smaller ZIP archive. RLY? WTF!
          banner: "!function(window, document, Object, Math) {\n",
          footer: "\nmain();\n} (window, document, Object, Math)\n",
        },
        files: {
          'dist/pixelwars.js': [files.engine, files.game],
        },
      },
    },
    constants: {
      dev: {
        options: {
          namespace: '__PW_',
        },
        files: {
          'dist/constants.js': ['src/constants.json', 'src/constants.dev.json'],
        },
      },
    },
    uglify: {
      dist: {
        options: {
          report: 'min',
          compress: {
            global_defs: processedConstants,
          },
        },
        files: {
          'dist/p.js': ['dist/pixelwars.js'],
        },
      },
    },
    preprocess: {
      dist: {
        src: 'src/index.html',
        dest: 'dist/index.html',
      },
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeOptionalTags: true,
        },
        files: {
          'dist/index.html': 'dist/index.html',
        },
      },
    },
    cssmin: {
      dist: {
        options: {
          report: 'min',
        },
        files: {
          'dist/s.css': ['assets/*.css'],
        },
      },
    },
  });

  grunt.registerTask('dev', ['env:dev', 'jshint', 'constants']);
  grunt.registerTask('package', ['env:dist', 'concat', 'uglify', 'preprocess:dist', 'htmlmin', 'cssmin', 'compress']);

  grunt.registerTask('default', ['clean', 'dev', 'package']);

};
