/**
 * Angled Caching Services
 *
 * Wrapper services for Angular's cache storage.
 *
 * @author: Michael E Conroy (michael.e.conroy@gmail.com)
 *		- http://codepen.io/m-e-conroy
 * @date: 20 Oct 2014
 *
 * @dependencies
 * 		- $log
 * 		- $cacheFactory
 */
angular.module('angled-storage.cache',[])

	/**
 	 * Data Store Service
 	 * Creates a cache using Angular's $cacheFactory.
 	 */
 	.service('angledDataStoreSrvc',['$cacheFactory','$log',function($cacheFactory,$log){
 		var _caches = {};

 		/**
 		 * Log Error
 		 * Logs errors to the browser console.
 		 * @param	e 		Exception Object
 		 */
 		var _logError = function _logError(e){
			$log.error(e.name + ' (' + e.fileName + ':' + e.lineNumber + ') : ' + e.message);
 		}; // end logError

 		/**
 		 * Get
 		 * Retrieve cache by given string
 		 * @param	id 	string
 		 * @param	limit	int	
 		 * @return 	mixed	cacheFactory object / undefined
 		 */
 		 this.get = function get(id,limit){
 		 	try{
 		 		if(angular.isUndefined(id) || !angular.isString(id))
 		 			throw "Cache identifier not defined.";

 		 		if(angular.isUndefined(_caches[id]))
 		 			_caches[id] = (angular.isDefined(limit) && angular.isNumber(limit)) ? $cacheFactory(id,{capacity : limit}) : $cacheFactory(id);

 		 		return _caches[id];
 		 	}catch(e){ _logError(e); }
 		 	return undefined;
 		 }; // end get

 	}]) // end angledDataStoreSrvc

 	/**
 	 * Config Data Store Service
 	 * Same as previous data store service but this enables usage of 
 	 * $cacheFactory as a provider in an application's config function.
 	 */
 	.provider('angledConfigDataStoreSrvc',[function(){
 		// providers cannot inject services, we need to grab them from angular
 		var _ng = angular.injector(['ng']);
 		var _cacheFactory = _ng.get('$cacheFactory');

 		// create a cache for our config datastore
 		var _data = _cacheFactory('config-datastore');

 		/**
 		 * Put
 		 * Save key value pairs as a provider service.
 		 * @param 	key 	string
 		 * @param 	val 	mixed
 		 */
 		this.put = function(key,val){
 			_data.put(key,val);
 		}; // end put

 		// return the cache when injected as a regular service
 		this.$get = [function(){
 			return _data;
 		}]; // end $get

 	}]); // end angledConfigDataStoreSrvc