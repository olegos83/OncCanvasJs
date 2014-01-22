/**
 * @file WebbyJs core implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Name conflicts test.
 */
if (WebbyJs || w) throw new Error('Failed to declare WebbyJs namespace');

/**
 * WebbyJs namespace declaration and core methods implementation.
 *
 * @namespace
 */
var WebbyJs = {
	/**
	 * General info about WebbyJs.
	 *
	 * @memberof WebbyJs
	 * @type {Object}
	 */
	about: {
		name: 'WebbyJs',
		description: 'Web lib for fun and experiments',
		author: 'OlegoS',
		version: '0.01',
		license: 'MIT'
	},

	/**
	 * Core members hash, that can not be overriden.
	 *
	 * @memberof WebbyJs
	 * @type {Object}
	 *
	 * @private
	 */
	_core: {},

	/**
	 * Init WebbyJs core.
	 *
	 * @method init
	 * @memberof WebbyJs
	 *
	 * @returns {Object} this instance.
	 */
	init: function() {
		for (var member in this) this._core[member] = this.member;
		return this;
	},

	/**
	 * Define members inside WebbyJs.
	 *
	 * @method define
	 * @memberof WebbyJs
	 *
	 * @param {Object} members - members hash.
	 *
	 * @returns {Object} this instance.
	 */
	define: function(members) {
		if (typeof members != 'object' || members == null) throw new Error('Failed to define members');

		for (var name in members) {
			if (this._core[name]) throw new Error('Failed to override core member: ' + name);
			this[name] = members[name];
		}

		return this;
	},

	/**
	 * Create new class inside WebbyJs.
	 *
	 * @method create
	 * @memberof WebbyJs
	 *
	 * @param {Object} options - new class options.
	 *
	 * optionsExample = {
	 * 	  construct: function ClassName(args) { ... },
	 *    statics: { static members },
	 *    extends: baseClassReference,
	 *    implements: [interfaceRferencesArr] || interfaceReference,
	 * 	  proto: { prototype members },
	 * };
	 *
	 * @returns {Object} created class.
	 */
	create: function(options) {
		var construct = options.construct, name = construct.name;

		if (typeof construct != 'function') throw new Error('Invalid constructor');
		if (typeof name != 'string' || name == '') throw new Error('Invalid class name');

		var extends = options.extends || this.WObject, newClass = {};
		newClass[name] = construct;

		this.define(newClass);
		this.WObject.statics.call(construct, this.WObject);

		return construct.statics(options.statics).extend(extends).implement([options.implements, options.proto]);
	}
};

/**
 * Init WebbyJs core and shortcut.
 */
var w = WebbyJs.init();

//old core declaration
var WebbyJsOld = {
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

		if (this.logProvider.native) throw err;
		this.log(err.name + ': ' + err.message);
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
	uniqNumber: ( function() {
		var n = 0;
		return function() { return n++; };
	}() ),

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
		return obj.constructor.name || obj.constructor.wclass;
	},
};
