/**
 * Angled Navbar
 *
 * Angular directive to automate creation of Bootstrap navbar.
 *
 * @author : Michael E Conroy (michael.e.conroy@gmail.com)
 * 		- http://codepen.io/m-e-conroy/pen/bcEsA
 * @date : 9 Jun 2014
 * 
 * @require
 *		* jQuery 2.1.1
 *		* AngularJS 1.2.x
 * 		* AngularJS ngSanitize 1.2.x
 *		* Bootstrap 3.1.x CSS & JS
 *			* Angled Library: Modules/css/angled-navbar.css
 */

 angular.module('angled-navbar.directives',['ngSanitize'])

 	.directive('angledNavbar',[function(){
 		return {
 			restrict : 'AE',
 			scope : {
 				brand : '=',
 				menus : '=',
 				affixed : '=',
 				search : '=',
 				inverse : '=',
 				searchfn : '&',
 				navfn : '&'
 			},
 			templateUrl : 'tmpls/nav/navbar.html',
 			controller : function($scope,$element,$attrs){

 				//== Scope/Attributes Defaults ==//

 				$scope.defaults = {
 					brand : '<span class="glyphicon glyphicon-certificate"></span>',
 					menus : [],
 					search : {
 						show: false
 					}
 				}; // end defaults

 				//-- Attribute Check --//

 				/* if no parent function was passed to directive for navfn or 
 				 * searchfn, then create one to emit an event
 				 */

 				if(angular.isUndefined($attrs.navfn)){
 					$scope.navfn = function(action){
 						if(angular.isObject(action))
 							$scope.$emit('angled-navbar.menu',action);
 						else
 							$scope.$emit('angled-navbar.menu',{'action' : action});
 					}; // end navfn
 				}

 				if(angular.isUndefined($attrs.searchfn)){
 					$scope.searchfn = function(){
 						$scope.$emit('angled-navbar.search.execute');
 					}; // end searchfn
 				}

 				//-- Observers & Listeners --//

 				$scope.$watch('affixed',function(val,old){
 					var b = angular.element('body');
 					// affixed top
 					if(angular.equals(val,'top') && !b.hasClass('navbar-affixed-top')){
 						if(b.hasClass('navbar-affixed-bottom'))
 							b.removeClass('navbar-affixed-bottom');
 						b.addClass('navbar-affixed-top');
 					}else if(angular.equals(val,'bottom') && !b.hasClass('navbar-affixed-bottom')){
 						if(b.hasClass('navbar-affixed-top'))
 							b.removeClass('navbar-affixed-top');
 						b.addClass('navbar-affixed-bottom');
 					}else{
 						if(b.hasClass('navbar-affixed-top'))
 							b.removeClass('navbar-affixed-top');
 						if(b.hasClass('navbar-affixed-bottom'))
 							b.removeClass('navbar-affixed-bottom');
 					}
 				}); // end watch(affixed)

 				//-- Methods --//

 				$scope.noop = function(){
 					angular.noop();
 				}; // end noop

 				/**
 				 * Navigation Action
 				 * Navigation menu items will call this function which in turn will
 				 * use the passed in navfn or emit an action for the parent to handle.
 				 * @param		string		action
 				 */
 				$scope.navAction = function(action){
 					$scope.navfn({'action' : action});
 				}; // end navAction

 				/**
 				 * Have Branding
 				 * Checks to see if the brand attibute was passed, if not use the default.
 				 * @result 		string
 				 */
 				$scope.haveBranding = function(){
 					return (angular.isDefined($attrs.brand)) ? $scope.brand : $scope.defaults.brand;
 				}; // end haveBranding

 				/**
 				 * Has Menus
 				 * Checks to see if there were menus passed in for the navbar.
 				 * @result		boolean
 				 */
 				$scope.hasMenus = function(){
 					return (angular.isDefined($attrs.menus));
 				}; // end hasMenus

 				/**
 				 * Has Dropdown Menu
 				 * Check to see if navbar item should have a dropdown menu.
 				 * @param		object 		menu
 				 * @result		boolean
 				 */
 				$scope.hasDropdownMenu = function(menu){
 					return (angular.isDefined(menu.menu) && angular.isArray(menu.menu));
 				}; // end hasDropdownMenu

 				/**
 				 * Is Divider
 				 * Check to see if dropdown menu item is to be a menu divider.
 				 * @param		object 		item
 				 * @result		boolean
 				 */
 				$scope.isDivider = function(item){
 					return (angular.isDefined(item.divider) && angular.equals(item.divider,true));
 				}; // end isDivider

 			} // end controller
 		}; // end return
 	}]) // end angledNavbar

	.run(['$templateCache',function($templateCache){
		$templateCache.put('tmpls/nav/navbar.html','<nav class="navbar" ng-class="{\'navbar-inverse\': inverse,\'navbar-default\': !inverse,\'navbar-fixed-top\': affixed == \'top\',\'navbar-fixed-bottom\': affixed == \'bottom\'}" role="navigation"><div class="container-fluid"><div class="navbar-header"><button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu"><span class="sr-only">Toggle Navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" ng-click="noop()" ng-bind-html="haveBranding()"></a></div><div class="collapse navbar-collapse" id="navbar-menu" ng-if="hasMenus()"><ul class="nav navbar-nav"><li ng-repeat="menu in menus" ng-class="{true: \'dropdown\'}[hasDropdownMenu(menu)]"><a ng-if="!hasDropdownMenu(menu)" ng-click="navAction(menu.action)">{{menu.title}}</a><a ng-if="hasDropdownMenu(menu)" class="dropdown-toggle" data-toggle="dropdown">{{menu.title}} <b class="caret"></b></a><ul ng-if="hasDropdownMenu(menu)" class="dropdown-menu"><li ng-repeat="item in menu.menu" ng-class="{true: \'divider\'}[isDivider(item)]"><a ng-if="!isDivider(item)" ng-click="navAction(item.action)">{{item.title}}</a></li></ul></li></ul><form ng-if="search.show" class="navbar-form navbar-right" role="search"><div class="form-group"><input type="text" class="form-control" placeholder="Search" ng-model="search.terms"><button class="btn btn-default" type="button" ng-click="searchfn()"><span class="glyphicon glyphicon-search"></span></button></div></form></div></div></nav>');
	}]); // end angled-navbar.directives