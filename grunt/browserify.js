module.exports = {
    lib: {
        src: [ './node_modules/angular/angular.js' ],
        dest: '<%= yeoman.app %>/scripts/lib.js',
    },

    dev: {
        dest: '<%= yeoman.app %>/scripts/bundle.js',
        src : ['<%= yeoman.app %>/scripts/app.js'],
        options: {
            external: [ 'angular' ],
            browserifyOptions: {
                debug: true
            }
        }
    },

    modules: {
        files: {
            '<%= yeoman.app %>/scripts/apples/bundle.js': ['<%= yeoman.app %>/scripts/apples/index.js'],
            '<%= yeoman.app %>/scripts/oranges/bundle.js': ['<%= yeoman.app %>/scripts/oranges/index.js']
        },
        options: {
            external: ['./node_modules/angular/angular.js'],
            browserifyOptions: {
                debug: true,
            }
        }
    }

    //    dist: {
    //        src: ['<%= yeoman.app %>/scripts/app.js', '<%= yeoman.app %>/scripts/templates.js'],
    //        dest: '<%= yeoman.app %>/scripts/bundle.js',
    //        options: {
    //            transform: ['browserify-ngannotate']
    //        }
    //    }
};
