'use strict';

/* @ngInject */
module.exports = function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'scripts/common/views/index.html'
        });
};

