/**
 * @file WebbyJs core implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Name conflicts test.
 */
if (w) throw new Error("Failed to declare 'w' namespace");

/**
 * WebbyJs namespace declaration and core methods implementation.
 *
 * @namespace
 */
var w = {
	/**
	 * General info about WebbyJs.
	 *
	 * @memberof w
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
	 * Hash of core members, that can not be overriden.
	 *
	 * @memberof w
	 * @type {Object}
	 *
	 * @private
	 */
	_core: {},

	/**
	 * Hash of created classes.
	 *
	 * @memberof w
	 * @type {Object}
	 *
	 * @private
	 */
	_classes: {},

	/**
	 * User agent info.
	 *
	 * @memberof w
	 * @type {String}
	 */
	navigator: ( function() {
		var nav = navigator.userAgent.toLowerCase();

		if (nav.indexOf('firefox') != -1) return 'firefox';
		if (nav.indexOf('opera') != -1) return 'opera';
		if (nav.indexOf('chrome') != -1) return 'chrome';
		if (nav.indexOf('msie') != -1) return 'ie';

		return nav;
	}() ),

	/**
	 * Get uniq integer number.
	 *
	 * @method un
	 * @memberof w
	 *
	 * @returns {Number} uniq number.
	 */
	un: ( function() { var n = 0; return function() { return n++; }; }() ),

	/**
	 * Default WebbyJs log provider.
	 *
	 * @memberof w
	 * @type {Object}
	 */
	logProvider: {
		log: function(msg) { console.log(msg); },
		warn: function(msg, name) { console.log( (name || 'WebbyJsWarning') + ': ' + (msg || '...') ); },
		err: function(msg, name) { var err = new Error(msg || '...'); err.name = name || 'WebbyJsError'; throw err; }
	},

	/**
	 * Log message, using logProvider.
	 *
	 * @method log
	 * @memberof w
	 *
	 * @param {Object} msg - message.
	 */
	log: function(msg) {
		this.logProvider.log(msg);
	},

	/**
	 * Log WebbyJs warn.
	 *
	 * @method warn
	 * @memberof w
	 *
	 * @param {String} msg - warning message.
	 * @param {String} name - warning name.
	 */
	warn: function(msg, name) {
		this.logProvider.warn(msg, name);
	},

	/**
	 * Throw error exeption.
	 *
	 * @method err
	 * @memberof w
	 *
	 * @param {String} msg - error message.
	 * @param {String} name - error name.
	 */
	err: function(msg, name) {
		this.logProvider.err(msg, name);
	},

	/**
	 * Invoke method with execution context set to WebbyJs core.
	 *
	 * @method invoke
	 * @memberof w
	 *
	 * @param {Function} method - method to invoke.
	 * @param {*} ... - method arguments.
	 */
	invoke: function(method) {
        Array.prototype.shift.call(arguments).apply(this, arguments);
	},

	/**
	 * Check if object is primitive.
	 *
	 * @method primitive
	 * @memberof w
	 *
	 * @param {Object} obj - object reference.
	 *
	 * @returns {Boolean} true if object is primitive or false otherwise.
	 */
	primitive: function(obj) {
		if (obj == null) return true;

		var t = typeof obj;
		if (t == 'number' || t == 'string' || t == 'boolean') return true;

		return false;
	},

	/**
	 * Get class name of any instance.
	 *
	 * @method typeOf
	 * @memberof w
	 *
	 * @param {Object} obj - object reference.
	 *
	 * @returns {String} objects class name or '' for undefined or null.
	 */
	typeOf: function(obj) {
		return (obj == null ? '' : obj.classname || obj.constructor.name);
	},

	/**
	 * Copy members from source object to destination object by reference.
	 *
	 * @method copy
	 * @memberof w
	 *
	 * @param {Object} src - source object reference.
	 * @param {Object} dst - destination object reference.
	 */
	copy: function(src, dst) {
		if (this.typeOf(src) == 'Array') {
			for (var i = 0, l = src.length; i < l; i++) dst[i] = src[i];
		}
		else {
			for (var m in src) if (src.hasOwnProperty(m)) dst[m] = src[m];
		}
	},

	/**
	 * Clone source object recursively, cloning none-primitives.
	 *
	 * @method clone
	 * @memberof w
	 *
	 * @param {Object} src - source object reference.
	 *
	 * @returns {Object} cloned object reference.
	 */
	clone: function(src) {
		if (this.primitive(src)) return src;

		if (this.typeOf(src) == 'Array') {
			for (var arr = [], l = src.length, i = 0; i < l; i++) arr[i] = this.clone(src[i]);
			return arr;
		}

		var dst = new src.constructor();

		for (var m in src) if (src.hasOwnProperty(m)) dst[m] = this.clone(src[m]);
		return dst;
	},

	/**
	 * Delete all members from target object.
	 *
	 * @method empty
	 * @memberof w
	 *
	 * @param {Object} target - target object reference.
	 */
	empty: function(target) {
		for (var m in target) if (target.hasOwnProperty(m)) delete target[m];
	},

	/**
	 * Inherit cild class from base class using prototype inheritance.
	 *
	 * @method inherit
	 * @memberof w
	 *
	 * @param {Function} child - child class reference.
	 * @param {Function} base - base class reference.
	 */
	inherit: function(child, base) {
		if (this.typeOf(child) != 'Function') this.err('Invalid child class');
		if (this.typeOf(base) != 'Function') this.err('Invalid base class');

		child.prototype = new base();
		this.empty(child.prototype);

		child.prototype.constructor = child;
		child.prototype.superclass = base.prototype;
	},

	/**
	 * Implement interfaces inside target class prototype.
	 *
	 * @method implement
	 * @memberof w
	 *
	 * @param {Function} target - target class reference.
	 * @param {Object|Function|Array} ... - one or more interfaces.
	 */
	implement: function(target) {
		if (this.typeOf(target) != 'Function') this.err('Invalid implementation target');

		var proto = target.prototype, classname = proto.classname,
			construct = proto.constructor, superclass = proto.superclass;

		for (var i = 1, l = arguments.length; i < l; i++) {
			var t = this.typeOf(arguments[i]);

			if (t == 'Function') this.copy(arguments[i].prototype, proto);
			else if (t == 'Object') this.copy(arguments[i], proto);
			else if (t == 'Array') this.implement.call(this, target, arguments[i]);
		}

		proto.classname = classname;
		proto.constructor = construct;
		proto.superclass = superclass;
	},

	/**
	 * Define members inside WebbyJs.
	 *
	 * @method define
	 * @memberof w
	 *
	 * @param {String|Object} m - member name or multiply members hash.
	 * @param {*|Boolean} v - reference to single member or 'c' argument.
	 * @param {Boolean} c - class definition flag.
	 */
	define: function(m, v, c) {
		var t = this.typeOf(m);

		if (t == 'Object') {
			for (var p in m) {
				if (this._core[p]) this.err('Failed to override core member: ' + p);
				if (v) this._classes[p] = m[p];
				this[p] = m[p];
			}
		} else if (t == 'String') {
			if (this._core[m]) this.err('Failed to override core member: ' + m);
			if (c) this._classes[m] = v;
			this[m] = v;
		}
		else this.err('Failed to define members');
	},

	/**
	 * Create new class inside WebbyJs.
	 *
	 * @method create
	 * @memberof w
	 *
	 * @param {Object} opt - creation options.
	 *
	 * options = {
	 * 	  construct: function ClassName(args) { ... },
	 *    base: baseClassReference,
	 *    statics: { static members },
	 *    implements: interface || [interfaces],
	 * 	  proto: { prototype members },
	 * };
	 */
	create: function(opt) {
		if (this.typeOf(opt) != 'Object') this.err('Invalid class options');

		var construct = opt.construct, base = opt.base || this.WObject, name = construct.name;

		if (base instanceof this.WObject) {
			if (this.typeOf(construct) != 'Function') this.err('Invalid constructor');
			if (name == '' || this.typeOf(name) != 'String') this.err('Invalid class name');

			this.define(name, construct, true);
			construct.prototype.classname = name;

			construct.create = this.WObject.create;
			if (this.typeOf(opt.statics) == 'Object') this.copy(opt.statics, construct);

			this.inherit(construct, base);
			this.implement(construct, opt.implements, opt.proto);
		}
		else this.err('Base class is not WebbyJs compatible');
	}
};
