'use strict';

/* @ngInject */
module.exports = function ($stateProvider) {
    $stateProvider.
        state('apples', {
            url: '/apples',
            templateUrl: 'scripts/apples/views/index.html',
            controller: function () {
                console.log('apple module');
            }
        })
        .state('apples.delicious', {
            url: '/delicious',
            templateUrl: 'scripts/apples/views/red-delicious.html',
            controller: 'RedDeliciousCtrl as ctrl'
        })
        .state('apples.granny', {
            url: '/granny-smith',
            templateUrl: 'scripts/apples/views/granny-smith.html',
            controller: 'GrannySmithCtrl as ctrl'
        });
};

