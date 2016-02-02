'use strict';

/**
 * @ngdoc filter
 * @name vineApp.filter:startFrom
 * @function
 * @description
 * # startFrom
 * Filter in the vineApp.
 */
angular.module('vineApp')
  .filter('startFrom', function () {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
  });
