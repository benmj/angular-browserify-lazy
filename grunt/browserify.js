module.exports = {
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
            external: ['angular'],
            browserifyOptions: {
                debug: true,
            }
        }
    }

};
