'use strict';

/**
 * @ngdoc function
 * @name angularBrowserfyModuleApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angularBrowserfyModuleApp
 */
angular.module('angularBrowserfyModuleApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
