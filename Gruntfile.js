module.exports = function(grunt) {

  'use strict';
  // require it at the top and pass in the grunt instance
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    // Project metadata
    pkg: grunt.file.readJSON('package.json'),
    emailSettings: {
    	"common": {
				"subject": "Test Email: Greetings from Development"
			},
			"litmus": {
				"username": "username@domain.com",
				"password": "password",
				"url": "https://yours.litmus.com",
				"applications": ["android22","ol2003","ol2007","ol2010","ol2011","ol2013","chromegmailnew","chromeyahoo","appmail6","iphone5","iphone4","ipad","android4","blackberryhtml"]
			},
			"email": {
				"emailaddress": "hzeitler@menadwork.com"
			}
    },

    /**
     * START: Assemble Part
     */
    // <%= site %> metadata comes from this file
    site: grunt.file.readYAML('.assemble.yml'),

    assemble: {
      options: {
        flatten: true,
        assets: '<%= site.assets %>',

        // Metadata
        pkg: '<%= pkg %>',
        site: '<%= site %>',
        data: ['<%= site.data %>/**/*.yml'],
        helpers: ['<%= site.helpers %>/*.js'],
        plugins: '<%= site.plugins %>',

        // General templates
        partials: ['<%= site.includes %>/**/*.hbs'],
        layouts: '<%= site.layouts %>',
        layoutext: '<%= site.layoutext %>',
        layout: '<%= site.layout %>',

        // Pattern Lab templates
        patterns: {
          atoms: ['<%= site.atoms %>/**/*.hbs'],
          molecules: ['<%= site.molecules %>/**/*.hbs'],
          organisms: ['<%= site.organisms %>/**/*.hbs'],
          templates: ['<%= site.templates %>/**/*.hbs'],
        }
      },

      // 'pages' are specified in the src
      site: {
        src: ['<%= site.pages %>/*.hbs', 'src/*.hbs'],
        dest: '<%= site.dest %>/'
      },

      patterns: {
        options: {
          permalinks: {
            preset: 'pretty',
            structure: ':pattern/:group',
            patterns: [
              {
                pattern: /:pattern/,
                replacement: function(src) {
                  return this.src.split('/')[1];
                }
              },
              {
                pattern: /:group/,
                replacement: function(src) {
                  return this.src.split('/')[2];
                }
              }
            ]
          }
        }
      },
    },
    /**
     * END: Assemble Part
     */

    clean: {
      examples: ['<%= assemble.examples.dest %>/**'],
      build: ["css/*", "css-min/*"]
    },

    compass: {
      dist: {
        options: {
          config: 'config.rb',
          sourcemap: true
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 100 version'],
        map: true
      },
      multiple_files: {
        expand: true,
        flatten: true,
        src: 'css/*.css',
        dest: 'css/'
      }
    },

    copy: {
		  main: {
		    files: [
		      {expand: true, src: ['css/**/*'], dest: '<%= site.dest %>/public/', filter: 'isFile'},
		      {expand: true, src: ['images/**/*'], dest: '<%= site.dest %>/public/', filter: 'isFile'},
		      {expand: true, flatten: true, cwd: 'patterns/', src: ['**/*.png', '**/*.gif', '**/*.jpg', '**/*.jpeg', '**/*.svg'], dest: '<%= site.dest %>/public/images/', filter: 'isFile'}
		    ],
		  }
		},

    watch: {

			html: {
        files: ['*.html'],
        options: {
          livereload: true
        }
      },

      sass: {
        files: ['scss/**/*.scss', '<%= site.patterns %>/**/*.scss'],
        tasks: ['compass:dist', 'autoprefixer', 'csswring:minify'],
        options: {
          livereload: true,
          spawn : false       // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions.
        }
      }

    },

    emailBuilder:{
		  inline: {
		    options: {
		      encodeSpecialChars: true
		    },
		    files: [{
		    	expand: true,
		    	flatten: true,
		    	src: ['<%= site.dest %>**/*.html'],
		    	dest: '<%= site.dest %>/'
		    }]
		  },
		  litmus: {
		    files: [{
		    	expand: true,
		    	flatten: true,
		    	src: ['<%= site.dest %>**/*.html'],
		    	dest: '<%= site.dest %>/'
		    }],
		    options: {
		      encodeSpecialChars: true,
		      litmus: {
		      	subject : '<%= emailSettings.common.subject %>',
		        username: '<%= emailSettings.litmus.username %>',
		        password: '<%= emailSettings.litmus.password %>',
		        url: '<%= emailSettings.litmus.url %>',
		        applications: '<%= emailSettings.litmus.applications %>'
		      }
		    }
		  },
		  emailTest: {
			  files: [{
		    	expand: true,
		    	flatten: true,
		    	src: ['<%= site.dest %>**/*.html'],
		    	dest: '<%= site.dest %>/'
		    }],
				options: {
					encodeSpecialChars: false,
					emailTest: {
						email : '<%= emailSettings.email.emailaddress %>',
						subject : '<%= emailSettings.common.subject %>'
					}
		    }
		  }
		}

  });

  // Load Assemble
  grunt.task.loadNpmTasks('assemble');
  // load all plugins from the "package.json"-file
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  // The default task to run with the `grunt` command
  grunt.registerTask('default', ['watch', 'assemble']);

  grunt.registerTask('assemble-mail', ['assemble', 'copy:main'/*, 'emailBuilder:inline', 'emailBuilder:emailTest'*/]);

  grunt.registerTask('clean-build', ['clean:build']);

  grunt.registerTask(
      'build',
      'Build this website ... yeaahhh!',
      [ 'clean:build', 'compass:dist', 'autoprefixer', 'copy:main']
  );
};
