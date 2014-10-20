module.exports = {
    main: {
        cwd: '<%= yeoman.app %>/',
        src: 'scripts/common/views/**/*.html',
        dest: '.tmp/main-templates.js',
        options: {
            module: 'angularBrowserfyModuleApp',
            bootstrap: function(module, script) {
                'use strict';
                return 'var angular = require(\'angular\'); angular.module(\'' + module + '\').run([\'$templateCache\', function ($templateCache) {' + script + '}]);';
            }
        }
    },

    oranges: {
        cwd: '<%= yeoman.app %>/',
        src: 'scripts/oranges/views/**/*.html',
        dest: '.tmp/oranges-templates.js',
        options: {
            module: 'buildium.oranges',
            bootstrap: function(module, script) {
                'use strict';
                return 'var angular = require(\'angular\'); angular.module(\'' + module + '\').run([\'$templateCache\', function ($templateCache) {' + script + '}]);';
            }
        }
    },

    apples: {
        cwd: '<%= yeoman.app %>/',
        src: 'scripts/apples/views/**/*.html',
        dest: '.tmp/apples-templates.js',
        options: {
            module: 'buildium.apples',
            bootstrap: function(module, script) {
                'use strict';
                return 'var angular = require(\'angular\'); angular.module(\'' + module + '\').run([\'$templateCache\', function ($templateCache) {' + script + '}]);';
            }
        }
    } 
};
