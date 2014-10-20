// Generated on 2014-10-17 using generator-angular 0.9.8

module.exports = function(grunt) {
    'use strict';

    // Load grunt tasks automatically
    require('load-grunt-config')(grunt, {
        'jit-grunt': {
            ngtemplates: 'grunt-angular-templates',
            useminPrepare: 'grunt-usemin'
        },
        data: {
            yeoman: {
                app: 'app',
                dist: 'dist'
            }
        }
    });

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.registerTask('dev', [
        'clean:dist',

        'ngtemplates:main',
        'ngtemplates:apples',
        'ngtemplates:oranges',

        'copy',
        'browserify:dev',
        'exorcise:dev',
    ]);
};
