angular.module('storageTest',['angled-storage.services','angled-helper.services'])

	.controller('storageTestCtrl',['$scope','$log','angledStorageSrv','angledHelperSrv',function($scope,$log,storageSrv,helperSrv){

		//== Variables ==//

		//.. private ..//

		var _storage = storageSrv.getSession();

		//.. scope ..//

		$scope.code = '';
		$scope.keys = [];
		$scope.form = {
			key : null
		};
		$scope.stored = {
			key : '',
			val : ''
		};


		//== Methods ==//

		$scope.generateCode = function(){
			$scope.form.key = null;
			$scope.code = helperSrv.randStr(20,true);
		}; // end generateCode

		$scope.clearCode = function(){
			$scope.code = '';
			$scope.form.key = null;
		}; // end clearCode

		$scope.haveCode = function(){
			return !(angular.equals($scope.code,'') || angular.equals($scope.code,null));
		}; // end haveCode

		$scope.haveKeys = function(){
			return !(angular.equals($scope.keys,'') || angular.equals($scope.keys,null) || ($scope.keys.length <= 0));
		}; // end haveKeys

		$scope.saveCode = function(){
			if((angular.isDefined($scope.code) && angular.isString($scope.code)) && angular.isDefined($scope.form.key) && !angular.equals($scope.form.key,null)){
				if($scope.keys.indexOf($scope.form.key) == -1)
					$scope.keys.push($scope.form.key);
				_storage.save($scope.form.key,$scope.code);
			}else{
				$log.error('Unable to save code (' + $scope.form.key + ',' + $scope.code + ').');
			}
		}; // end saveCode

		$scope.getSavedValue = function(key){
			if(angular.isDefined(key) && angular.isString(key)){
				$scope.stored.key = key;
				$scope.stored.val = _storage.get(key);
			}else{
				$log.error('Unable to retrieve value for key.');
			}
		}; // end getSavedValue

		$scope.clean = function(){
			_storage.clear();
			$scope.keys = []
			$scope.code = '';
			$scope.form.key = null;
			$scope.stored.key = '';
			$scope.stored.val = '';
		}; // end clean

	}]); // end storageTestCtrl / storageTest