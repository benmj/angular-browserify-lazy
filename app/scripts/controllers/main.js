'use strict';

/**
 * @ngdoc function
 * @name angularBrowserfyModuleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularBrowserfyModuleApp
 */
angular.module('angularBrowserfyModuleApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
