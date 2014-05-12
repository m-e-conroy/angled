/**
 * Angled Drag N Drop Services
 *
 * A service to act as the communication pipe between draggable and droppable
 * elements.  The service will save the current object being dragged and return
 * that object when requested, such as when a droppable area requests it because
 * it has detected a "drop" event.
 *
 * @author: Michael E Conroy (michael.e.conroy@gmail.com)
 *		- http://codepen.io/m-e-conroy
 * @date: 25 Mar 2014
 *
 */
angular.module('angled-dragndrop.services',[])

	.factory('angledDndSrv', [function(){

		//== Variables ==//

		var _draggable = null; // saved draggable object

		//== Methods ==//

		return {
			/**
			 * Set Draggable
			 * Saves the given draggable object.
			 *
			 * @param		obj
			 */
			setDraggable : function(obj){
				if(angular.isDefined(obj))
					_draggable = obj;
			}, // end setDraggable

			/**
			 * Get Draggable
			 * Retrieves the saved draggable object.
			 *
			 * @return		mixed		object/null
			 */
			getDraggable : function(){
				if(angular.isDefined(_draggable))
					return _draggable;
				else
					return null;
			}, // end getDraggable

			/**
			 * Clean
			 * Clean up the service by resetting the saved draggable object to null.
			 */
			clean : function(){
				_draggable = null;
			} // end clean
		}; // end return

	}]); // end angledDndSrv / angled-dragndrop-services


/**
 * Angled Drag N Drop
 * 
 * Angular directives to perform drag and drop functions with the help of 
 * jQuery UI.
 * 
 * @author: Michael E Conroy (michael.e.conroy@gmail.com)
 *		- http://codepen.io/m-e-conroy
 * @date: 12 Mar 2014
 * 
 * @require
 * 		* AngularJS 1.2.x
 * 		* jQuery UI 1.10.x
 *  
 */
angular.module('angled-dragndrop.directives',['angled-dragndrop.services'])

	/**
	 *	Angled Draggable
	 *	
  	 *	Attributes:
  	 * 		1.  angled-draggable - jQuery UI draggable function options (see jQuery UI docs)
     *		2.  id
     *		4.  group
     *		5.  placeholder
     * 		6.  associate - associated object, pass in an object of values to associate with the draggable content
     *	
     *	Example:
     *		<div id="menu" angled-draggable="{addClasses: false,opacity: 0.5}" group="groupName" placeholder="true">...</div>
     *		
     *	Events Emitted:
     *		* angled.draggable.started (sends scope.obj object)
     *		* angled.draggable.dragging
     *		* angled.draggable.stopped
     *	
     *	Place Holder CSS Class: .dragging-placeholder
	 */
	.directive('angledDraggable',['angledDndSrv',function(angledDndSrv){
		return {
    		restrict : 'A',
		    compile : function(){
		    	return {
		    		pre : function(scope,el,attrs){ // ~setup function
				    	// draggable object properties
				      	var _obj = {
				        	id : null,
		        			content : '',
		        			associate : null,
				        	group : null
				      	};
		      			var placeholder = false;
					    
					    //=== Setup ===//
					    
					    _obj.content = el.html(); // save object content
		      	
						if(angular.isDefined(attrs.id)) // save id if defined
		        			_obj.id = attrs.id;
		      			
		      			if(angular.isDefined(attrs.associate)) // save associated object
		      				_obj.associate = attrs.associate;
		      				
			      		if(angular.isDefined(attrs.placeholder)) // set whether or not to show the place holder upon dragging the element
		    	    		placeholder = scope.$eval(attrs.placeholder);
		      
		      			// options for jQuery UI's draggable method
		      			var opts = (angular.isDefined(attrs.angledDraggable)) ? scope.$eval(attrs.angledDraggable) : {};
		      
						if(angular.isDefined(attrs.group)){ // identify the draggable group if there is one
		    	    		_obj.group = attrs.group;
		        			opts.stack = '.' + attrs.group;
		      			}
		      
			      		// event handlers
		    	  		var evts = {
		    	  			start : function(evt,ui){
		          				if(placeholder) // ui.helper is jQuery object
		            				ui.helper.wrap('<div class="angled-draggable-placeholder"></div>');
		          	
								scope.$apply(function(){ // broadcast event in angular context, send object with event
									angledDndSrv.setDraggable(_obj);
		            				scope.$emit('angled.draggable.started',{obj: _obj});
		          				}); // end $apply
			        		}, // end start
		        
			        		drag : function(evt){
		    	      			scope.$apply(function(){ // emit event in angular context
		        	    			scope.$emit('angled.draggable.dragging');
		          				}); // end $apply
		        			}, // end drag
		        
			        		stop : function(evt,ui){
		    	      			if(placeholder)
		        	    			ui.helper.unwrap();
		          
		          				scope.$apply(function(){ // emit event in angular context
		            				scope.$emit('angled.draggable.stopped');
			          			}); // end $apply
		    	    		} // end stop
		      			}; // end evts
		      
			      		// combine options and events
		    	  		var options = angular.extend({},opts,evts);
		      			el.draggable(options); // jQuery UI call
		      		}, // end pre
		      		post : function(scope,el,attrs){ // ~link function

		      		} // end post
		      	}; // end return
		    } // end compile
  		}; // end return
	}]) // end angledDraggable

	/**
	 * Angled Droppable
	 * 
	 * Attributes:
	 * 		1.  angled-droppable - jQuery UI droppable function options (see jQuery UI docs)
	 * 		2.  id
	 * 
	 * Example:
	 * 		<div id="dropArea" angled-droppable="{}">...</div>
	 * 
	 * Events Emitted:
	 *  	* angled.droppable.dropped (sends droppable's scope.obj object)
	 */
	.directive('angledDroppable',['angledDndSrv',function(angledDndSrv){
		return {
			restrict : 'A',
			compile : function(){
				return {
					pre : function(scope,el,attrs){ // ~setup function
						var _obj = {
							id : null,
							dropped : [] // list of items dropped on droppable
						};
						
						if(angular.isDefined(attrs.id)) // save id if defined
							_obj.id = attrs.id;
							
						// setup the options object to pass to jQuery UI's draggable method
						var opts = (angular.isDefined(attrs.angledDroppable)) ? scope.$eval(attrs.angledDroppable) : {};

						var evts = {
							drop : function(evt,ui){ // apply scope context
								scope.$apply(function(){
									// get the object draggalbe object being dropped and push a copy onto the droppable's array
									var _dropped = angledDndSrv.getDraggable();
									if(angular.isDefined(_dropped) && !angular.equals(_dropped,null))
										_obj.dropped.push(angular.copy());
									angledDndSrv.clean();

									scope.$emit('angled.droppable.dropped',{obj: _obj});
								});
							}, // end drop

							over : function(evt,ui){
								scope.$apply(function(){
									scope.$emit('angled.droppable.over',{id: _obj.id});
								});
							} // end over
						}; // end evts
						
						var options = angular.extend({},opts,evts);
						el.droppable(options); // jQuery UI call
					}, // end pre
					post : function(scope,el,attrs){ // ~link function

					} // end post
				}; // end return
			} // end compile
		}; // end return
	}]); // end angledDroppable
	
// declare main module
angular.module('angled-dragndrop',['angled-dragndrop.directives']);