// Generated on 2014-10-17 using generator-angular 0.9.8

module.exports = function(grunt) {
    'use strict';

    // Load grunt tasks automatically
    require('load-grunt-config')(grunt, {
        jitGrunt: {
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

    grunt.registerTask('test', [
        'clean:server',
        'connect:test',
        'karma:unit'
    ]);

    grunt.registerTask('test-watch', [
        'clean:server',
        'connect:test',
        'karma:watch'
    ]);

    grunt.registerTask('test-debug', [
        'clean:server',
        'connect:test',
        'karma:debug'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'jshint',
        'ngtemplates:dist',
        'browserify:dist',
        'less',
        'autoprefixer',
        'useminPrepare',
        'concurrent:dist',
        'copy:dist',
        'cssmin',
        'uglify',
        'filerev',
        'usemin'
    ]);

    grunt.registerTask('build-dev', [
        'clean:dist',
        'jshint',
        'browserify:dev',
        'exorcise:dev',
        'less',
        'autoprefixer'
    ]);
};
