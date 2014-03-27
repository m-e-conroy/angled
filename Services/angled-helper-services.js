/**
 * Angled Helper Service
 *
 * General helper functions as an Angular service.
 *
 * @author: Michael E Conroy (michael.e.conroy@gmail.com)
 *		- http://codepen.io/m-e-conroy
 * @date: 27 Mar 2014
 *
 */
 angular.module('angled-helper-services',[])

 	.factory('angledHelperSrv',[function(){
 		return {
 			randomStr : function(length){
 				var random = '';
 				var chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
				for(var i = 0; i < length; i++) {
					random += chars[Math.floor(Math.random()*26)];
				}
				return random;
 			} // end randomStr
 		}; // end return
 	}]); // end angledHelperSrv