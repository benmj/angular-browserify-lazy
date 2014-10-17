'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 * @name angularBrowserfyModuleApp
 * @description
 * # angularBrowserfyModuleApp
 *
 * Main module of the application.
 */

angular.module('angularBrowserfyModuleApp', [
        require('angular-ui-router'),
        require('./common'),
        require('./apples'),
        require('./oranges')
    ])
    .config(require('./routes'));
