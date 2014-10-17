'use strict';

/**
 * @ngdoc controller
 * @name buildium.apples.GrannySmithCtrl
 * @function
 * @module buildium.apples
 */

/* @ngInject */
module.exports = function GrannySmithCtrl($scope) {
    var ctrl = this;

    ctrl.things = [
        'green',
        'tart',
        'sort of gross'
    ];
};
