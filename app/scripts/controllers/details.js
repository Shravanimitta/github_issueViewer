'use strict';

/**
 * @ngdoc function
 * @name vineApp.controller:DetailsCtrl
 * @description
 * # DetailsCtrl
 * Controller of the vineApp
 */
angular.module('vineApp')
  .controller('DetailsCtrl', function ($scope, $location, issues, util) {
    $scope.showError = true;
    $scope.errorMessage = "No results found for the search";
  	var issue_number = $location.search().number;
  	$scope.issueDetails = {};
    $scope.issueDetails.comments= [];
    $scope.issueDetails.githubLink = {};
  	issues.getData("https://api.github.com/repos/npm/npm/issues/" + issue_number)
    	.then(function successCallback(response) {
        $scope.showError = false;
    		var res = response.data;
    		$scope.issueDetails.title = res.title;
    		$scope.issueDetails.state = res.state;
    		$scope.issueDetails.userName = res.user.login;
        $scope.issueDetails.usergithubLink  = res.user.html_url;
    		$scope.issueDetails.userAvatar = res.user.avatar_url;
        $scope.issueDetails.summary = res.body;
    		$scope.issueDetails.summary = util.formatContent(res.body, $scope.issueDetails.githubLink);
        
        if(res.labels.length > 0){
          $scope.issueDetails.labels = res.labels;
        }

        var comments_url = res.comments_url;
       issues.getData(comments_url)
          .then(function successCallback(response) {
            $scope.showError = false;
            if(response.data.length > 0){
              angular.forEach(response.data, function(item){
                $scope.issueDetails.githubLink[item.user.login] = item.user.html_url;
                var comment = {};
                comment.userName = item.user.login;
                comment.userAvatar = item.user.avatar_url;
                comment.usergithublink = item.user.html_url;
                comment.summary = item.body;
                comment.date = new Date(item.created_at);
                $scope.issueDetails.comments.push(comment);
              });
              angular.forEach($scope.issueDetails.comments, function(item){
                item.summary = util.formatContent(item.summary, $scope.issueDetails.githubLink);
              });
            }
        },  function errorCallback() {
            $scope.showError = true;
            $scope.errorMessage = "Error occurred. Try again in a few minutes";
        });

    	}, function errorCallback() {
    		 $scope.showError = true;
         $scope.errorMessage = "Error occurred. Try again in a few minutes";
    });
  });
