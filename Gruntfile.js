module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
        "Gruntfile.js", "public/client/*.js", "test/ServerSpec.js", "app/**/*.js", "lib/*.js", "server-config.js", "server.js"
        ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    concat: {
      options: {
        separator: ";"
      },
      dist:{
        src:["public/client/*.js", "public/lib/*.js"],
        dest: 'public/dist/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'public/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },


    cssmin: {
      build: {
          src: "public/*.css",
          dest: "public/dist/style.min.css"
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },

      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: [
        'cp server.js public/dist/server.js',
        'cp package.json public/dist/package.json',
        'cp server-config.js public/dist/server-config.js',
        'cp -r app public/dist/app',
        'cp -r db public/dist/db',
        'cp -r lib public/dist/lib'
        ].join('&&')
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
      'jshint',
      'concat',
      'uglify',
      'cssmin',
      'shell'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
    //test
    //build
    //upload --prod to deploy to heroku
  ]);


};
