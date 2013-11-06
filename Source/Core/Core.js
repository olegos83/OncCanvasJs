/**
 * @file WebbyJs core implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * WebbyJs namespace and core methods.
 * 
 * @namespace
 */
var WebbyJs = {
	/**
	 * WebbyJs short description.
	 * 
	 * @memberof WebbyJs
	 * @type {Object}
	 * 
	 * @private
	 */
	_about: {
		name: 'WebbyJs',
		version: '0.01 unstable',
		shortcut: '_w_',
		description: 'Multipurpose web frontend framework',
		author: 'OlegoS',
		license: 'MIT'
	},
	
	/**
	 * Show about info.
	 * 
	 * @method about
	 * @memberof WebbyJs
	 */
	about: function() {
		console.log(this._about);
	},
	
	/**
	 * All exportable to global scope WebbyJs members cached by name.
	 * 
	 * @memberof WebbyJs
	 * @type {Object}
	 * 
	 * @private
	 */
	_globals: {},
	
	/**
	 * Global ids cache.
	 * 
	 * @memberof WebbyJs
	 * @type {Object}
	 * 
	 * @private
	 */
	_idCache: {},
	
	/**
	 * Unique global numeric id.
	 * 
	 * @memberof WebbyJs
	 * @type {Number}
	 * 
	 * @private
	 */
	_uniqId: 0,
	
	/**
	 * Global unique id generator.
	 * 
	 * @method getUniqId
	 * @memberof WebbyJs
	 * 
	 * @returns {Number} global numeric id.
	 */
	getUniqId: function() {
		return this._uniqId++;
	},
	
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
	 * Throw an error exeption.
	 * 
	 * @method error
	 * @memberof WebbyJs
	 * 
	 * @param {String} msg - error message.
	 * @param {String} name - error name.
	 */
	error: function(msg, name) {
		var err = new Error(msg || 'Unknown error');
		err.name = name || 'WebbyJsError';
		throw err;
	},
	
	/**
	 * Log warning to console.
	 * 
	 * @method warning
	 * @memberof WebbyJs
	 * 
	 * @param {String} msg - warning message.
	 * @param {String} name - warning name.
	 */
	warning: function(msg, name) {
		if (!msg) msg = 'Unknown warning';
		if (!name) name = 'WebbyJsWarning';
		console.log(name  + ': ' + msg);
	},
	
	/**
	 * Get class name to check class for any instance.
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
	 * Invoke method in WebbyJs scope.
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
	 * Check name validity inside WebbyJs and throw error for invalid name.
	 * 
	 * @method validateName
	 * @memberof WebbyJs
	 * 
	 * @param {String} name - name to check.
	 */
	validateName: function(name) {
		if (name === '' || this.getClassName(name) !== 'String') this.error('Invalid name');
		if (this[name]) this.error('WebbyJs.' + name + " allready exists");
	},
	
	/**
	 * Define member of WebbyJs.
	 * 
	 * @method define
	 * @memberof WebbyJs
	 * 
	 * @param {String} name - member name.
	 * @param {Object} member - new member.
	 * @param {Object} options - define options, for example exportability to global scope.
	 * 
	 * @returns {Object} new defined member.
	 */
	define: function(name, member, options) {
		this.validateName(name);
		if (this.getClassName(options) !== 'Object') this.error('Define options must be passed as an object');
		
		if (options) {
			if (options.construct) {
				if (this.getClassName(member) !== 'Function') this.error('Class constructor must be a function');
				member._w_className = name;
				if (this.WObject) this.WObject.addStatic.call(member, this.WObject);
			}
			
			if (options.exportable !== false) this._globals[name] = member;
		} else {
			this._globals[name] = member;
		}
		
		this[name] = window['_w_' + name] = member;
		return member;
	},
	
	/**
	 * Import many member definitions to WebbyJs. They must be passed as { name: member, ... , name: member }
	 * 
	 * @method import
	 * @memberof WebbyJs
	 * 
	 * @param {Object} members - members object reference.
	 * @param {Object} options - define options, for example exportability to global scope.
	 */
	import: function(members, options) {
		if (this.getClassName(members) !== 'Object') this.error('Importing members must be passed as an object');
		for (var name in members) if (members.hasOwnProperty(name)) this.define(name, members[name], options);
	},
	
	/**
	 * Extract WebbyJs members to global scope.
	 * 
	 * @method exportToGlobalScope
	 * @memberof WebbyJs
	 * 
	 * @param {String} name - member name. If ommited - all members are extracted.
	 * @param {Object} global - global object, window by default.
	 */
	exportToGlobalScope: function(name, global) {
		if (!global) global = window;
		
		var exportable = this._globals;
		
		if (name) {
			if (!exportable[name]) this.error(name + " does not exist or can not be exported to global scope");
			if (global[name]) this.error(name + " allready exists in global scope");
			global[name] = this[name];
		} else {
			for (name in exportable) if (exportable.hasOwnProperty(name)) {
				if (global[name]) this.error(name + " allready exists in global scope");
				global[name] = this[name];
			}
		}
	},
	
	/**
	 * Initialize WebbyJs.
	 * 
	 * @method init
	 * @memberof WebbyJs
	 */
	init: function() {
		window._w_ = this;
	}
};

/**
 * Initialize WebbyJs core.
 */
WebbyJs.init();
