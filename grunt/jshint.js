module.exports = {
    options: {
        jshintrc: '<%= yeoman.dist %>/.jshintrc',
        reporter: require('jshint-stylish')
    },
    all: {
        src: [
            'Gruntfile.js',
            '<%= yeoman.app %>/scripts/*.js',
            '<%= yeoman.app %>/scripts/**/*.js',
            '!<%= yeoman.app %>/scripts/bundle.js',
            '!<%= yeoman.app %>/scripts/templates.js'
        ]
    },
    test: {
        options: {
            jshintrc: '<%= yeoman.dist %>/test/.jshintrc'
        },
        src: ['<%= yeoman.dist %>/test/spec/{,*/}*.js']
    }
};