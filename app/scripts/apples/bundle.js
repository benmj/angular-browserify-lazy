(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
module.exports.$inject = ["$scope"];

},{}],2:[function(require,module,exports){
'use strict';

/**
 * @ngdoc controller
 * @name buildium.apples.RedDeliciousCtrl
 * @function
 * @module buildium.apples
 */

/* @ngInject */
module.exports = function RedDeliciousCtrl($scope) {
    var ctrl = this;

    ctrl.things = [
        'red',
        'shiny',
        'pretty gross'
    ];
};
module.exports.$inject = ["$scope"];

},{}],3:[function(require,module,exports){
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


},{"./controllers/granny-smith-ctrl.js":1,"./controllers/red-delicious-ctrl.js":2,"./routes":4,"angular":undefined}],4:[function(require,module,exports){
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
        }) ;
};
module.exports.$inject = ["$stateProvider"];


},{}]},{},[3])


//# sourceMappingURL=bundle.js.map