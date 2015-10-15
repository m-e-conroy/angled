/**
 * Angled Helper : Random String Generation
 *
 * Generates random strings of variable length.
 *
 * @author: Michael E Conroy (michael.e.conroy@gmail.com)
 * 		- http://codepen.io/m-e-conroy
 * @date: 27 Mar 2014
 */
angular.module('angled-helper.randStr',[])

	.service('angledRandStrSrvc',[function(){

		// default options
		var _defaults = {
			length : 10
		}; // end _defaults

		// character set
		var _chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
 		var _numbers = ['0','1','2','3','4','5','6','7','8','9'];

		/**
		 * Get
		 * Retrieve a random string
		 * @param 	length 		int
		 * @param	alphanumeric	mixed (boolean,(yes/no))
		 */
		this.get = function get(length,alphanumeric){
			length = (parseInt(length) < 10) ? _defaults.length : parseInt(length);
			alphanumeric = (angular.isDefined(alphanumeric) && ((alphanumeric == 0) || (alphanumeric == 'false') || (alphanumeric == 'no') || (alphanumeric == false))) ? false : true;

			var _random = '';
			var _glyphs = [];

			if(alphanumeric)
				_glyphs = _chars.concat(_numbers);
			else
				_glyphs = _chars;

			var _gLength = _glyphs.length;
			for(var i = 0; i < length; i++)
				_random += _glyphs[Math.floor(Math.random() * _gLength)];

			return _random;
		}; // end get

	}]); // end angledRandStrSrvc