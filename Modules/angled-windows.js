/**
 * Angled Windows
 * 
 * Angular directive to create floating "application type" windows.
 * 
 * @author: Michael E Conroy (michael.e.conroy@gmail.com)
 *		- http://codepen.io/m-e-conroy/pen/ymiwz
 * @date: 21 Mar 2014
 * 
 * @require
 * 		* AngularJS 1.2.x
 * 		* AngularJS ngAnimate 1.2.x
 * 		* AngularJS ngSanitize 1.2.x
 * 		* jQuery UI 1.10.x
 * 			* Angled library: jQueryUI/angled-dragndrop.js
 * 			* Angled library: jQueryUI/angled-resizeit.js
 * 		* Angular UI Boostrap 0.10.x
 * 		* Bootstrap 3.1.x
 * 			* Angled library: Modules/css/angled-windows.css
 *		* Angled library:
 *			* /angled-filters.js
 *			* /Services/angled-helper-services.js
 */

angular.module('angled-windows-directives',['ngSanitize','ngAnimate','angled-dragndrop','angled-resizeit','angled-filters','angled-helper-services'])

	.directive('angledWindow',['$animate','angledHelperSrv',function($animate,helperSrv){
		return {
			restrict : 'E',
			transclude : true,
			replace : true,
			templateUrl : '/tmpls/window',
			scope : {
				id : '@id',
				title : '@title',
				grouping : '@grouping', // windows group for organizing z-index
				status : '=status' // status bar messages bi-directional
			},
			compile : function(tEl,tAttrs,transFn){
				return {
					pre : function(scope,el,attrs){ // ~object setup

						//== Variables ==//

						// id check and generation
						if(angular.isUndefined(scope.id)){
							var loop = true;
							while(loop){
								var id = helperSrv.randomStr(10);
								if(angular.element('#' + id).length == 0){
									el.attr('id',id); // set attribute element id
									scope.id = id; // set scope id
									loop = false; // end while loop
								}
							} // end while
						}

						// fix for template not rendering with {{id}} filled in
						scope.$evalAsync(function(){
							scope.id = el.attr('id');
						});

						scope.rolledUp = false;
						scope.dragOpts = {
							handle: 'div.panel-heading',
							opacity: 0.75
						}; // end dragOpts
						scope.resizeOpts = {
							handles: 'se',
							alsoResize: '#windowBodyContent_' + scope.id
						}; // end resizeOpts
					}, // end pre
					post : function(scope,el,attrs){ // ~link function

						//=== Methods ===//
				
						/**
						 * Roll Up
						 * Hides the content/body portion of the window, but leaves the window title bar visible.
						 */
						scope.rollUp = function(){
							scope.rolledUp = !scope.rolledUp;
							
							if(angular.equals(scope.rolledUp,true)){
								$animate.addClass(el,'rolled-up');
							}else{
								$animate.removeClass(el,'rolled-up');
							}
						}; // end rollUp
					} // end post
				}; // end return
			} // end compile
		}; // end return
	}]) // end angledWindow
	
	.run(['$templateCache',function($templateCache){
		$templateCache.put('/tmpls/window','<div class="angled-window {{grouping}}" angled-draggable="{{dragOpts | obj2string}}" group="{{grouping}}"> <div class="panel panel-primary" angled-resizable="{{resizeOpts | obj2string}}"> <div class="panel-heading cursor-move" id="windowHeading_{{id}}"> <span class="pull-right"> <a type="button" id="windowMinimizeBtn_{{id}}" class="btn btn-primary btn-xs" ng-click="rollUp()"> <span class="glyphicon" ng-class="{false: \'glyphicon-chevron-up\',true: \'glyphicon-chevron-down\'}[rolledUp]"></span> </a> </span> <span class="angled-window-title" ng-bind-html="title"></span> </div> <div id="windowBody_{{id}}" class="angled-window-body"> <div class="panel-body angled-window-body-content" id="windowBodyContent_{{id}}" ng-transclude></div> <div class="panel-footer"> <span class="text-muted angled-window-status-bar"><small>&nbsp;{{status}}</small></span> <span class="pull-right ui-resizable-handle ui-resizable-se"><svg version="1.1" id="Layer_3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="15px" height="15.5px" viewBox="0 0 15 15.5" enable-background="new 0 0 15 15.5" xml:space="preserve"><g><line fill="none" stroke="#4D4D4D" stroke-width="2" stroke-miterlimit="10" x1="14.75" y1="0" x2="0" y2="15"/><line fill="none" stroke="#4D4D4D" stroke-width="2" stroke-miterlimit="10" x1="14.868" y1="6" x2="5.74" y2="15.5"/><line fill="none" stroke="#4D4D4D" stroke-width="2" stroke-miterlimit="10" x1="15" y1="11.83" x2="11.392" y2="15.5"/></g></svg></span> </div> </div> </div> </div>');
	}]); // end run
	
// declare main module
angular.module('angled-windows',['angled-windows-directives']);