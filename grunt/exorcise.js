module.exports = {
    dev: {
        options: {},
        files: {
            '<%= yeoman.app %>/scripts/bundle.js.map': ['<%= yeoman.app %>/scripts/bundle.js'],
        }
    },

    modules: {
        options: {},
        files: {
            '<%= yeoman.app %>/scripts/apples/bundle.js.map': ['<%= yeoman.app %>/scripts/apples/bundle.js'],
            '<%= yeoman.app %>/scripts/oranges/bundle.js.map': ['<%= yeoman.app %>/scripts/oranges/bundle.js']
        }
    } 
};
