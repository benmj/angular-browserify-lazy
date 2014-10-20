module.exports = {
    js: {
        files: [
            '<%= yeoman.app %>/scripts/*.js',
            '<%= yeoman.app %>/scripts/**/*.js',
            '<%= yeoman.app %>/scripts/**/**/*.js',
       ],
       tasks: ['dev']
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
            'dist/scripts/*.js'
        ],
        options: {
            livereload: true
        }
    }
};
