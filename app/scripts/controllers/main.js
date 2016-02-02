'use strict';

/**
 * @ngdoc function
 * @name vineApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the vineApp
 */
angular.module('vineApp')
  .controller('MainCtrl', function ($scope, issues, util, $location, $filter) {

    $scope.issues = [];
    $scope.showError = true;
    $scope.errorMessage = "No results found for the search";
    $scope.searchTextTyped =  false;
    $scope.filter_selected = "all";
    $scope.current_page = 0;
    $scope.total_pages = 0;
    var all_issues =[];
    var base_url = "//api.github.com/repos/npm/npm/issues";
    var search_url = "//api.github.com/search/issues";
    var url_prev="", url_next="", next_page = 1, prev_page = 0, per_page = 25, query="*";
    var repoSearchString = "repo:npm/npm";

    function loadData(url, next_page, per_page, query) {
        if(query !== undefined) {
          url = url + "?page=" + next_page + "&per_page=" + per_page + "&q=" + query;  
        }
        else{
            if(next_page !== undefined){
                url = url + "?page=" + next_page + "&per_page=" + per_page;
            }

        }
        issues.getData(url)
            .then(function successCallback(response, status, headers) {
            //derive page details from header
            var head = response.headers("link");
            if(head === null) {
                url_prev = "" ;
                url_next = "" ;
                next_page = 1 ;
                prev_page = 0 ;
                $scope.total_pages = 1;
            }
            else {
                var rels = head.split(",");
                var r;
                for(r = 0 ; r < rels.length; r++){
                    var rel_index = rels[r].indexOf("rel=\"");
                    //add 5 to the index to get the position of the value rel holds
                    rel_index = rel_index + 5;
                    var rel_length = rels[r].length;
                    var rel_value = rels[r].substring(rel_index, rel_length -1);
                    var regex = /page=(\d+)/;
                    var val_array = rels[r].match(regex);
                    var page_val = val_array[val_array.length - 1];
                    var href_start_index = rels[r].indexOf('<');
                    var href_end_index = rels[r].indexOf('>');
                    switch(rel_value){
                        case "prev":
                            prev_page = page_val;
                            url_prev = rels[r].substring(href_start_index + 1, href_end_index);
                            break;

                        case "next":
                            next_page = page_val;
                            url_next = rels[r].substring(href_start_index + 1, href_end_index);
                            break;

                        case "last":
                            $scope.total_pages = page_val;
                            break;    

                        case "first":
                            break;    
                    }
                    
                }

            }
            
            $scope.issues = [];
            var res;
            if(response.data.length === undefined){
               var res = response.data.items; 
            }
            else{
                var res = response.data;
            }
               angular.forEach(res, function(item){
                    var issue = {};
                    issue.name = util.formatContent(item.title);
                    issue.state = item.state;
                    issue.number = item.number;
                    issue.userName = item.user.login;
                    issue.userAvatar = item.user.avatar_url;
                    issue.userGithubLink = item.user.html_url;
                    issue.body = util.trim(item.body, 140);
                    issue.body = util.formatContent(issue.body);
                    if(item.labels.length > 0){
                        issue.labels = [];
                        issue.labels = item.labels;
                    }
                    $scope.issues.push(issue);
                });
                if($scope.issues.length > 0){
                    $scope.showError = false;
                    if($scope.current_page === 0){
                        $scope.current_page++;
                    }
                }
            }, function errorCallback() {
                $scope.showError = true;
                $scope.errorMessage = "Error occurred. Try again in a few minutes";
        });
    }

    loadData(base_url, next_page, per_page);

    $scope.search = function() {
        if($scope.searchText === undefined || $scope.searchText.trim() === "") {
            query = "*";
            next_page = 1;
            loadData(base_url, next_page, per_page, query);
        }
        else{
            query = $scope.searchText + "+in:title+in:body+in:comment+" + repoSearchString; 
            next_page = 1;
            loadData(search_url, next_page, per_page, query);
        }

        if($scope.issues.length === 0) {
            $scope.showError = true;
            $scope.errorMessage = "No results found for the search";
        }
        else {
            $scope.showError = false;
        }

        //reset all other fields
        var parentElem = document.getElementsByClassName("labels-header")[0];
        //reset label filters
        if(parentElem.hasChildNodes()){
            var e = parentElem.childNodes;
            parentElem.removeChild(e[0]);
        }
        //reset satate filters and page values
        $scope.filter_selected = "all";
        $scope.current_page = 0;
        $scope.total_pages = 0;
        url_prev=""; 
        url_next="";
        next_page = 1;
        prev_page = 0;
    };

    //filter based on the state
    $scope.filterState = function(id) {
        var label= "";
        var parentElem = document.getElementsByClassName('labels-header')[0];
        if(parentElem.hasChildNodes()){
            var e = parentElem.childNodes;
            label = e[0].innerHTML;
        }
        constructQuery(id, label);
    };

    //update current state filter
    $scope.isFilterActive = function(item) {
        return $scope.filter_selected === item; 
    };

    //filter based on the label
    $scope.filterLabels = function($event) {
        var label_name = $event.currentTarget.textContent;
        var elem =  $event.currentTarget;
        var parentElem = document.getElementsByClassName("labels-header")[0];
        if(parentElem.hasChildNodes()){
            var e = parentElem.childNodes;
            parentElem.removeChild(e[0]);
        }
        parentElem.appendChild(elem);

        constructQuery($scope.filter_selected, label_name);
    };


    //manage navigation between pages
    $scope.paginate = function(page) {
        if(page === "prev" && next_page >= 1) {
            $scope.current_page--;
            loadData(url_prev);
        }
        else if(page === "next" && $scope.current_page < $scope.total_pages) {
            $scope.current_page++;
            loadData(url_next);
        }   
    };

    //construct query string
    var constructQuery = function(state_id, label_name) {
        next_page = 1;
        //include search text
        if($scope.searchText === undefined || $scope.searchText.trim() === "") {
            query = "*";
        }
        else{
            query = $scope.searchText + "+in:title+in:body+in:comment+" + repoSearchString;
        }

        //include state filter
        switch(state_id) {
            case "open":
                $scope.filter_selected = "open";
                if(query === "*"){
                    query = "state:open";
                }
                else{
                    query = query + "+state:open";
                }
                break;

            case "closed":
                $scope.filter_selected = "closed";
                if(query === "*"){
                    query = "state:closed";
                }
                else{
                    query = query + "+state:closed";
                }
                break;
    
            case "all":
                $scope.filter_selected = "all";
                break;
        }

        //include label filter
        if(label_name !== ""){
            if(query === "*"){
                query = "label:" + label_name;
            }
            else{
                query = query + "+label:" + label_name;
            }
        }

        $scope.current_page = 0;

        if(query === "*"){
            loadData(base_url, next_page, per_page, query);
        }
        else{
            query = query + "+" + repoSearchString;
            loadData(search_url, next_page, per_page, query);
        }
    };

    $scope.checkText = function(){
        if($scope.searchText !== undefined && $scope.searchText.length > 0) {
            $scope.searchTextTyped =  true;
        }
        else {
            $scope.searchTextTyped =  false;

        }
    }

    $scope.clearSearch = function() {
        $scope.searchText = "";
        $scope.searchTextTyped =  false;
        $scope.search();
    }
  });

