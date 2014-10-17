'use strict';

/**
 * @ngdoc controller
 * @name buildium.oranges.ClementineCtrl
 * @function
 * @module buildium.oranges
 */

/* @ngInject */
module.exports = function ClementineCtrl($scope) {
    var ctrl = this;

    ctrl.things = [
        'orange',
        'small',
        'delicious'
    ];
};
