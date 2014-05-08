/**
 * Angled Storage Service
 *
 * Wrapper services for browser local, session and cookie storage.
 *
 * @author: Michael E Conroy (michael.e.conroy@gmail.com)
 *		- http://codepen.io/m-e-conroy
 * @date: 8 May 2014
 *
 */
 angular.module('angled-storage.services',[])

 	.service('angledGenericStorageSrv',['$log',function($log){
 		var storage = undefined;

 		var _logError = function(e){
			$log.error(e.name + ' (' + e.fileName + ':' + e.lineNumber + ') : ' + e.message);
 		}; // end logError

 		this.setStorage : function(s){
 			try{
 				if(angular.isUndefined(s) || !angular.isObject(s))
 					throw "Failed to set storage, unknown storage type.";
 				storage = s;
 				return true;
 			}catch(e){ _logError(e); }
 			return false;
 		}; // end setStorage

 		this.get : function(key){
 			try{
 				if(angular.isUndefined(key) || angular.equals(key,'') || angular.equals(key,null))
 					throw "Key is undefined.";
 				
 				return angular.fromJson(storage.getItem(key));
 			}catch(e){ _logError(e); }
 			return undefined;
 		}; // end get

 		this.save : function(key,data){
 			try{
 				if(angular.isUndefined(key) || !angular.isString(key))
 					throw "Key is undefined.";
 				if(angular.isUndefined(data))
 					throw "Data is undefined.";

 				storage.setItem(key,angular.toJson(data));
 				return true;
 			}catch(e){ _logError(e); }
 			return false;
 		}; // end save

 		this.del : function(key){
 			try{
 				if(angular.isUndefined(key) || !angular.isString(key))
 					throw "Key is undefined.";
 				
 				storage.removeItem(key);
 				return true;
 			}catch(e){ _logError(e); }
 			return false;
 		}; // end del

 		this.key : function(i){
 			try{
 				if(angular.isUndefined(i) || !angular.isNumber(i))
 					throw "Index is undefined.";

 				i = parseInt(i);
 				return storage.key(i);
 			}catch(e){ _logError(e); }
 			return undefined;
 		}; // end key

 		this.clear : function(){
 			try{
 				storage.clear();
 				return true;
 			}catch(e){ _logError(e); }
 			return false;
 		}; // end clear

 		this.length : function(){
 			try{
 				return storage.length;
 			}catch(e){ _logError(e); }
 			return false;
 		}; // end length
 	}]) // end angledGenericStorageSrv

 	.factory('angledStorageSrv',['$window','$log','angledGenericStorageSrv',function($window,$log,storageSrv){
 		var local = angular.isDefined($window.localStorage);
 		var session = angular.isDefined($window.sessionStorage);

 		return {
 			/**
 			 * Get Storage Type
 			 *
 			 * Returns a service based on the requested storage type, default is sessionStorage.
 			 *
 			 * @param	type 	string
 			 */
 			get : function(type){
 				switch(type){
 					case 'l':
 					case 'local':
 						if(local)
 							if(storageSrv.setStorage($window.localStorage))
 								return storageSrv; // return instance of angledGenericStorageSrv
 						else
 							$log.error('Local storage is not supported.');
 						
 						break;

 					case 's':
 					case 'session':
 					default:
 						if(session)
 							if(storageSrv.setStorage($window.sessionStorage))
 								return storageSrv; // return instance of angledGenericStorageSrv
 						else
 							$log.error('Session storage is not supported');

 						break;
 				}
 				return undefined;
 			}, // end get

 			getLocal : function(){
 				if(local)
 					if(storageSrv.setStorage($window.localStorage))
 						return storageSrv; // return instance of angledGenericStorageSrv
 				else
 					$log.error('Local storage is not supported.');

 				return undefined;
 			}, // end getLocal

 			getSession : function(){
 				if(session)
 					if(storageSrv.setStorage($window.sessionStorage))
 						return storageSrv; // return instance of angledGenericStorageSrv
 				else
 					$log.error('Session storage is not supported');

 				return undefined;
 			} // end getSession
 		}; // end return
 	}]); // end angledStorageSrv