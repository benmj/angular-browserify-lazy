module.exports = {
    options: {
        compile: true
    },
    dist: {
        files: [
            {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                src: 'main.less',
                dest: '<%= yeoman.app %>/styles/',
                ext: '.css'
            }
        ]
    }
};