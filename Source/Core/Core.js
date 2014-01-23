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
	 */
	init: function() {
		for (var member in this) this._core[member] = this.member;
	},

	/**
	 * User agent info.
	 *
	 * @memberof WebbyJs
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
	 * @memberof WebbyJs
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
	 * @memberof WebbyJs
	 * @type {Object}
	 */
	logProvider: {
		log: function(msg) { console.log(msg); },
		warning: function(msg, name) { console.log( (name || 'WebbyJsWarning') + ': ' + (msg || '...') ); },
		error: function(msg, name) { var err = new Error(msg || '...'); err.name = name || 'WebbyJsError'; throw err; }
	},

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
	 * Log WebbyJs warning.
	 *
	 * @method warning
	 * @memberof WebbyJs
	 *
	 * @param {String} msg - warning message.
	 * @param {String} name - warning name.
	 */
	warning: function(msg, name) {
		this.logProvider.warning(msg, name);
	},

	/**
	 * Throw error exeption.
	 *
	 * @method error
	 * @memberof WebbyJs
	 *
	 * @param {String} msg - error message.
	 * @param {String} name - error name.
	 */
	error: function(msg, name) {
		this.logProvider.error(msg, name);
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
	 * Get class name of any instance.
	 *
	 * @method typeOf
	 * @memberof WebbyJs
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
	 * @memberof WebbyJs
	 *
	 * @param {Object} members - members hash.
	 */
	define: function(members) {
		if (this.typeOf(members) != 'Object') this.error('Failed to define members');

		for (var name in members) {
			if (this._core[name]) this.error('Failed to override core member: ' + name);
			this[name] = members[name];
		}
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
	 *    base: baseClassReference,
	 *    statics: { static members },
	 *    implements: [interfaceRferencesArr] || interfaceReference,
	 * 	  proto: { prototype members },
	 * };
	 *
	 * @returns {Object} created class.
	 */
	create: function(options) {
		var construct = options.construct, name = construct.name, base = options.base || this.W;

		if (this.typeOf(construct) != 'Function') this.error('Invalid constructor');
		if (this.typeOf(name) != 'String' || name == '') this.error('Invalid class name');
		//if (typeof base != 'function' || base.extend == null) throw new Error('Failed to extend class');

		var created = base.extend(construct), def = {};

		def[name] = created;
		this.define(def);

		return created.statics(options.statics).extend(extends).implement([options.implements, options.proto]);
	}
};

/**
 * Base class for all WebbyJs created classes.
 *
 * @class W
 * @memberof WebbyJs
 */
