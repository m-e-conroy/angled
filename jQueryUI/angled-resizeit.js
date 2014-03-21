/**
 * Angled Resize It
 * 
 * Angular directives to enable resizing of an object with the help of jQuery UI.
 * 
 * @author: Michael E Conroy (michael.e.conroy@gmail.com)
 * @date: 21 Mar 2014
 * 
 * @require
 * 		* AngularJS 1.2.x
 * 		* jQuery UI 1.10.x
 * 
 */

angular.module('angled-resizeit-directives',[])

	/**
	 * Angled Resizable 
	 * 
	 * Attributes:
	 * 		1. angled-resizeable - jQuery UI resizable function options (see jQuery UI docs)
	 * 		2. id
	 * 
	 * Example:
	 * 		<div id="window" class="panel" resizable="{handles: 'se', alsoResize: '#windowContent'}">...</div>
	 * 
	 * Events Emitted:
	 * 		* angled.resizable.create (sends resizable's scope.obj object)
	 * 		* angled.resizable.start (sends resizable's scope.obj object)
	 * 		* angled.resizable.stop (sends jQuery's ui helper object)
	 * 		* angled.resizable.resizing
	 * 
	 * Events Listening To:
	 * 		* angled.resizable.set.height - expects object {id: I, height: Y}
	 * 		* angled.resizable.set.width - expects object {id: I, width: X}
	 * 		* angled.resizable.reset.height - expects object {id: I}
	 * 		* angled.resizable.reset.width - expects object {id: I}
	 */
	.directive('angledResizable',['$timeout',function($timeout){
		return {
			restrict : 'A',
			link : function(scope,el,attrs){
				scope.obj = {
					el : null,
					id : null,
					originalSize : null, // {width,height}
					size : null // {width,height}
				};
				
				//=== Setup ===//
				
				scope.obj.el = el;
				
				if(angular.isDefined(attrs.id))
					scope.obj.id = attrs.id;
					
				// get jQuery UI options via the directive's attribute value
				var opts = (angular.isDefined(attrs.angledResizeable)) ? scope.$eval(attrs.angledResizeable) : {};
				
				// set up events object
				var evts = {
					create : function(evt,ui){
						$timeout(function(){
							scope.$apply(function(){
								scope.obj.originalSize = angular.copy(ui.size);
								scope.obj.size = angular.copy(ui.size);
								scope.$emit('angled.resizable.create',{obj: scope.obj});
							});
						});
					}, // end create
					
					start : function(evt,ui){
						scope.$apply(function(){
							scope.$emit('angled.resizable.start',{obj: scope.obj});
						});
					}, // end start
					
					stop : function(evt,ui){
						scope.$apply(function(){
							scope.$emit('angled.resizable.stop',{'ui': ui});
							scope.obj.size = angular.copy(ui.size);
						});
					}, // end stop
					
					resize : function(evt,ui){
						scope.$apply(function(){
							scope.$emit('angled.resizable.resizing');
						}); 
					} // end resize
				}; // end evts
				
				var options = angular.extend({},opts,evts);
				el.resizable(options);
				
				//=== Listeners ===//
				
				// set resizable object to a specified height | params = {id: I, height: Y}
				scope.$on('angled.resizable.set.height',function(evt,params){
					if(((angular.isDefined(params.id)) && (angular.equals(params.id,scope.obj.id))) && angular.isDefined(params.height))
						el.css('height',parseInt(params.height) + 'px');
				}); // end on(angled.resizable.set.height)
				
				// set resizable object to a specified width | params = {id: I, width: X}
				scope.$on('angled.resizable.set.width',function(evt,params){
					if(((angular.isDefined(params.id)) && (angular.equals(params.id,scope.obj.id))) && angular.isDefined(params.width))
						el.css('width',parseInt(params.width) + 'px');
				}); // end on(angled.resizable.set.width)
				
				// reset resizable object to original height | params = {id: I}
				scope.$on('angled.resizable.reset.height',function(evt){
					if(((angular.isDefined(params.id)) && (angular.equals(params.id,scope.obj.id))) && angular.isDefined(scope.obj.originalSize.height))
						el.css('height',parseInt(scope.obj.originalSize.height) + 'px');
				}); // end on(angled.resizable.reset.height)
				
				// reset resizable object to original width | params = {id: I}
				scope.$on('angled.resizable.reset.width',function(evt){
					if(((angular.isDefined(params.id)) && (angular.equals(params.id,scope.obj.id))) && angular.isDefined(scope.obj.originalSize.width))
						el.css('height',parseInt(scope.obj.originalSize.width) + 'px');
				}); // end on(angled.resizable.reset.width)
			} // end link
		}; // end return
	}]); // end resizable
	
// declare main module
angular.module('angled-resizeit',['angled-resizeit-directives']);