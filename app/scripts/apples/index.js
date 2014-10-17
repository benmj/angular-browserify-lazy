'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 * @name buildium.apple
 * @description
 *
 * # buildium.apple
 * apple
 */
module.exports = angular
    .module('buildium.apple', [])
    .controller('RedDeliciousCtrl', require('./controllers/red-delicious-ctrl.js'))
    .controller('GrannySmithCtrl', require('./controllers/granny-smith-ctrl.js'))
    .config(require('./routes'))
    .name;

