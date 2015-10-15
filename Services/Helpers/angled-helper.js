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
 angular.module('angled-helper',['angled-helper.dumpObj','angled-helper.randStr'])

 	.factory('angledHelperSrvc',['angledRandStrSrvc','angledDumpObjSrvc',function(randStrSrvc,dumpObjSrvc){

 		return {
 			randStr : function(l,a){
 				return randStrSrvc.get(l,a);
 			}, // end randStr

 			dumpObj : function(o,n){
 				dumpObjSrvc.dump(o,n);
 			} // end dumpObj
 		};

 	}]); // end angledHelperSrvc