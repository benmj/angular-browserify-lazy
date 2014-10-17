module.exports = {
    dist: {
        files: [{
            dot: true,
            src: [
                '.tmp',
                '<%= yeoman.dist %>/scripts',
                '<%= yeoman.dist %>/styles',
                '<%= yeoman.dist %>/images',
                '<%= yeoman.dist %>/index.html',
                '<%= yeoman.app %>/scripts/bundle.js',
                '<%= yeoman.app %>/scripts/templates.js'
            ]
        }]
    },
    server: '.tmp'
};