WebbyJs.define({
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
WebbyJs.W.statics = function(statics) {
	if (!statics) return this;
	for (var p in statics) if (statics.hasOwnProperty(p)) this[p] = statics[p];
	return this;
};

/**
 * Add W static members.
 */
WebbyJs.W.statics({
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
	 * @param {Object} base - base class reference.
	 *
	 * @returns {W} current instance for chaining.
	 */
	extend: function(base) {
		if (!base) return this;
		WebbyJs.validate(base, 'Function');

		var proto = this.prototype = new base();
		for (var p in proto) if (proto.hasOwnProperty(p)) delete proto[p];

		proto.constructor = this;
		this.wbase = base.prototype;

		return this;
	},

	/**
	 * Extend this class prototype with methods from interfaces.
	 *
	 * @method implement
	 * @memberof W
	 *
	 * @param {Object|Array} interfaces - single or array of interfaces.
	 *
	 * @returns {W} current instance for chaining.
	 */
	implement: function(interfaces) {
		if (!interfaces) return this;
		if (WebbyJs.classOf(interfaces) !== 'Array') interfaces = [interfaces];

		var proto = this.prototype, l = interfaces.length;

		for (var i = 0; i < l; i++) {
			var iface = interfaces[i];

			WebbyJs.validate(iface, 'Object, Function');
			if (WebbyJs.classOf(iface) === 'Function') iface = iface.prototype;

			for (var p in iface) if (iface.hasOwnProperty(p)) proto[p] = iface[p];
		}

		return this;
	}

/**
 * Implement W prototype.
 */
}).implement({
	/**
	 * Set this object properties equal to source object properties.
	 *
	 * All non-primitive properties remain shared by reference between
	 * this and source objects.
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
		if (this.constructor.wclass != src.constructor.wclass) return false;

		for (var p in this) {
			if (this.hasOwnProperty(p) && src.hasOwnProperty(p)) {
				if (this[p] != src[p]) return false;
			} else return false;
		}

		return true;
	},

	/**
	 * Reset all properties to their default values.
	 * This is basic reset implementation. It resets:
	 *
	 * 'Number' to 0,
	 * 'String' to '',
	 *
	 * 'Object' to {},
	 * 'Array' to [],
	 *
	 * 'Function' is skipped,
	 * 'W' calls W.reset(),
	 *
	 * 'null' and 'undefined' are skipped.
	 *
	 * @method reset
	 * @memberof W.prototype
	 *
	 * @returns {W} current instance for chaining.
	 */
	reset: function() {
		for (var p in this) if (this.hasOwnProperty(p)) {
			var v = this[p], t = WebbyJs.classOf(v);

			if (!t || t == 'Function') continue;

			if (v.reset) { v.reset(); continue; }

			if (t == 'Number') { this[p] = 0; continue; }
			if (t == 'String') { this[p] = ''; continue; }

			if (t == 'Object') { this[p] = {}; continue; }
			if (t == 'Array') { this[p] = []; continue; }
		}

		return this;
	},

	/**
	 * Force to free objects resources from memory.
	 *
	 * Be carefull with this method - it sets all properties
	 * to null, so object becomes unusable after this action.
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
	 * Get class name of current instance.
	 *
	 * @method className
	 * @memberof W.prototype
	 *
	 * @returns {String} class name of current instance.
	 */
	className: function() {
		return this.constructor.wclass;
	},

	/**
	 * Get prototype of current instance.
	 *
	 * @method proto
	 * @memberof W.prototype
	 *
	 * @returns {Object} prototype of current instance.
	 */
	proto: function() {
		return this.constructor.prototype;
	},

	/**
	 * Get base class of current instance.
	 *
	 * @method base
	 * @memberof W.prototype
	 *
	 * @returns {W} base class of current instance or undefined if no base class.
	 */
	base: function() {
		return this.constructor.wbase;
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
		return '[WebbyJs.' + this.constructor.wclass + ']';
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

		data = '{';

		var json = this.json, arrToJson = function(arr) {
			var tmp = '[';

			for (var i = 0, l = arr.length; i < l; i++) {
				var v = arr[i], t = WebbyJs.classOf(v);

				if (t == 'Function') continue;
				if (t == 'Array') v = arrToJson(v);

				if (v.json) v = v.json(); else {
					v = (t == 'Object' ? json.call(v) : '"' + v + '"');
				}

				if (tmp.length > 1) tmp += ',';
				tmp += v;
			}

			return tmp + ']';
		};

		for (var p in this) if (this.hasOwnProperty(p)) {
			var val = this[p], type = WebbyJs.classOf(val);

			if (type == 'Function') continue;
			if (type == 'Array') val = arrToJson(val);

			if (val.json) val = val.json(); else {
				val = (type == 'Object' ? json.call(val) : '"' + val + '"');
			}

			if (data.length > 1) data += ',';
			data += '"' + p + '":' + val;
		}

		return data + '}';
	},

	/**
	 * Dump current instance to browser console.
	 *
	 * @method dump
	 * @memberof W.prototype
	 *
	 * @returns {W} current instance for chaining.
	 */
	dump: function() {
		WebbyJs.log(this.toString());

		for (var p in this) {
			WebbyJs.log(p + ":" + WebbyJs.classOf(this[p]) + " = " + this[p]);
		}

		return this;
	},

	/**
	 * Mix object members to current instance.
	 *
	 * @method mix
	 * @memberof W.prototype
	 *
	 * @param {Object} obj - source object reference.
	 * @param {Boolean} safe - safety flag, if true - existing members are not overwritten.
	 *
	 * @returns {W} current instance for chaining.
	 */
	mix: function(obj, safe) {
		var p;

		if (safe) {
			for (p in obj) if (!this[p] && obj.hasOwnProperty(p)) this[p] = obj[p];
		} else {
			for (p in obj) if (obj.hasOwnProperty(p)) this[p] = obj[p];
		}

		return this;
	},

	/**
	 * Clone current instance.
	 *
	 * All non-primitive members are stored as references, so they must have clone method
	 * to clone themselves. Otherwise, they stay shared behind original and cloned instances.
	 *
	 * @method clone
	 * @memberof W.prototype
	 *
	 * @returns {W} cloned instance.
	 */
	clone: function() {
		var cloned = new this.constructor(), clone = this.clone;

		for (var p in this) if (this.hasOwnProperty(p)) {
			var o = this[p];

			if (o.clone) cloned[p] = o.clone(); else {
				cloned[p] = (typeof o === 'object' ? clone.call(o) : o);
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
 * Init WebbyJs core and shortcut.
 */
var w = WebbyJs.init();
