'use strict';

/**
 * @ngdoc directive
 * @name buildium.common.date
 * @description
 *
 * # buildium.common.date
 * Create a div w/ an ISO timestamp
 */

module.exports = function DateDirective () {
    var directive = {};

    directive.restrict = 'E';
    directive.template = '<div>Common: ' + new Date().toISOString() + '</div>';

    return directive;
};
