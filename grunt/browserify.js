module.exports = {
    // write all built files to the dist directory
    lib: {
        files : {
            '<%= yeoman.dist %>/scripts/vendor.js': [
                
            ]
        }
    },

    dev: {
        files: {
            '<%= yeoman.dist %>/scripts/main.js': ['<%= yeoman.app %>/scripts/app.js', '.tmp/main-templates.js'],
            '<%= yeoman.dist %>/scripts/oranges.js': ['<%= yeoman.app %>/scripts/oranges/index.js', '.tmp/oranges-templates.js'],
            '<%= yeoman.dist %>/scripts/apples.js': ['<%= yeoman.app %>/scripts/apples/index.js', '.tmp/apples-templates.js'],
        },
        options: {
            external: ['angular'],
            browserifyOptions: {
                debug: true,
            }
        }
    }
};
