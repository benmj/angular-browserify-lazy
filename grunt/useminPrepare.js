module.exports = {
    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    html: '<%= yeoman.app %>/index.html',
    options: {
        dest: '<%= yeoman.dist %>',
        flow: {
            html: {
                steps: {
                    js: ['uglifyjs'],
                    css: ['cssmin']
                },
                post: {}
            }
        }
    }
};