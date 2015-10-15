/**
 * Angled Helper : Dump Object 2 Console
 *
 * Dumps javascript object to browser's console in a formated way.
 *
 * @author: Michael E Conroy (michael.e.conroy@gmail.com)
 *		-http://codepen.io/m-e-conroy
 * @date: 27 Mar 2014
 *
 * @dependencies:
 * 		- $log
 */
angular.module('angled-helper.dumpObj',[])

	.service('angledDumpObjSrvc',['$log',function($log){

		/**
		 * Dump
		 * Outputs object's properties to the console
		 * @param	obj 	object
		 * @param	name 	string
		 */
		this.dump = function dump(obj,name){
			name = (angular.isDefined(name)) ? name : '[obj]';
			if(angular.isDefined(obj) && !angular.equals(obj,null) && (obj.length > 0)){
				$log.info('Properties of object: ' + name);
				angular.forEach(obj,function(val,key){
					if(angular.isObject(val))
						val = JSON.stringify(val);
					this.info('Property: ' + key + " Value: " + val);
				},$log);
			}
		}; // end dump

	}]); // end angledDumpObjSrvc