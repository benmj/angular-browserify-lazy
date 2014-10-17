module.exports = {
    unit: {
        configFile: '<%= yeoman.dist %>/test/karma.conf.js',
        singleRun: true
    },
    watch: {
        configFile: '<%= yeoman.dist %>/test/karma.conf.js',
        singleRun: false,
        autoWatch: true,
        reporters: ['dots']
    },
    debug: {
        configFile: '<%= yeoman.dist %>/test/karma.conf.js',
        singleRun: false,
        autoWatch: true,
        reporters: ['dots'],
        browsers: ['Chrome']
    }
};