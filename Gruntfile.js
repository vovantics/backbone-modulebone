var path = require("path");

module.exports = function( grunt ) {
  'use strict';

  //
  // Grunt configuration:
  //
  // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
  //
  // concat/min/css/rjs tasks are reserved for yeoman's `usemin-handler` task.
  //
  grunt.initConfig({

    // Project configuration
    // -------------------

    // specify an alternate install location for Bower
    bower: {
      dir: 'app/components'
    },

    // TODO: Configure the handlebars task for building
    handlebars: {
      compile: {
        files: {
          "app/modules/compiled-templates.js": [
            "app/templates/**/*.hbs"
          ]
        },
        options: {
          namespace: 'MyApp.Templates', // TODO
          processName: function(filename) {
            // funky name processing here
            return filename
                    .replace(/^app\/templates\//, '')
                    .replace(/\.hbs$/, '');
          }
        }
      }
    },

    recess: {
      bootstrap: {
        src: [
          'components/bootstrap/less/bootstrap.less', // TODO: Use vendor path
          'components/bootstrap/less/responsive.less' // TODO: Use vendor path
        ],
        dest: 'app/styles/bootstrap.css',
        options: {
          compile: true,
          compress: false
        }
      },
      main: {
        src: [
          'app/styles/less/vendor/animate.less',
          'app/styles/less/vendor/auth-buttons.less',
          'app/styles/less/main/style.less'
        ],
        dest: 'app/styles/main.css',
        options: {
          compile: true,
          compress: false
        }
      }
    },

    // Configuration options for the "watch" task.
    watch: {
      styles: {
        files: [
          'app/styles/less/**/*.less'
        ],
        tasks: 'recess reload'
      },
      handlebars: {
        files: [
          'app/templates/**/*.hbs'
        ],
        tasks: 'handlebars reload'
      },
      reload: {
        files: [
          'app/*.html',
          //'app/styles/**/*.css',
          //'app/scripts/modules/**/*.js',
          'app/images/**/*'
        ],
        tasks: 'reload'
      }
    },

    // Lists of files to be linted
    lint: {
      files: [
        //'Gruntfile.js',
        //'test/**/*.js'
        'app/scripts/modules/**/*.js',
        '!app/scripts/vendor/**/*.js'
      ]
    },

    // Global configuration options for JSHint, used by "lint" task.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },

    // generate application cache manifest
    manifest:{
      dest: ''
    },

    // headless testing through PhantomJS
    mocha: {
      all: ['http://localhost:3501/index.html'] // TODO
      //all: ['test/**/*.html']
    },

    // Build configuration
    // -------------------

    // the staging directory used during the process
    staging: 'temp',
    // final build output
    output: 'dist',

    mkdirs: {
      staging: 'app/'
    },

    // Below, all paths are relative to the staging directory, which is a copy
    // of the app/ directory. Any .gitignore, .ignore and .buildignore file
    // that might appear in the app/ tree are used to ignore these values
    // during the copy process.

    // renames JS/CSS to prepend a hash of their contents for easier
    // versioning
    rev: {
      js: 'modules/**/*.js',
      css: 'styles/**/*.css',
      img: 'images/**'
    },

    // Everything in index.html between build:js and endbuild will be
    // minified to modules/scripts.js
    // Ex. index.html
    // <!-- build:js modules/scripts.js -->
    // <!-- endbuild -->
    'usemin-handler': {
      html: 'index.html'
    },

    // update references in HTML/CSS to revved files
    usemin: {
      html: ['**/*.html'],
      css: ['**/*.css']
    },

    // HTML minification
    html: {
      files: ['**/*.html']
    },

    // Optimizes JPGs and PNGs (with jpegtran & optipng)
    img: {
      dist: '<config:rev.img>'
    },

    // rjs configuration. You don't necessarily need to specify the typical
    // `path` configuration, the rjs task will parse these values from your
    // main module, using http://requirejs.org/docs/optimization.html#mainConfigFile
    //
    // name / out / mainConfig file should be used. You can let it blank if
    // you're using usemin-handler to parse rjs config from markup (default
    // setup)
    rjs: {
      // no minification, is done by the min task
      optimize: 'none',
      baseUrl: './scripts', //'./modules',
      wrap: true,
      name: 'config'
    },

    // Deploy configuration
    // --------------------

    // TODO
    //aws: '<json:config-aws.json>',

    // If key and secret not passed with your config, grunt-s3 will
    // fallback to the following environment variables:
    // AWS_ACCESS_KEY_ID
    // AWS_SECRET_ACCESS_KEY
    s3: {
      options: {
        key: '<%= aws.key %>',
        secret: '<%= aws.secret %>',
        bucket: '<%= aws.bucket %>',
        access: 'public-read'
      },
      prod: {
        // These options override the defaults
        options: {
          encodePaths: true,
          maxOperations: 20,
          debug: false
        },
        // Files to be uploaded.
        upload: [{
          src: "dist",
          dest: "/",
          gzip: true
        }]
      }
    }
  });

  // Load `recess` task
  grunt.loadNpmTasks('grunt-recess');

  // Load `handlebars` task
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  // Load `s3` task
  grunt.loadNpmTasks('grunt-s3');

  // Alias `test` task to run `mocha` task instead
  //grunt.registerTask('test', 'server:phantom mocha');
  grunt.registerTask('test', 'mocha');

  // Alias `compass` task to run `recess` task instead
  grunt.registerTask('compass', 'recess');

  // yeoman build task calls the coffee task; coffeescript is not used
  grunt.registerTask('coffee', []);

  // Alias `deploy` task to run `s3` task instead
  grunt.registerTask('deploy', 's3');

};
