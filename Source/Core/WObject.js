/**
 * @file The implementation of base WebbyJs class.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Base class for all WebbyJs created classes. All created classes are inherited from it.
 * This class is created in a bit lower level to provide further classes work properly.
 * 
 * @class WObject
 * @memberof WebbyJs
 */
WebbyJs.define({
	WObject: function WObject() {
		//empty constructor
	}
}, { newClass: true });

/**
 * Append static methods to this class.
 * 
 * @method statics
 * @memberof WObject
 * 
 * @param {Object} statics - object with static members.
 * 
 * @returns {WObject} current instance for chaining.
 */
WebbyJs.WObject.statics = function(statics) {
	if (!statics) return this;
	WebbyJs.validate(statics, 'Object, Function');
	
	for (var p in statics) if (statics.hasOwnProperty(p)) this[p] = statics[p];
	return this;
};

/**
 * Add WObject static members.
 */
WebbyJs.WObject.statics({
	/**
	 * Create instance of this class.
	 * 
	 * @method create
	 * @memberof WObject
	 * 
	 * @param {Array} args - constructor arguments.
	 * 
	 * @returns {WObject} created instance.
	 */
	create: function(args) {
		return new this(args);
	},
	
	/**
	 * Extend this class from base class using prototype inheritance.
	 * 
	 * @method extendClass
	 * @memberof WObject
	 * 
	 * @param {Object} base - base class reference.
	 * 
	 * @returns {WObject} current instance for chaining.
	 */
	extend: function(base) {
		if (!base) return this;
		WebbyJs.validate(base, 'Function');
		
		var proto = this.prototype = new base();
		for (var p in proto) if (proto.hasOwnProperty(p)) delete proto[p];
		
		proto.constructor = this;
		this._w_base = base.prototype;
		
		return this;
	},
	
	/**
	 * Extend this class prototype with methods from interfaces.
	 * 
	 * @method implement
	 * @memberof WObject
	 * 
	 * @param {Object|Array} interfaces - single or array of interfaces.
	 * 
	 * @returns {WObject} current instance for chaining.
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
 * Implement WObject prototype.
 */
}).implement({
	/**
	 * Force to free objects resources from memory.
	 * 
	 * Be carefull with this method - it sets all properties
	 * to null, so object becomes unusable after this action.
	 * 
	 * @method free
	 * @memberof WObject.prototype
	 * 
	 * @returns {WObject} current instance for chaining.
	 */
	free: function() {
		for (var p in this) if (this.hasOwnProperty(p)) this[p] = null;
		return this;
	},
	
	/**
	 * Get class name of current instance.
	 * 
	 * @method className
	 * @memberof WObject.prototype
	 * 
	 * @returns {String} class name of current instance.
	 */
	className: function() {
		return this.constructor._w_class;
	},
	
	/**
	 * Get prototype of current instance.
	 * 
	 * @method proto
	 * @memberof WObject.prototype
	 * 
	 * @returns {Object} prototype of current instance.
	 */
	proto: function() {
		return this.constructor.prototype;
	},
	
	/**
	 * Get base class of current instance.
	 * 
	 * @method baseClass
	 * @memberof WObject.prototype
	 * 
	 * @returns {WObject} base class of current instance or undefined if no base class.
	 */
	baseClass: function() {
		return this.constructor._w_base;
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
		return '[WebbyJs.' + this.constructor._w_class + ']';
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
	 * Dump current instance to browser console.
	 * 
	 * @method dump
	 * @memberof WObject.prototype
	 * 
	 * @returns {WObject} current instance for chaining.
	 */
	dump: function() {
		console.log(this.toString());
		
		for (var p in this) {
			console.log(p + ":" + WebbyJs.getClassName(this[p]) + " = " + this[p]);
		}
		
		return this;
	},
	
	/**
	 * Mix object members to current instance.
	 * 
	 * @method mix
	 * @memberof WObject.prototype
	 * 
	 * @param {Object} obj - source object reference.
	 * @param {Boolean} safe - safety flag, if true - existing members are not overwritten.
	 * 
	 * @returns {WObject} current instance for chaining.
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
	 * @memberof WObject.prototype
	 * 
	 * @returns {WObject} cloned instance.
	 */
	clone: function() {
		var cloned = new this.constructor(), clone = WebbyJs.WObject.prototype.clone;
		
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
	 * @memberof WObject.prototype
	 * 
	 * @param {Function} method - method to invoke.
	 * @param {Array} args - method arguments.
	 * 
	 * @returns {WObject} current instance for chaining.
	 */
	invoke: function(method, args) {
		method.apply(this, args);
		return this;
	}
});
