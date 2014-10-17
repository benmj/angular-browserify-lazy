'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 * @name buildium.oranges
 * @description
 *
 * # buildium.oranges
 * apple
 */
module.exports = angular
    .module('buildium.oranges', [])
    .controller('ClementineCtrl', require('./controllers/clementine-ctrl.js'))
    .controller('NavelCtrl', require('./controllers/navel.js'))
    .config(require('./routes'))
    .name;

