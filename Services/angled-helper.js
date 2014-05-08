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
 angular.module('angled-helper.services',[])

 	.factory('angledHelperSrv',['$log',function($log){

 		//== Variables ==//

 		var _rsLength = 10; // default random string length

 		return {
 			/**
 			 * Random String
 			 *
 			 * Generates a random string of given length.  Set 'alphanumeric' to true for a random string
 			 * that may include numbers.
 			 *
 			 * @param	length 		int
 			 */
 			randStr : function(length,alphanumeric){
 				length = (angular.isDefined(length) && !(angular.equals(length,0) || angular.equals(length,null) || (parseInt(length) <= 0))) ? parseInt(length) : _rsLength;
 				alphanumeric = (angular.isDefined(alphanumeric) && !(angular.equals(alphanumeric,0) || angular.equals(alphanumeric,'false') || angular.equals(alphanumeric,'no') || angular.equals(alphanumeric,false))) ? true : false;

 				var _random = '';
 				var _chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
 				var _numbers = ['0','1','2','3','4','5','6','7','8','9'];
 				var _glyphs = [];

 				if(alphanumeric)
 					_glyphs = _chars.concat(_numbers);
 				else
 					_glyphs = _chars;

 				var _gLength = _glyphs.length;
				for(var i = 0; i < length; i++) {
					_random += _glyphs[Math.floor(Math.random()*_gLength)];
				}
				return _random;
 			}, // end randStr

 			/**
 			 * Dump Object
 			 *
 			 * Will dump object properties and their values to the browser console.
 			 *
 			 * @param	obj 	object
 			 * @param	name	string
 			 */
 			dumpObj : function(obj,name){
 				name = (angular.isDefined(name)) ? name : '[obj]';
 				if(angular.isDefined(obj) && !angular.equals(obj,null) && (obj.length > 0)){
 					$log.info('Properties of object: ' + name);
 					angular.forEach(obj,function(val,key){
 						this.info('Property: ' + key + " Value: " + val);
 					},$log);
 				}
 			} // end dumpObj
 		}; // end return
 	}]); // end angledHelperSrv