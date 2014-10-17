module.exports = {
    options: {
        browsers: ['last 1 version']
    },
    dist: {
        files: [{
            expand: true,
            cwd: '<%= yeoman.app %>/styles/',
            src: '*.css',
            dest: '<%= yeoman.app %>/styles/'
        }]
    }
};