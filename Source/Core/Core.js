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
	 * Core members, that can not be overriden.
	 *
	 * @memberof w
	 * @type {Object}
	 *
	 * @private
	 */
	_core: {},

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
	 * @method uniqNumber
	 * @memberof w
	 *
	 * @returns {Number} uniq number.
	 */
	uniqNumber: ( function() {
		var n = 0;
		return function() { return n++; };
	}() ),

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
	 * Invoke method in WebbyJs scope.
	 *
	 * @method invoke
	 * @memberof w
	 *
	 * @param {Function} method - method to invoke.
	 * @param {Array} args - method arguments.
	 */
	invoke: function(method, args) {
		method.apply(this, args);
	},

	/**
	 * Get class name of any instance.
	 *
	 * @method typeOf
	 * @memberof w
	 *
	 * @param {Object} obj - object.
	 *
	 * @returns {String} objects class name or '' for undefined or null.
	 */
	typeOf: function(obj) {
		return (obj == null ? '' : obj.constructor.name);
	},

	/**
	 * Define members inside WebbyJs.
	 *
	 * @method define
	 * @memberof w
	 *
	 * @param {Object} members - members hash.
	 */
	define: function(members) {
		if (this.typeOf(members) != 'Object') this.err('Failed to define members');

		for (var name in members) {
			if (this._core[name]) this.err('Failed to override core member: ' + name);
			this[name] = members[name];
		}
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
	 *    implements: interfaceReference,
	 * 	  proto: { prototype members },
	 * };
	 *
	 * @returns {W} created class.
	 */
	create: function(opt) {
		if (this.typeOf(opt) != 'Object') this.err('Invalid class options');
		if (this.typeOf(opt.construct) != 'Function') this.err('Invalid constructor');

		var name = opt.construct.name;
		if (name == '' || this.typeOf(name) != 'String') this.err('Invalid class name');

		var def = {}, created = def[name] = opt.construct, statics = opt.statics;
		this.define(def);

		if (!statics) statics = { create: this.W.create };
		else if (!statics.create) statics.create = this.W.create;

		statics.statics = this.W.statics;
		statics.extend = this.W.extend;
		statics.implement = this.W.implement;

		this.W.statics.call(created, statics);
		return created.extend(opt.base).implement(opt.implements, opt.proto);
	}
};

/**
 * Base class for all WebbyJs created classes.
 *
 * @class W
 * @memberof w
 */
w.define({
	/**
	 * @constructor
	 */
	W: function W() {}
});

/**
 * Append static members to this class.
 *
 * @method statics
 * @memberof W
 *
 * @param {Object} statics - object with static members.
 *
 * @returns {W} current instance for chaining.
 */
w.W.statics = function(statics) {
	if (statics) {
		for (var p in statics) if (statics.hasOwnProperty(p)) this[p] = statics[p];
	}

	return this;
};

/**
 * Add W static members.
 */
