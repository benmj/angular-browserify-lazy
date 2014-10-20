'use strict';

function ocLazyLoadStateFactory ($q, $ocLazyLoad, futureState) {
    return $ocLazyLoad.load(futureState.bundle);
}

/* @ngInject */
module.exports = function($stateProvider, $locationProvider, $urlRouterProvider, $futureStateProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'scripts/common/views/index.html'
        });

    $futureStateProvider.stateFactory('ocLazyLoad', ocLazyLoadStateFactory);

    $futureStateProvider.futureState({
        // required
        type: 'ocLazyLoad', // name of futureState stateFactory to use
        urlPrefix: '/oranges',
        stateName: 'oranges',

        // custom attribute
        bundle: {
            name: 'buildium.oranges',
            reconfig: true,
            files: ['scripts/oranges.js']
        }
    });

    $futureStateProvider.futureState({
        // required
        type: 'ocLazyLoad', // name of futureState stateFactory to use
        urlPrefix: '/apples',
        stateName: 'apples',

        // custom attribute
        bundle: {
            name: 'buildium.apples',
            reconfig: true,
            files: ['scripts/apples.js']
        }
    });
};
