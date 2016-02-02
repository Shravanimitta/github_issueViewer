'use strict';

/**
 * @ngdoc service
 * @name vineApp.util
 * @description
 * # util
 * Service in the vineApp.
 */
angular.module('vineApp')
  .service('util', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.trim = function (str, len) {
        //case 1 - string less than desired length, return text
        if (str.length <= len) {
            return str;
        }
        //case 2 - string contains no spaces return string with the desired length
        else if(str.indexOf(" ") < 0){
            return str.slice(0, len);
        }
        //case 3 - string length is more than desired length, look for any spaces or full stops
		else if(str.length > len) {
			if(str[len - 1] !== " " && str[len] !== " "  && str[len] !== ".") {
				var index = len - 1;
				while(index > -1 && str[index] !== " " && str[index] !== ".") {
					index--;
				}
				return (str.slice(0,index) + "...");
    		}
    		else {	
    			return str.slice(0,len);
    		}
		}
    };

    this.formatContent = function(str, git_map){
    	var string =  str;

    	//format URLs
    	var regex_url = /https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/
    	var url_array = string.match(regex_url);
    	var i;
    	if(url_array){
    		for(i=0; i< url_array.length; i++){
	    		var temp3 = url_array[i];
	    		temp3 = temp3.trim();
	    		var search_url = temp3.slice(1);
	    		formatted_element = "<a href='" + url_array[i] + "' class='git_link' >" + url_array[i] + "</a>";
	    		string = string.replace(url_array[i],formatted_element);
    		}
    	}

    	//parse username with @ to link to gihub profile
    	var regex_github = /@([a-zA-Z])+/g;
    	var name_array = string.match(regex_github);
    	if(name_array && git_map !== undefined){
    		for(i = 0; i < name_array.length; i++) {
                if(name_array[i].slice(1) in git_map) {
                    var temp = name_array[i];
                    temp = temp.trim();
                    var search_name = temp.slice(1);
                    var formatted_element = "<a href='" + git_map[search_name] + "' class='git_link' >" + name_array[i] + "</a>";
                    string = string.replace(name_array[i],formatted_element);
                }
    		}
    	}


    	var regex_triple = /(?:^|)```([^```]*?)```(?:$|)/g;
    	var code_array = string.match(regex_triple);
    	if(code_array){
    		for(i = 0; i < code_array.length; i++) {
    			var new_code = code_array[i];
                new_code = new_code.trim();
    			while(new_code.indexOf("```") > -1) {
    				new_code = new_code.replace("```","");
    			}
                new_code = new_code.trim();
	    		formatted_element = "<pre><code>" + new_code + "</code></pre>";
	    		string = string.replace(code_array[i],formatted_element);
    		}
    	}

        if(string.indexOf("```") < 0) {
           var regex_single = /(?:^|)`([^`]*?)`(?:$|)/g;
            code_array = string.match(regex_single);
            if(code_array){
                for(i = 0; i < code_array.length; i++) {
                    var new_code = code_array[i];
                    new_code = new_code.trim();
                    while(new_code.indexOf("`") > -1) {
                        new_code = new_code.replace("`","");
                    }
                    new_code = new_code.trim();
                    formatted_element = "<code>" + new_code + "</code>";
                    string = string.replace(code_array[i],formatted_element);
                }
            } 
        }
        
    	return string;
    }

  })
.filter('unsafe', function($sce) { return $sce.trustAsHtml; });
