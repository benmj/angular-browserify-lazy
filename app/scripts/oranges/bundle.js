(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
module.exports.$inject = ["$scope"];

},{}],2:[function(require,module,exports){
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
module.exports.$inject = ["$scope"];

},{}],3:[function(require,module,exports){
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


},{"./controllers/clementine-ctrl.js":1,"./controllers/navel.js":2,"./routes":4,"angular":undefined}],4:[function(require,module,exports){
'use strict';

/* @ngInject */
module.exports = function ($stateProvider) {
    $stateProvider.
        state('oranges', {
            url: '/oranges',
            templateUrl: 'scripts/oranges/views/index.html',
            controller: function () {
                console.log('oranges module');
            }
        })
        .state('oranges.clementine', {
            url: '/clementine',
            templateUrl: 'scripts/oranges/views/clementine.html',
            controller: 'ClementineCtrl as ctrl'
        })
        .state('oranges.navel', {
            url: '/navel',
            templateUrl: 'scripts/oranges/views/navel.html',
            controller: 'NavelCtrl as ctrl'
        }) ;
};
module.exports.$inject = ["$stateProvider"];


},{}]},{},[3])


//# sourceMappingURL=bundle.js.map