/*
 * DB by OlegoS, 26 Jun 2013
 *
 * Database and php scripts manager.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	
	
//STATIC
	/**
	 * DB class can call server php script.
	 * It has default handlers for data workout - they simply log data to console.
	 * 
	 * @class DB
	 * @author OlegoS
	 *
	 * @static
	 **/
	var DB = {
		/**
	     * Server host name.
	     * 
	     * @property host
	     * @type String
	     **/
		host: 'http://33rv.com/',
		
		/**
		 * Call external php script.
		 * 
		 * @method callScript
		 * @param {String} path - path to script(relative to host).
		 * @param {Object} params - script call params.
		 * @param {Function} success - success handler.
		 * @param {Function} error - error handler.
		 **/
		callScript: function(path, params, success, error) {
			//set defaults
			if (!success) success = function(data) { console.log(data); }
			if (!error) error = function(jqXHR, textStatus, errorThrown) { console.log(jqXHR, textStatus, errorThrown); }
			
			//perform query
			$.ajax({ type: "POST", url: DB.host + path, data: params, success: success, error: error });
		}
	};
	
	
//PROTOTYPE
	//set up for global use
	window.DB = DB;
}() );
