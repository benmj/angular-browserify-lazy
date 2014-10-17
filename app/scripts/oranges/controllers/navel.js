'use strict';

/**
 * @ngdoc controller
 * @name buildium.oranges.NavelCtrl
 * @function
 * @module buildium.oranges
 */

/* @ngInject */
module.exports = function NavelCtrl($scope) {
    var ctrl = this;

    ctrl.things = [
        'orange',
        'medium',
        'have that belly-button thing'
    ];
};