w.W.statics({
	/**
	 * Create instance of this class.
	 *
	 * @method create
	 * @memberof W
	 *
	 * @returns {W} created instance.
	 */
	create: function() {
		return new this();
	},

	/**
	 * Extend this class from base class using prototype inheritance.
	 *
	 * @method extendClass
	 * @memberof W
	 *
	 * @param {Object|W} base - base class reference.
	 *
	 * @returns {W} current instance for chaining.
	 */
	extend: function(base) {
		if (base) {
			if (w.typeOf(base) != 'Function') w.err('Invalid base class');

			var proto = this.prototype = new base();

			for (var p in proto) if (proto.hasOwnProperty(p)) delete proto[p];
			proto.constructor = this;
		}

		return this;
	},

	/**
	 * Extend this class prototype with methods from interfaces.
	 *
	 * @method implement
	 * @memberof W
	 *
	 * @param {Object|Array} ifaces - interfaces.
	 *
	 * @returns {W} current instance for chaining.
	 */
	implement: function(ifaces) {
		for (var i = 0, l = arguments.length; i < l; i++) {
			var o = arguments[i], t = w.typeOf(o);

			if (t == 'Object') {
				for (var p in o) if (o.hasOwnProperty(p)) this.prototype[p] = o[p];
			} else if (t == 'Function') {
				this.implement(o.prototype);
			} else if (t == 'Array') {
				this.implement.apply(this, o);
			}
		}

		return this;
	}

/**
 * Implement W prototype.
 */
}).implement({
	/**
	 * Set properties in current instance.
	 *
	 * @method set
	 * @memberof W.prototype
	 *
	 * @param {W} src - source object.
	 *
	 * @returns {W} current instance for chaining.
	 */
	set: function(src) {
		for (var p in src) if (this.hasOwnProperty(p)) this[p] = src[p];
		return this;
	},

	/**
	 * Check if this object is equal to source object by class and properties.
	 *
	 * @method isEqual
	 * @memberof W.prototype
	 *
	 * @param {W} src - source object.
	 *
	 * @returns {Boolean} true if this is equal to source or false otherwise.
	 */
	isEqual: function(src) {
		if (this.constructor != src.constructor) return false;

		for (var p in this) {
			if (this.hasOwnProperty(p) && src.hasOwnProperty(p)) {
				if (this[p] != src[p]) return false;
			} else return false;
		}

		return true;
	},

	/**
	 * Reset all properties. It resets:
	 *
	 * 'Number' to 0,
	 * 'String' to '',
	 *
	 * 'Object' to {},
	 * 'Array' to [],
	 *
	 * 'W' calls W.reset() and 'Function', 'null' and 'undefined' are skipped.
	 *
	 * @method reset
	 * @memberof W.prototype
	 *
	 * @returns {W} current instance for chaining.
	 */
	reset: function() {
		for (var p in this) if (this.hasOwnProperty(p)) {
			var v = this[p];

			if (v) {
				var t = w.typeOf(v);
				if (t == 'Function') continue;

				if (v.reset) v.reset();

				else if (t == 'Number') this[p] = 0;
				else if (t == 'String') this[p] = '';

				else if (t == 'Object') this[p] = {};
				else if (t == 'Array') this[p] = [];
			}
		}

		return this;
	},

	/**
	 * Free objects resources from memory.
	 *
	 * @method free
	 * @memberof W.prototype
	 *
	 * @returns {W} current instance for chaining.
	 */
	free: function() {
		for (var p in this) if (this.hasOwnProperty(p)) this[p] = null;
		return this;
	},

	/**
	 * Default toString method.
	 *
	 * @method toString
	 * @memberof W.prototype
	 *
	 * @returns {String} current instance as string.
	 */
	toString: function() {
		return '[' + this.constructor.name + ']';
	},

	/**
	 * Get current instance as Object.
	 *
	 * @method toObject
	 * @memberof W.prototype
	 *
	 * @returns {Object} current instance as object.
	 */
	toObject: function() {
		var obj = {};
		for (var p in this) if (this.hasOwnProperty(p)) obj[p] = this[p];
		return obj;
	},

	/**
	 * Get/Set current instance in XML format.
	 *
	 * @method xml
	 * @memberof W.prototype
	 *
	 * @param {String} data - XML source string.
	 *
	 * @returns {W|String} XML string or current instance for chaining.
	 */
	xml: function(data) {
		if (data) {
			return this;
		}

		for (var p in this) if (this.hasOwnProperty(p)) {

		}
	},

	/**
	 * Get/Set current instance in JSON format.
	 *
	 * @method json
	 * @memberof W.prototype
	 *
	 * @param {String} data - JSON source string.
	 *
	 * @returns {W|String} JSON string or current instance for chaining.
	 */
	json: function(data) {
		if (data) {
			return this;
		}

		for (var p in this) if (this.hasOwnProperty(p)) {

		}
	},

	/**
	 * Dump current instance to log.
	 *
	 * @method dump
	 * @memberof W.prototype
	 *
	 * @returns {W} current instance for chaining.
	 */
	dump: function() {
		w.log(this.toString());

		for (var p in this) {
			w.log(p + ":" + w.typeOf(this[p]) + " = " + this[p]);
		}

		return this;
	},

	/**
	 * Clone current instance.
	 *
	 * @method clone
	 * @memberof W.prototype
	 *
	 * @returns {W} cloned instance.
	 */
	clone: function() {
		var cloned = new this.constructor();

		for (var p in this) if (this.hasOwnProperty(p)) {
			var o = this[p];

			if (o.clone) cloned[p] = o.clone(); else {
				cloned[p] = (typeof o == 'object' ? this.clone.call(o) : o);
			}
		}

		return cloned;
	},

	/**
	 * Invoke method with 'this' reference to current instance.
	 *
	 * @method invoke
	 * @memberof W.prototype
	 *
	 * @param {Function} method - method to invoke.
	 * @param {Array} args - method arguments.
	 *
	 * @returns {W} current instance for chaining.
	 */
	invoke: function(method, args) {
		method.apply(this, args);
		return this;
	}
});

/**
 * Init WebbyJs core.
 */
w.invoke(function() {
	for (var member in this) this._core[member] = this[member];
});
