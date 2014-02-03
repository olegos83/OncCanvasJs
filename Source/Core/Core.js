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
	 * Define source members inside WebbyJs.
	 *
	 * @method define
	 * @memberof w
	 *
	 * @param {Object} src - members source.
	 */
	define: function(src) {
		if (this.typeOf(src) != 'Object') this.err('Failed to define members');

		for (var m in src) {
			if (this._core[m]) this.err('Failed to override core member: ' + m);
			this[m] = src[m];
		}
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
	},

	/**
	 * Implement interfaces inside target class prototype.
	 *
	 * @method implement
	 * @memberof w
	 *
	 * @param {Function} target - target class reference.
	 * @param {Object} ... - one or more interfaces.
	 */
	implement: function(target) {
		if (this.typeOf(target) != 'Function') this.err('Invalid implementation target');

		for (var i = 1, l = arguments.length; i < l; i++) {
			var o = arguments[i], t = this.typeOf(o);

			if (t == 'Function') this.copy(o.prototype, target.prototype);
			else if (t == 'Object') this.copy(o, target.prototype);
		}
	}

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
		if (this.typeOf(opt.construct) != 'Function') this.err('Invalid constructor');

		var name = opt.construct.name;
		if (name == '' || this.typeOf(name) != 'String') this.err('Invalid class name');

		var construct = opt.construct, def = {};
		def[name] = costruct;

		this.define(def);
		this._classes[name] = construct;

		construct.create = this.W.create;
		if (this.typeOf(opt.statics) == 'Object') this.copy(opt.statics, construct);

		var base = opt.base || this.W;

		if (base instanceof this.W) {
			this.inherit(construct, base);
			this.implement(construct, opt.implements, opt.proto);
		}
		else this.err('Base class must be WebbyJs compatible');
	}
};

/**
 * Init WebbyJs core.
 */
w.invoke(function() {
	/**
	 * Define basic WebbyJs class - a base for all WebbyJs created classes.
	 *
	 * @class W
	 * @memberof w
	 */
	this.define({
		/**
		 * @constructor
		 * @param {Object} opt - creation options.
		 */
		W: function W(opt) {
			this.set(opt);
		}
	});

	/**
	 * Set factory method to create instances.
	 *
	 * @method create
	 * @memberof W
	 *
	 * @param {Object} opt - creation options.
	 *
	 * @returns {W} created instance.
	 */
	this.W.create = function(opt) {
		return new this(opt);
	};

	/**
	 * Implement W.prototype.
	 */
	this.implement(this.W, {
		/**
		 * Set one or more properties in current instance.
		 *
		 * @method set
		 * @memberof W.prototype
		 *
		 * @param {String|Object} opt - option name or multiply options hash.
		 * @param {*} val - value for single option.
		 *
		 * @returns {W} current instance for chaining.
		 */
		set: function(opt, val) {
			if (opt != null) {
				if (val != null) this[opt] = val; else for (var p in opt) this[p] = opt[p];
			}

			return this;
		},

		/**
		 * Compare itself to target object.
		 * If deep flag is set - all non-primitive properties are recursivly checked to be equal.
		 *
		 * @method equalTo
		 * @memberof W.prototype
		 *
		 * @param {Object} target - target  reference.
		 * @param {Boolean} deep - deep flag.
		 *
		 * @returns {Boolean} true if all its properties are equal to corresponding ones in target.
		 */
		equalTo: function(target, deep) {
			return false;
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
	 * Secure core members from being overrided.
	 */
	this.copy(this, this._core);
});
