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
	 * @method uniqNumber
	 * @memberof w
	 *
	 * @returns {Number} uniq number.
	 */
	uniqNumber: ( function() { var n = 0; return function() { return n++; }; }() ),

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
		return (obj == null ? '' : obj.classname || obj.constructor.name);
	},

	/**
	 * Define members inside WebbyJs.
	 *
	 * @method define
	 * @memberof w
	 *
	 * @param {String|Object} m - member name or multiply members hash.
	 * @param {*} v - reference to single member.
	 * @param {Boolean} c - class definition flag.
	 */
	define: function(m, v, c) {
		var t = this.typeOf(m);

		if (t == 'Object') {
			for (var p in m) {
				if (this._core[p]) this.err('Failed to override core member: ' + p);
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
	 * Copy members from source object to destination object.
	 *
	 * @method copy
	 * @memberof w
	 *
	 * @param {Object} src - source object.
	 * @param {Object} dst - destination object.
	 */
	copy: function(src, dst) {
		for (var m in src) if (src.hasOwnProperty(m)) dst[m] = src[m];
	},

	/**
	 * Delete all members from target object.
	 *
	 * @method empty
	 * @memberof w
	 *
	 * @param {Object} target - target object.
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

		var construct = opt.construct, base = opt.base || this.W, name = construct.name;

		if (base instanceof this.W) {
			if (this.typeOf(construct) != 'Function') this.err('Invalid constructor');
			if (name == '' || this.typeOf(name) != 'String') this.err('Invalid class name');

			this.define(name, construct, true);
			construct.prototype.classname = name;

			construct.create = this.W.create;
			if (this.typeOf(opt.statics) == 'Object') this.copy(opt.statics, construct);

			this.inherit(construct, base);
			this.implement(construct, opt.implements, opt.proto);
		}
		else this.err('Base class is not WebbyJs compatible');
	}
};

/**
 * Init WebbyJs core.
 */
w.invoke(function() {
	/**
	 * Base class for all WebbyJs created classes.
	 *
	 * @constructor
	 * @memberof w
	 *
	 * @param {Object} opt - creation options.
	 */
	function W(opt) {
		this.set(opt);
	}

	this.define('W', W, true);

	/**
	 * Set factory method to create instances.
	 *
	 * @method create
	 * @memberof W
	 *
	 * @param {*} ... - constructor arguments.
	 *
	 * @returns {W} created instance.
	 */
	this.W.create = function() {
		if (arguments.length == 0) return new this();

		var o = new this();
		this.apply(o, arguments);

		return o;
	};

	/**
	 * Implement W.prototype.
	 */
	this.implement(this.W, {
		/**
		 * Class name.
		 *
		 * @memberof W.prototype
		 * @type {String}
		 */
		classname: 'W',

		/**
		 * Superclass prototype reference.
		 *
		 * @memberof W.prototype
		 * @type {Object}
		 */
		superclass: this.W,

		/**
		 * Set one or more properties in current instance.
		 *
		 * @method set
		 * @memberof W.prototype
		 *
		 * @param {String|Object} m - property name or multiply properties hash.
		 * @param {*} v - value for single property.
		 *
		 * @returns {W} current instance for chaining.
		 */
		set: function(m, v) {
			if (m) {
				var t = typeof m;

				if (t == 'object') for (var p in m) this[p] = m[p];
				else if (t == 'string') this[m] = v;
			}

			return this;
		},

		/**
		 * Unset one or more object properties.
		 *
		 * @method unset
		 * @memberof W.prototype
		 *
		 * @param {String|Array|Object} ... - property name, array of names or multiply properties hash.
		 *
		 * @returns {W} current instance for chaining.
		 */
		unset: function() {
			for (var i = 0, l = arguments.length; i < l; i++) {
				var arg = arguments[i], t = w.typeOf(arg);

				if (t == 'String') delete this[arg];
				else if (t == 'Object') for (var p in arg) if (arg.hasOwnProperty(p)) delete this[p];
				else if (t == 'Array') for (var j = 0, jl = arg.length; j < jl; j++) delete this[arg[j]];
			}

			return this;
		},

		/**
		 * Reset all native properties to their default values.
		 *
		 * @method reset
		 * @memberof W.prototype
		 *
		 * @returns {W} current instance for chaining.
		 */
		reset: function() {
			this.constructor.call(this);
			return this;
		},

		/**
		 * Empty object - delete all its properties.
		 *
		 * @method empty
		 * @memberof W.prototype
		 *
		 * @returns {W} current instance for chaining.
		 */
		empty: function() {
			for (var p in this) if (this.hasOwnProperty(p)) delete this[p];
			return this;
		},

		/**
		 * Clean current instance - delete all non-native properties.
		 *
		 * @method clean
		 * @memberof W.prototype
		 *
		 * @returns {W} current instance for chaining.
		 */
		clean: function() {
			var c = new this.constructor();
			for (var p in this) if (c.hasOwnProperty(p) == false) delete this[p];
			return this;
		},

		/**
		 * Compare current instance to target object.
		 * If deep flag is set - all non-primitive properties are recursivly checked to be equal.
		 *
		 * @method equals
		 * @memberof W.prototype
		 *
		 * @param {Object} target - target  reference.
		 * @param {Boolean} deep - deep flag.
		 *
		 * @returns {Boolean} true if all its properties are equal to corresponding ones in target.
		 */
		equals: function(target, deep) {
			return false;
		},

		/**
		 * Get all property names from current instance.
		 *
		 * @method props
		 * @memberof W.prototype
		 *
		 * @returns {Array} array of property names.
		 */
		props: function() {
			var a = [];
			for (var p in this) if (this.hasOwnProperty(p)) a.push(p);
			return a;
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
			return '[' + this.classname + ']';
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

			return '<xml><empty /></xml>';
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

			return '{ "json": "empty" }';
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
		 * Invoke method with execution context set to current instance.
		 *
		 * @method invoke
		 * @memberof W.prototype
		 *
		 * @param {Function} method - method to invoke.
		 * @param {*} ... - method arguments.
		 *
		 * @returns {W} current instance for chaining.
		 */
		invoke: function(method) {
			Array.prototype.shift.call(arguments).apply(this, arguments);
			return this;
		}
	});

	/**
	 * Secure core members from being overrided.
	 */
	this.copy(this, this._core);
});
