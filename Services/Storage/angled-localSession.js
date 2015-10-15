/**
 * Angled Local & Session Storage Services
 *
 * Wrapper services for browser local & session storage.
 *
 * @author: Michael E Conroy (michael.e.conroy@gmail.com)
 *		- http://codepen.io/m-e-conroy
 * @date: 8 May 2014
 *
 * @dependencies
 *		- $window
 * 		- $log
 */
angular.module('angled-storage.localSession')

	/**
 	 * Generic Storage Service
 	 * Provides the methods to access a data store (storage) no matter the
 	 * type of data storage (session,local)
 	 */
 	.service('angledGenericStorageSrvc',['$log',function($log){
 		var _storage = undefined; // session or local storage

 		/**
 		 * Log Error
 		 * Logs errors to the browser console.
 		 * @param	e 		Exception Object
 		 */
 		var _logError = function _logError(e){
			$log.error(e.name + ' (' + e.fileName + ':' + e.lineNumber + ') : ' + e.message);
 		}; // end logError

 		/**
 		 * Set Storage
 		 * Set the service's storage object, either session or local.
 		 * @param	s 		object
 		 */
 		this.setStorage = function setStorage(s){
 			try{
 				if(angular.isUndefined(s) || !angular.isObject(s))
 					throw "Failed to set storage, unknown storage type.";
 				_storage = s;
 				return true;
 			}catch(e){ _logError(e); }
 			return false;
 		}; // end setStorage

 		/**
 		 * Get
 		 * Retrieve the value of the given key.
 		 * @param	key 	string
 		 */
 		this.get = function get(key){
 			try{
 				if(angular.isUndefined(key) || !angular.isString(key))
 					throw "Key is undefined.";
 				
 				return angular.fromJson(_storage.getItem(key));
 			}catch(e){ _logError(e); }
 			return undefined;
 		}; // end get

 		/**
 		 * Save
 		 * Save the given data with the index of the value key.
 		 * @param	key 	string
 		 * @param	data 	mixed
 		 */
 		this.save = function save(key,data){
 			try{
 				if(angular.isUndefined(key) || !angular.isString(key))
 					throw "Key is undefined.";
 				if(angular.isUndefined(data))
 					throw "Data is undefined.";

 				_storage.setItem(key,angular.toJson(data));
 				return true;
 			}catch(e){ _logError(e); }
 			return false;
 		}; // end save

 		/**
 		 * Delete
 		 * Delete the value of the given key from storage.
 		 * @param	key 	string
 		 */
 		this.del = function del(key){
 			try{
 				if(angular.isUndefined(key) || !angular.isString(key))
 					throw "Key is undefined.";
 				
 				_storage.removeItem(key);
 				return true;
 			}catch(e){ _logError(e); }
 			return false;
 		}; // end del

 		/**
 		 * Key
 		 * Retrieve the key given by the index i.
 		 * @param	i 		int
 		 */
 		this.key = function key(i){
 			try{
 				if(angular.isUndefined(i) || !angular.isNumber(i))
 					throw "Index is undefined.";

 				i = parseInt(i);
 				return _storage.key(i);
 			}catch(e){ _logError(e); }
 			return undefined;
 		}; // end key

 		/**
 		 * Clear
 		 * Clean out the storage by deleting all key/value pairs.
 		 */
 		this.clear = function clear(){
 			try{
 				_storage.clear();
 				return true;
 			}catch(e){ _logError(e); }
 			return false;
 		}; // end clear

 		/**
 		 * Length
 		 * Returns the number of keys in storage.
 		 */
 		this.length = function length(){
 			try{
 				return _storage.length;
 			}catch(e){ _logError(e); }
 			return false;
 		}; // end length

 	}]) // end angledGenericStorageSrvc

	/**
	 * Storage Service
	 * Creates a generic storage object based on the type of storage requested.  
	 * Inject this service into your other services, controllers or directives.
	 */
 	.factory('angledStorageSrvc',['$window','$log','angledGenericStorageSrvc',function($window,$log,genericStorageSrvc){
 		// check to see what storage types or supported in the browser
 		var _local = angular.isDefined($window.localStorage);
 		var _session = angular.isDefined($window.sessionStorage);

 		return {
 			/**
 			 * Get Storage Type
 			 *
 			 * Returns a service based on the requested storage type, default is sessionStorage,
 			 * undefined on error.
 			 *
 			 * @param	type 	string
 			 */
 			get : function(type){
 				switch(type){
 					// local browser storage
 					case 'l':
 					case 'local':
 						if(_local)
 							if(genericStorageSrvc.setStorage($window.localStorage))
 								return genericStorageSrvc; // return instance of angledGenericStorageSrvc
 						else
 							$log.error('Local storage is not supported.');
 						
 						break;

 					// session browser storage
 					case 's':
 					case 'session':
 					default:
 						if(_session)
 							if(genericStorageSrvc.setStorage($window.sessionStorage))
 								return genericStorageSrvc; // return instance of angledGenericStorageSrvc
 						else
 							$log.error('Session storage is not supported');

 						break;
 				}
 				return undefined;
 			}, // end get

 			/**
 			 * Get Local
 			 *
 			 * Returns a service who's storage is the localStorage, or undefined
 			 */
 			getLocal : function(){
 				if(_local)
 					if(genericStorageSrvc.setStorage($window.localStorage))
 						return genericStorageSrvc; // return instance of angledGenericStorageSrvc
 				else
 					$log.error('Local storage is not supported.');

 				return undefined;
 			}, // end getLocal

 			/**
 			 * Get Session
 			 *
 			 * Returns a service who's storage is the sessionStorage, or undefined.
 			 */
 			getSession : function(){
 				if(_session)
 					if(genericStorageSrvc.setStorage($window.sessionStorage))
 						return genericStorageSrvc; // return instance of angledGenericStorageSrvc
 				else
 					$log.error('Session storage is not supported');

 				return undefined;
 			} // end getSession

 		}; // end return
 	}]); // end angledStorageSrvc