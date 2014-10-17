// Copies remaining files to places other tasks can use
module.exports = {
    dist: {
        files: [{
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
                '*.{ico,png,txt}',
                '*.html',
                'images/{,*/}*.{webp}',
                'fonts/*'
            ]
        }]
    },
    styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles/',
        dest: '<%= yeoman.dist %>/styles/',
        src: '*.css'
    }
};