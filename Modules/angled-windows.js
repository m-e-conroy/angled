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
 * 			* this library: jQueryUI/angled-dragndrop.js
 * 			* this library: jQueryUI/angled-resizeit.js
 * 		* Angular UI Boostrap 0.10.x
 * 		* Bootstrap 3.1.x
 * 			* this library: Modules/css/angled-windows.css
 */

angular.module('angled-windows-directives',['ngSanitize','ngAnimate','angled-dragndrop','angled-resizeit'])

	.directive('angledWindow',['$animate',function($animate){
		return {
			restrict : 'E',
			transclude : true,
			replace : true,
			templateUrl : '/tmpls/window',
			scope : {
				id : '@id',
				title : '@title',
				status : '=status' // status bar messages bi-directional
			},
			link : function(scope,el,attrs){
				scope.rolledUp = false; // is the content portion of the window hidden
				
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
				
			} // end link
		}; // end return
	}]) // end angledWindow
	
	.run(['$templateCache',function($templateCache){
		$templateCache.put('/tmpls/window','<div class="angled-window" angled-draggable="{handle: \'div.panel-heading\',opacity: 0.5}"> <div class="panel panel-primary" angled-resizable="{handles: \'se\', alsoResize: \'#windowBodyContent\'}"> <div class="panel-heading cursor-move" id="windowHeading"> <span class="pull-right"> <a type="button" id="windowMinimizeBtn" class="btn btn-primary btn-xs" ng-click="rollUp()"> <span class="glyphicon" ng-class="{false: \'glyphicon-chevron-up\',true: \'glyphicon-chevron-down\'}[rolledUp]"></span> </a> </span> <span class="angled-window-title" ng-bind-html="title"></span> </div> <div id="windowBody" class="angled-window-body"> <div class="panel-body angled-window-body-content" id="windowBodyContent" ng-transclude></div> <div class="panel-footer"> <span class="text-muted angled-window-status-bar"><small>&nbsp;{{status}}</small></span> <span class="pull-right glyphicon glyphicon-resize-full ui-resizable-handle ui-resizable-se"></span> </div> </div> </div> </div>');
	}]); // end run
	
// declare main module
angular.module('angled-windows',['angled-windows-directives']);