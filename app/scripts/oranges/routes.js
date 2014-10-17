'use strict';

/* @ngInject */
module.exports = function ($stateProvider) {
    $stateProvider.
        state('oranges', {
            url: '/oranges',
            templateUrl: 'scripts/oranges/views/index.html',
            controller: function () {
                console.log('oranges module');
            }
        })
        .state('oranges.clementine', {
            url: '/clementine',
            templateUrl: 'scripts/oranges/views/clementine.html',
            controller: 'ClementineCtrl as ctrl'
        })
        .state('oranges.navel', {
            url: '/navel',
            templateUrl: 'scripts/oranges/views/navel.html',
            controller: 'NavelCtrl as ctrl'
        }) ;
};

