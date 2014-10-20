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
        // declared globally -- for now
        'ui.router',
        'ct.ui.router.extras',
        'oc.lazyLoad',

        require('./common'),
    ])
    .config(require('./routes'));
