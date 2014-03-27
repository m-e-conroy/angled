angular.module('angled-filters',[])

	.filter('obj2string',function(){
		return function(input){
			/**
			 * Parse
			 * @credit: http://www.davidpirek.com/blog/object-to-string-how-to-deserialize-json
			 */
			var parse = function(_o){ 
				var a = [], t;
				for(var p in _o){
					if(_o.hasOwnProperty(p)){
						t = _o[p];
						if(t && typeof t == "object"){
							a[a.length]= p + ":{ " + arguments.callee(t).join(", ") + "}";
						}else{   
							if(typeof t == "string"){
								a[a.length] = [ p+ ": \"" + t.toString() + "\"" ];
							}else{
								a[a.length] = [ p+ ": " + t.toString()];
							}
						}
					}
				}
				return a;
		    } // end parse
		    input = "{" + parse(input).join(", ") + "}"
		    return input;
		}; // end return
	}); // end obj2string

// end angled-filters