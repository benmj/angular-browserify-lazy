'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 * @name buildium.apples
 * @description
 *
 * # buildium.apples
 * apple
 */
module.exports = angular
    .module('buildium.apples', [])
    .controller('RedDeliciousCtrl', require('./controllers/red-delicious-ctrl.js'))
    .controller('GrannySmithCtrl', require('./controllers/granny-smith-ctrl.js'))
    .config(require('./routes'))
    .name;

