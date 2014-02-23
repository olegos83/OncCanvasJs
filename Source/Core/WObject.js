/**
 * @file WObject implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Define WObject.
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
	function WObject(opt) {
		this.set(opt);
	}

	this.define('WObject', WObject, true);

	/**
	 * Set factory method to create instances.
	 *
	 * @method create
	 * @memberof WObject
	 *
	 * @param {*} ... - constructor arguments.
	 *
	 * @returns {WObject} created instance.
	 */
	this.WObject.create = function() {
		if (arguments.length == 0) return new this();

		var o = new this();
		this.apply(o, arguments);

		return o;
	};

	/**
	 * Implement WObject.prototype.
	 */
	this.implement(this.WObject, {
		/**
		 * Class name.
		 *
		 * @memberof WObject.prototype
		 * @type {String}
		 */
		classname: 'WObject',

		/**
		 * Superclass prototype reference.
		 *
		 * @memberof WObject.prototype
		 * @type {Object}
		 */
		superclass: this.WObject,

		/**
		 * Set one or more properties in current instance.
		 *
		 * @method set
		 * @memberof WObject.prototype
		 *
		 * @param {String|Object} m - property name or multiply properties hash.
		 * @param {*} v - value for single property.
		 *
		 * @returns {WObject} current instance for chaining.
		 */
		set: function(m, v) {
			var t = typeof m;

			if (t == 'object') for (var p in m) this[p] = m[p];
			else if (t == 'string') this[m] = v;

			return this;
		},

		/**
		 * Unset one or more object properties.
		 *
		 * @method unset
		 * @memberof WObject.prototype
		 *
		 * @param {String|Array|Object} ... - property name, array of names or multiply properties hash.
		 *
		 * @returns {WObject} current instance for chaining.
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
		 * @memberof WObject.prototype
		 *
		 * @returns {WObject} current instance for chaining.
		 */
		reset: function() {
			this.constructor.call(this);
			return this;
		},

		/**
		 * Empty object - delete all its properties.
		 *
		 * @method empty
		 * @memberof WObject.prototype
		 *
		 * @returns {WObject} current instance for chaining.
		 */
		empty: function() {
			for (var p in this) if (this.hasOwnProperty(p)) delete this[p];
			return this;
		},

		/**
		 * Clean current instance - delete all non-native properties.
		 *
		 * @method clean
		 * @memberof WObject.prototype
		 *
		 * @returns {WObject} current instance for chaining.
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
		 * @memberof WObject.prototype
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
		 * @memberof WObject.prototype
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
		 * @memberof WObject.prototype
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
		 * @memberof WObject.prototype
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
		 * @memberof WObject.prototype
		 *
		 * @param {String} data - XML source string.
		 *
		 * @returns {WObject|String} XML string or current instance for chaining.
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
		 * @memberof WObject.prototype
		 *
		 * @param {String} data - JSON source string.
		 *
		 * @returns {WObject|String} JSON string or current instance for chaining.
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
		 * @memberof WObject.prototype
		 *
		 * @returns {WObject} current instance for chaining.
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
		 * @memberof WObject.prototype
		 *
		 * @returns {WObject} cloned instance.
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
		 * Apply method with execution context set to current instance.
		 *
		 * @method apply
		 * @memberof WObject.prototype
		 *
		 * @param {Function} method - method to apply.
		 *
		 * @returns {WObject} current instance for chaining.
		 */
		apply: function(method) {
			method.call(this);
			return this;
		},

		/**
		 * Invoke method with arguments with execution context set to current instance.
		 *
		 * @method invoke
		 * @memberof WObject.prototype
		 *
		 * @param {Function} method - method to invoke.
		 * @param {*} ... - method arguments.
		 *
		 * @returns {WObject} current instance for chaining.
		 */
		invoke: function(method) {
			Array.prototype.shift.call(arguments).apply(this, arguments);
			return this;
		},

		/**
		 * Enable events processing for current instance.
		 *
		 * @method enableEvents
		 * @memberof WObject.prototype
		 *
		 * @returns {WObject} current instance for chaining.
		 */
		enableEvents: function() {
			if (this._eventHandlers == null) this._eventHandlers = {};
			return this;
		},

		/**
		 * Add event handler for specified event type.
		 *
		 * @method addEventListener
		 * @memberof WObject.prototype
		 *
		 * @param {String} type - event type.
		 * @param {Function} handler - handler reference.
		 *
		 * @returns {WObject} current instance for chaining.
		 */
		addEventListener: function(type, handler) {
			if (this._eventHandlers[type] == null) this._eventHandlers[type] = [handler];
			else if (this.hasEventListener(type, handler) == false) this._eventHandlers[type].push(handler);
			return this;
		},

		/**
		 * Remove event handler for specified event type.
		 *
		 * @method removeEventListener
		 * @memberof WObject.prototype
		 *
		 * @param {String} type - event type.
		 * @param {Function} handler - handler reference.
		 *
		 * @returns {WObject} current instance for chaining.
		 */
		removeEventListener: function(type, handler) {
			var handlers = this._eventHandlers[type];

			if (handlers && handlers.length) {
				if (handler == null) { handlers.length = 0; return this; }

				for (var i = 0, l = handlers.length; i < l; i++) {
					if (handlers[i] == handler) { handlers.splice(i, 1); return this; }
				}
			}

			return this;
		},

		/**
		 * Check if handler is allready added for specified event type.
		 *
		 * @method hasEventListener
		 * @memberof WObject.prototype
		 *
		 * @param {String} type - event type.
		 * @param {Function} handler - event handler.
		 *
		 * @returns {Boolean} true if handler is added or false otherwise.
		 */
		hasEventListener: function(type, handler) {
			var handlers = this._eventHandlers[type];

			if (handlers && handlers.length) {
				for (var i = 0, l = handlers.length; i < l; i++) if (handlers[i] == handler) return true;
			}

			return false;
		},

		/**
		 * Call handlers for specified event type.
		 *
		 * @method processEvent
		 * @memberof WObject.prototype
		 *
		 * @param {Object} e - event object.
		 *
		 * @returns {WObject} current instance for chaining.
		 */
		processEvent: function(e) {
			var handlers = this._eventHandlers[e.type];

			if (handlers && handlers.length) {
				e.lastTarget = e.target;
				e.target = this;

				for (var i = 0, l = handlers.length; i < l; i++) handlers[i].call(this, e);
			}

			return this;
		}
	});

	/**
	* Secure core members from being overrided.
	*/
	this.copy(this, this._core);
});

/**
 * Mouse event types.
 **/
w.Mouse = {
	CLICK: 'click',
	DBLCLICK: 'dblclick',
	DOWN: 'mousedown',
	MOVE: 'mousemove',
	UP: 'mouseup',
	OVER: 'mouseover',
	OUT: 'mouseout',
	DRAGSTART: 'dragstart',
	DRAG: 'drag',
	DRAGEND: 'dragend'
};
