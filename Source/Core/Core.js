/**
 * @file WebbyJs core implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * WebbyJs base namespace and core methods.
 * 
 * @namespace
 */
var WebbyJs = {
	/**
	 * All WebbyJs members, which can be globalized.
	 * 
	 * @memberof WebbyJs
	 * @type {Array}
	 * 
	 * @private
	 */
	_globals: [],
	
	/**
	 * Browser information.
	 * 
	 * @memberof WebbyJs
	 * @type {String}
	 * 
	 * @returns {String} vendor of currently used browser.
	 */
	BROWSER: ( function() {
		var nav = navigator.userAgent.toLowerCase();
		
		if (nav.indexOf('firefox') != -1) return 'firefox';
		if (nav.indexOf('opera') != -1) return 'opera';
		
		if (nav.indexOf('chrome') != -1) return 'chrome';
		if (nav.indexOf('msie') != -1) return 'ie';
	}() ),
	
	/**
	 * Invoke method with 'this' reference to WebbyJs.
	 * 
	 * @method invoke
	 * @memberof WebbyJs
	 * 
	 * @param {Function} method - method to invoke.
	 * @param {Array} args - method arguments.
	 */
	invoke: function(method, args) {
		method.apply(this, args);
	},
	
	/**
	 * Throw an error exeption.
	 * 
	 * @method throwError
	 * @memberof WebbyJs
	 * 
	 * @param {String} msg - error message.
	 * @param {String} name - error name.
	 */
	throwError: function(msg, name) {
		var err = new Error(msg || 'Something is going wrong');
		err.name = name || 'WebbyJsError';
		throw err;
	},
	
	/**
	 * Get class name. Use to check class for any instance.
	 * 
	 * @method getClassName
	 * @memberof WebbyJs
	 * 
	 * @param {Object} obj - object.
	 * 
	 * @returns {String} objects class name or '' for undefined or null obj.
	 */
	getClassName: function(obj) {
		if (obj === null || typeof obj === 'undefined') return '';
		return obj.constructor.name || obj.constructor._w_className;
	},
	
	/**
	 * Check name validity inside WebbyJs and throw error for invalid name.
	 * 
	 * @method checkNameValidity
	 * @memberof WebbyJs
	 * 
	 * @param {String} name - name to check.
	 */
	checkNameValidity: function(name) {
		if (name === '' || this.getClassName(name) !== 'String') this.throwError('Invalid name');
		if (this.getClassName(this[name])) this.throwError(name + " allready exists");
	},
	
	/**
	 * Import members to WebbyJs. Imported members can be globalized later.
	 * 
	 * @method import
	 * @memberof WebbyJs
	 * 
	 * @param {Object} members - members object reference.
	 * @param {Boolean} noGlobal - if true, globalization is canceled for current import.
	 */
	import: function(members, noGlobal) {
		if (this.getClassName(members) !== 'Object') this.throwError('Members must be passed as an object');
		
		for (var m in members) {
			this.checkNameValidity(m);
			this[m] = members[m];
			
			if (!noGlobal) this._globals.push(m);
		}
	},
	
	/**
	 * Extract all added stuff to global scope.
	 * 
	 * @method globalize
	 * @memberof WebbyJs
	 * 
	 * @param {Object} globe - global object, window by default.
	 */
	globalize: function(globe) {
		var global = globe || window, l = this._globals.length;
		
		for (var i = 0, name; i < l; i++) {
			name = this._globals[i];
			global[name] = this[name];
		}
	}
};
