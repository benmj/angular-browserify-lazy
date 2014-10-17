module.exports = {
    js: {
        files: [
            '<%= yeoman.app %>/scripts/*.js',
            '<%= yeoman.app %>/scripts/**/*.js',
            '!<%= yeoman.app %>/scripts/bundle.js',
            '!<%= yeoman.app %>/scripts/templates.js'
        ],
        //tasks: ['newer:jshint:all']
    },
    html: {
        files: [
            '<%= yeoman.app %>/index.html'
        ]
    },
    browserify: {
        files: [
            '<%= yeoman.app %>/scripts/**/*.js'
        ],
        tasks: ['browserify:dev', 'exorcise:dev']
    },
    livereload: {
        files: [
            '<%= yeoman.app %>/styles/*.css',
            '<%= yeoman.app %>/scripts/bundle.js',
            '<%= yeoman.app %>/views/**/*.html',
            '<%= yeoman.app %>/*.html'
        ],
        options: {
            livereload: true
        }
    }
};
