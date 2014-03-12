/**
 * Drag N Drop
 * 
 * Angular directives to perform drag and drop functions with the help of 
 * jQuery UI.
 * 
 * @Author: Michael E Conroy (michael.e.conroy@gmail.com)
 * @Date: 12 Mar 2014
 * 
 * @require
 * 		* AngularJS 1.2.x
 * 		* AngularJS ngSanitize
 * 		* jQuery UI 1.10.x
 *  
 */
angular.module('mec-dragndrop-directives',['ngSanitize'])

	/**
	 *	Draggable
	 *	
  	 *	Attributes:
     *		1.  template
     *		2.  id
	 *   	3.  options - json of jquery ui draggable options
     *		4.  group
     *		5.  placeholder
     *	
     *	Example:
     *		<draggable template="/tmpls/mytemplate.html" id="myID" options="{addClasses: false,opacity: 0.5}" group="groupName" placeholder="true"></draggable>
     *		
     *	Events Emitted:
     *		* draggable.started (sends scope.obj object)
     *		* draggable.dragging
     *		* draggable.stopped
     *	
     *	Place Holder CSS Class: .dragging-placeholder
	 */
	.directive('draggable',['$compile',function($compile){
		return {
    		restrict : 'AE',
    		transclude : true,
    		replace : true,
		    // terminal : true, // make last directive to execute
		    scope : {},
		    templateUrl : function(el,attrs){ // if no template attribute is given use the default supplied template (see .run function)
		      return (angular.isDefined(attrs.template)) ? attrs.template : '/tmpls/draggable-default';
    		},
		    link : function(scope,el,attrs,ctrlr,transFn){
		    	// draggable object properties
		      	scope.obj = {
		        	id : null,
        			content : '',
		        	group : null
		      	};
      			scope.placeholder = false;
      
      			// transclusion - compile the content of the draggable with correct scope in order to apply any directives within
	      		/*transFn(scope,function(clone,innerScope){
			        // compile transcluded content
        			var dummy = angular.element('<div></div>');
		    	    dummy.append($compile(clone)(innerScope));
        			scope.obj.content = dummy.html();
			        dummy = null;
			    }); // end transFn*/ // no longer needed transclusion happens before the link function
			    
			    scope.obj.content = el.html();
      	
				if(angular.isDefined(attrs.id)) // save id if defined
        			scope.obj.id = attrs.id;
      
	      		if(angular.isDefined(attrs.placeholder)) // set whether or not to show the place holder upon dragging the element
    	    		scope.placeholder = scope.$eval(attrs.placeholder);
      
      			// options for jQuery UI's draggable method
      			var opts = (angular.isDefined(attrs.options)) ? scope.$eval(attrs.options) : {};
      
				if(angular.isDefined(attrs.group)){ // identify the draggable group if there is one
    	    		scope.obj.group = attrs.group;
        			opts.stack = '.' + attrs.group;
      			}
      
	      		// event handlers
    	  		var evts = {
    	  			start : function(evt,ui){
          				if(scope.placeholder) // ui.helper is jQuery object
            				ui.helper.wrap('<div class="dragging-placeholder"></div>');
          	
						scope.$apply(function(){ // emit event in angular context, send object with event
            				scope.$emit('draggable.started',{obj: scope.obj});
          				}); // end $apply
	        		}, // end start
        
	        		drag : function(evt){
    	      			scope.$apply(function(){ // emit event in angular context
        	    			scope.$emit('draggable.dragging');
          				}); // end $apply
        			}, // end drag
        
	        		stop : function(evt,ui){
    	      			if(scope.placeholder)
        	    			ui.helper.unwrap();
          
          				scope.$apply(function(){ // emit event in angular context
            				scope.$emit('draggable.stopped');
	          			}); // end $apply
    	    		} // end stop
      			}; // end evts
      
	      		// combine options and events
    	  		var options = angular.extend({},opts,evts);
      			el.draggable(options); // make element draggable
    		} // end link
  		}; // end return
	}]) // end draggable

	/**
	 * Droppable
	 * 
	 * Attributes:
	 * 		1.  template
	 * 		2.  id
	 * 		3.  options
	 * 
	 * Events Emitted:
	 *  	* droppable.dropped (sends droppable's scope.obj object)
	 */
	.directive('droppable',['$compile',function($compile){
		return {
			restrict : 'AE',
			replace : true,
			scope : {},
			templateUrl : function(el,attrs){
				return (angular.isDefined(attrs.template)) ? attrs.template : '/tmpls/droppable-default';
			},
			link : function(scope,el,attrs,ctrlr,transFn){
				scope.obj = {
					id : null,
					dropped : [] // list of items dropped on droppable
				};
				
				if(angular.isDefined(attrs.id)) // save id if defined
					scope.obj.id = attrs.id;
					
				// setup the options object to pass to jQuery UI's draggable method
				var opts = (angular.isDefined(attrs.options)) ? scope.$eval(attrs.options) : {};
				
				var evts = {
					drop : function(evt,ui){ // apply scope context
						scope.$apply(function(){
							scope.obj.dropped.push(angular.copy(scope.$parent.obj));
							scope.$emit('droppable.dropped',{obj: scope.obj});
						});
					}
				}; // end evts
				
				var options = angular.extend({},opts,evts);
				el.droppable(options);
			} // end link
		}; // end return
	}]) // end droppable

	.run(['$templateCache',function($templateCache){
		// draggable default template
  		$templateCache.put('/tmpls/draggable-default','<div class="draggable-object" ng-transclude></div>');
  		// droppalbe default template
  		$templateCache.put('/tmpls/droppable-default','<div class="droppable-droparea"><div ng-repeat="dropped in obj.dropped" ng-bind-html="dropped.content"></div></div>');
	}]); // end .run
	
// declare main module
angular.module('mec-dragndrop',['mec-dragndrop-directives']);
