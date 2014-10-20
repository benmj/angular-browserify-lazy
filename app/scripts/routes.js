'use strict';

/* @ngInject */
module.exports = function ($stateProvider, $locationProvider, $urlRouterProvider) { 
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/'); 

    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'scripts/common/views/index.html'
        });
};

