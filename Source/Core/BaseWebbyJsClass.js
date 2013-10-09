/**
 * @file Base WebbyJs class. All created classes are inherited from it.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Base class for all WebbyJs created classes.
 * 
 * @class BaseWebbyJsClass
 * @memberof WebbyJs
 */
WebbyJs.createClass('BaseWebbyJsClass', null,
	/**
	 * @constructs BaseWebbyJsClass
	 */
	function() {
		//empty constructor
	},
	
	/**
	 * Prototype description.
	 */
	{
		/**
		 * Get class name of current instance.
		 * 
		 * @method className
		 * @memberof BaseWebbyJsClass.prototype
		 * 
		 * @returns {String} class name of current instance.
		 */
		className: function() {
			return this.constructor._w_className;
		},
		
		/**
		 * Get prototype of current instance.
		 * 
		 * @method getPrototype
		 * @memberof BaseWebbyJsClass.prototype
		 * 
		 * @returns {Object} prototype of current instance.
		 */
		getPrototype: function() {
			return this.constructor.prototype;
		},
		
		/**
		 * Get all properties of current instance.
		 * 
		 * @method properties
		 * @memberof BaseWebbyJsClass.prototype
		 * 
		 * @returns {Object} properties as object.
		 */
		properties: function() {
			var props = {};
			
			for (var p in this) {
				if (this.hasOwnProperty(p)) props[p] = this[p];
			}
			
			return props;
		},
		
		/**
		 * Get current instance methods.
		 * 
		 * @method methods
		 * @memberof BaseWebbyJsClass.prototype
		 * 
		 * @returns {Object} methods as object.
		 */
		methods: function() {
			var methods = {}, proto = this.constructor.prototype;
			
			for (var m in proto) {
				if (proto.hasOwnProperty(m)) methods[m] = proto[m];
			}
			
			return methods;
		},
		
		/**
		 * Default toString method.
		 * 
		 * @method toString
		 * @memberof BaseWebbyJsClass.prototype
		 * 
		 * @returns {String} current instance as string.
		 */
		toString: function() {
			return '[WebbyJs.' + this.className() + ']';
		},
		
		/**
		 * Default valueOf method.
		 * 
		 * @method valueOf
		 * @memberof BaseWebbyJsClass.prototype
		 * 
		 * @returns {String} value of current instance.
		 */
		valueOf: function() {
			return this.className();
		},
		
		/**
		 * Convert current instance to object.
		 * 
		 * @method toObject
		 * @memberof BaseWebbyJsClass.prototype
		 * 
		 * @returns {Object} current instance as object.
		 */
		toObject: function() {
			return {
				name: this.className(),
				properties: this.properties(),
				methods: this.methods()
			};
		},
		
		/**
		 * Dump current instance to browser console.
		 * 
		 * @method dump
		 * @memberof BaseWebbyJsClass.prototype
		 * 
		 * @returns {BaseWebbyJsClass} current instance for chaining.
		 */
		dump: function() {
			console.log(this.toString());
			
			for (var p in this) {
				console.log(p + ":" + WebbyJs.getClassName(this[p]) + " = " + this[p]);
			}
			
			return this;
		},
		
		/**
		 * Mixin object members to current instance.
		 * 
		 * @method mixin
		 * @memberof BaseWebbyJsClass.prototype
		 * 
		 * @param {Object} obj - source object reference.
		 * @param {Boolean} safe - safety flag, if true - existing members are not overwritten.
		 * 
		 * @returns {BaseWebbyJsClass} current instance for chaining.
		 */
		mixin: function(obj, safe) {
			var p;
			
			if (safe) {
				for (p in obj) if (!this[p] && obj.hasOwnProperty(p)) this[p] = obj[p];
			} else {
				for (p in obj) if (obj.hasOwnProperty(p)) this[p] = obj[p];
			}
			
			return this;
		},
		
		/**
		 * Invoke method with 'this' reference to current instance.
		 * 
		 * @method invoke
		 * @memberof BaseWebbyJsClass.prototype
		 * 
		 * @param {Function} method - method to invoke.
		 * @param {Array} args - method arguments.
		 * 
		 * @returns {BaseWebbyJsClass} current instance for chaining.
		 */
		invoke: function(method, args) {
			method.apply(this, args);
			return this;
		}
	}
);
