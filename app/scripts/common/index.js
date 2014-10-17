'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 * @name creditRetriever.common
 * @description
 *
 * # creditRetriever.common
 * Contains code common across modules
 */
module.exports = angular
    .module('buildium.common', [])
    .directive('bd.date', require('./directives/date'))
    .name;

