'use strict';

/**
 * @ngdoc service
 * @name vineApp.http
 * @description
 * # http
 * Service in the vineApp.
 */
angular.module('vineApp')
  .service('issues', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getData = function(url) {
    	return $http({
    		method : 'GET',
    		url: url
    	});
    };
  });