module.exports = {
    dist: {
        cwd: '<%= yeoman.app %>/',
        src: 'views/**/*.html',
        dest: '<%= yeoman.app %>/scripts/templates.js',
        options: {
            module: 'creditRetrieverApp',
            bootstrap: function(module, script) {
                'use strict';
                return 'var angular = require(\'angular-bsfy\'); angular.module(\'creditRetrieverApp\').run([\'$templateCache\', function ($templateCache) {' + script + '}]);';
            }
        }
    }
};