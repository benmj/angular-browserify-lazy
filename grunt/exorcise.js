module.exports = {
    dev: {
        options: {},
        files: {
            '<%= yeoman.dist %>/scripts/main.js.map': ['<%= yeoman.dist %>/scripts/main.js'],
            '<%= yeoman.dist %>/scripts/apples.js.map': ['<%= yeoman.dist %>/scripts/apples.js'],
            '<%= yeoman.dist %>/scripts/oranges.js.map': ['<%= yeoman.dist %>/scripts/oranges.js']
        }
    }
};
