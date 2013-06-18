/**
 * Created with JetBrains WebStorm.
 * Date: 13-6-18
 * Time: 下午11:26
 * @overview resume the project
 * @author Meathill <meathill@gmail.com> (http://blog.meathill.com/)
 * @since 0.1.0
 */
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.read('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      libs: {
        src: ['js/vendor/modernizr-2.6.2.min.js', 'js/vendor/jquery.hammer.min.js'],
        dest: 'resume/js/libs.js'
      },
      apps: {
        src: ['js/helper.js', 'js/Carousel.js', 'js/main.js'],
        dest: 'resume/js/app.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        compress: {
          global_defs: {
            'DEBUG': false
          },
          dead_code: true
        }
      },
      resume: {
        src: 'resume/js/app.js',
        dest: 'resume/js/app.min.js'
      }
    },
    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> <%=grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      minify: {
        files: {
          'resume/css/style.css': ['css/normalize.css', 'css/main.css']
        }
      }
    },
    copy: {
      img: {
        files: [{
          expand: true,
          cwd: 'img/',
          src: ['**'],
          dest: 'resume/img/',
          filter: function (src) {
            return src.substr(src.lastIndexOf('.') + 1) !== 'db';
          }
        }]
      },
      preloader: {
        files: [{
          src: 'js/vendor/preloadjs-0.3.1.min.js',
          dest: 'resume/'
        }]
      }
    },
    replace: {
      html: {
        src: ['index.html'],
        dest: 'resume/',
        replacements: [
          {
            from: /<!-- replace start -->[\S\s]+<!-- replace over -->/,
            to: ''
          },
          {
            from: /.+\/\/ replace/gm,
            to: ''
          }
        ]
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-text-replace');

  grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'copy', 'replace']);
}