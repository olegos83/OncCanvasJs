/**
 * @file WebbyJs core implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Name conflicts test.
 */
if (window.WebbyJs || window.webbyjs || window._w_) throw new Error('WebbyJs initialization failed - name conflict');

/**
 * WebbyJs namespace declaration and basic methods implementation.
 * 
 * @namespace
 */
var WebbyJs = window.webbyjs = window._w_ = {
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
	 * WebbyJs members, exportable to global scope, stored by name.
	 * 
	 * @memberof WebbyJs
	 * @type {Object}
	 * 
	 * @private
	 */
	_exportable: {},
	
	/**
	 * Unique number.
	 * 
	 * @memberof WebbyJs
	 * @type {Number}
	 * 
	 * @private
	 */
	_un: 0,
	
	/**
	 * Browser short name.
	 * 
	 * @memberof WebbyJs
	 * @type {String}
	 */
	BROWSER: ( function() {
		var nav = navigator.userAgent.toLowerCase();
		
		if (nav.indexOf('firefox') != -1) return 'firefox';
		if (nav.indexOf('opera') != -1) return 'opera';
		
		if (nav.indexOf('chrome') != -1) return 'chrome';
		if (nav.indexOf('msie') != -1) return 'ie';
		
		return nav;
	}() ),
	
	/**
	 * User defined log provider for WebbyJs messages.
	 * It must be an object with 'log' method.
	 * 
	 * @memberof WebbyJs
	 * @type {Object}
	 */
	logProvider: { native: true, log: function(msg) { console.log(msg); } },
	
	/**
	 * Log message, using logProvider.
	 * 
	 * @method log
	 * @memberof WebbyJs
	 * 
	 * @param {Object} msg - message.
	 */
	log: function(msg) {
		this.logProvider.log(msg);
	},
	
	/**
	 * Throw an error exeption and log it, but only to custom logProvider.
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
		
		if (!this.logProvider.native) this.log(err.name + ': ' + err.message);
		throw err;
	},
	
	/**
	 * Log WebbyJs warning.
	 * 
	 * @method warning
	 * @memberof WebbyJs
	 * 
	 * @param {String} msg - warning message.
	 * @param {String} name - warning name.
	 */
	warning: function(msg, name) {
		this.log( (name || 'WebbyJsWarning') + ': ' + (msg || 'Unknown warning') );
	},
	
	/**
	 * Show about info.
	 * 
	 * @method about
	 * @memberof WebbyJs
	 */
	about: function() {
		this.log(this._about);
	},
	
	/**
	 * Get uniq integer number.
	 * 
	 * @method uniqNumber
	 * @memberof WebbyJs
	 * 
	 * @returns {Number} uniq number.
	 */
	uniqNumber: function() {
		return this._un++;
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
	 * Get class name for any instance.
	 * 
	 * @method classOf
	 * @memberof WebbyJs
	 * 
	 * @param {Object} obj - object.
	 * 
	 * @returns {String} objects class name or '' for undefined or null obj.
	 */
	classOf: function(obj) {
		if (obj === null || typeof obj === 'undefined') return '';
		return obj.constructor.name || obj.constructor._w_class;
	},
	
	/**
	 * WebbyJs name and class validation. Throws an error for invalid result.
	 * If 'allowed' argument present - it is a class validation, if not - name conflict test.
	 * 
	 * @method validate
	 * @memberof WebbyJs
	 * 
	 * @param {String|Object} v - name to check or instance to validate class.
	 * @param {String} allowed - allowed classes, for example 'Function, Object, String'.
	 * 
	 * @returns {String} validated name or class name.
	 */
	validate: function(v, allowed) {
		//class validation
		if (allowed) {
			v = this.getClassName(v) || 'null';
			if (allowed.indexOf(v) == -1) this.error('Invalid argument type, ' + v);
			
		//name validation
		} else {
			if (v === '' || this.classOf(v) !== 'String') this.error('Impossible to create WebbyJs.' + v);
			if (this[v]) this.error('WebbyJs.' + v + ' allready exists');
		}
		
		return v;
	},
	
	/**
	 * Define member of WebbyJs. Each member is also cached globaly with
	 * '_w_' prefix to speed up class instantiating inside another lib class.
	 * 
	 * @method define
	 * @memberof WebbyJs
	 * 
	 * @param {String} name - member name.
	 * @param {Object} member - new member.
	 * @param {Object} options - define options.
	 * 
	 * @returns {Object} new defined member.
	 */
	define: function(name, member, options) {
		this.validateName(name);
		
		if (options) {
			this.validateClass(options, 'Object');
			
			if (options.construct) {
				this.validateClass(member, 'Function');
				
				if (this.WObject) this.WObject.statics.call(member, this.WObject);
				member._w_class = name;
			}
			
			if (options.noExport) this._exportable[name] = member;
		} else {
			this._exportable[name] = member;
		}
		
		this[name] = window['_w_' + name] = member;
		return member;
	},
	
	/**
	 * Define new WebbyJs class.
	 * 
	 * @method Class
	 * @memberof WebbyJs
	 * 
	 * @param {Object} options - class definition options.
	 * 
	 * var optionsExample = {
	 *    name: 'ClassName',
	 *    extend: parentClassReference,
	 * 	  construct: function ClassName(args) { ... },
	 * 	  proto: { prototype },
	 * 	  implement: [interfaceRferencesArr] || interfaceReference,
	 * 	  statics: { static members }
	 * };
	 * 
	 * @returns {WObject} new defined class.
	 */
	Class: function(options) {
		this.validateClass(options, 'Object');
		
		return this.define(options.name, options.construct, { construct: true }).
					statics(options.statics).
					extend(options.extend || this.WObject).
					implement(options.implement).
					implement(options.proto);
	},
	
	/**
	 * Export WebbyJs members to global object - 'window' in browser.
	 * 
	 * @method export
	 * @memberof WebbyJs
	 * 
	 * @param {String} name - member name. If ommited - all members are extracted.
	 */
	export: function(name) {
		var exportable = this._exportable;
		
		if (name) {
			if (!exportable[name]) this.error(name + " does not exist or can not be exported to global scope");
			if (window[name]) this.error(name + " allready exists in global scope");
			window[name] = this[name];
		} else {
			for (name in exportable) if (exportable.hasOwnProperty(name)) {
				if (window[name]) this.error(name + " allready exists in global scope");
				window[name] = this[name];
			}
		}
	}
};
