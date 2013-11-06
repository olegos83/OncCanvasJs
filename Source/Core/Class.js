/**
 * @file The implementation of WebbyJs class creation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Base static methods for OOP, added to all WebbyJs classes.
 * 
 * @memberof WebbyJs
 * @type {Object}
 * 
 * @private
 */
WebbyJs.define('_classBase', {
	/**
	 * This class prototype inheritance method.
	 * 
	 * @method extendClass
	 * @memberof _classBase
	 * 
	 * @param {Object} base - base class reference.
	 * 
	 * @returns {_classBase} current instance for chaining.
	 */
	extend: function(base) {
		if (base == this) return this;
		if (WebbyJs.getClassName(base) !== 'Function') this.error('Base class must be a constructor function');
		
		var proto = this.prototype = new base();
		for (var p in proto) if (proto.hasOwnProperty(p)) delete proto[p];
		
		proto.constructor = this;
		this.baseClass = base.prototype;
		
		return this;
	},
	
	/**
	 * Extend this class prototype with methods from interfaces.
	 * 
	 * @method implement
	 * @memberof _classBase
	 * 
	 * @param {Object|Array} interfaces - single or array of interfaces.
	 * 
	 * @returns {_classBase} current instance for chaining.
	 */
	implement: function(interfaces) {
		if (interfaces == this) return this;
		if (WebbyJs.getClassName(interfaces) !== 'Array') interfaces = [interfaces];
		
		var proto = this.prototype, l = interfaces.length;
		
		for (var i = 0; i < l; i++) {
			var iface = interfaces[i], ifaceClass = WebbyJs.getClassName(iface);
			
			if (ifaceClass !== 'Object' && ifaceClass !== 'Function') continue;
			if (ifaceClass === 'Function') { if (iface == this) continue; iface = iface.prototype; }
			
			for (var p in iface) if (iface.hasOwnProperty(p)) proto[p] = iface[p];
		}
		
		return this;
	},
	
	/**
	 * Append static methods to this class.
	 * 
	 * @method addStatic
	 * @memberof _classBase
	 * 
	 * @param {Object} statics - object with static members.
	 * 
	 * @returns {_classBase} current instance for chaining.
	 */
	addStatic: function(statics) {
		if (statics == this) return this;
		if (WebbyJs.getClassName(statics) !== 'Object') this.error('Static class members must be passed as object');
		
		for (var p in statics) if (statics.hasOwnProperty(p)) this[p] = statics[p];
		return this;
	}
}, { exportable: false });

/**
 * Define new WebbyJs class.
 * 
 * @method Class
 * @memberof WebbyJs
 * 
 * @param {Object} options - class definition options, like in example below.
 * 
 * 							  var options = {
 * 								  name: 'ClassName',
 * 								  extend: parentClassReference,
 * 								  construct: function ClassName(args) { ... },
 * 								  proto: { prototype },
 * 								  implement: [interfaceRferencesArr] || interfaceReference,
 * 								  statics: { static members },
 * 								  exportable: true || flase
 * 							  };
 * 
 * @returns {WObject} new defined class.
 */
WebbyJs.define('Class', function(options) {
	//validate class options
	if (this.getClassName(options) !== 'Object') this.error('Class options must be passed as object');
	
	var name = options.name, construct = options.construct;
	
	if (this.getClassName(construct) !== 'Function') this.error('Class constructor must be a function');
	this.validateName(name);
	
	//setup constructor
	construct._w_className = name;
	this[name] = window['_w_' + name] = construct;
	
	if (options.exportable !== false) this._globals[name] = construct;
	
	//setup static methods, extend from base class, setup interfaces and prototype
	construct.addStatic = this._classBase.addStatic;
	
	construct.addStatic(this._classBase).
			  addStatic(options.statics).
			  extend(options.extend || this.WObject).
			  implement(options.implement).
			  implement(options.proto);
	
	return construct;
}, { exportable: false });

/**
 * Base class for all WebbyJs created classes.
 * All created classes are inherited from it.
 * 
 * @class WObject
 * @memberof WebbyJs
 */
WebbyJs.Class({
	/**
	 * Class name.
	 */
	name: 'WObject',
	
	/**
	 * @constructor
	 */
	construct: function WObject() {
		//empty constructor
	},
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Get class name of current instance.
		 * 
		 * @method className
		 * @memberof WObject.prototype
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
		 * @memberof WObject.prototype
		 * 
		 * @returns {Object} prototype of current instance.
		 */
		getPrototype: function() {
			return this.constructor.prototype;
		},
		
		/**
		 * Get base class of current instance.
		 * 
		 * @method getBaseClass
		 * @memberof WObject.prototype
		 * 
		 * @returns {Object} base class of current instance or undefined if no base class.
		 */
		getBaseClass: function() {
			return this.constructor.baseClass;
		},
		
		/**
		 * Get all properties of current instance.
		 * 
		 * @method properties
		 * @memberof WObject.prototype
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
		 * @memberof WObject.prototype
		 * 
		 * @returns {Object} methods as object.
		 */
		methods: function() {
			var methods = {}, proto = this.constructor.prototype;
			
			for (var m in proto) {
				if (proto.hasOwnProperty(m)) methods[m] = proto[m];
			}
			
			delete methods.constructor;
			return methods;
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
			return '[WebbyJs.' + this.className() + ']';
		},
		
		/**
		 * Convert current instance to object.
		 * 
		 * @method toObject
		 * @memberof WObject.prototype
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
		 * Mixin object members to current instance.
		 * 
		 * @method mixin
		 * @memberof WObject.prototype
		 * 
		 * @param {Object} obj - source object reference.
		 * @param {Boolean} safe - safety flag, if true - existing members are not overwritten.
		 * 
		 * @returns {WObject} current instance for chaining.
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
		 * Clone current instance.
		 * 
		 * All non-primitive members are stored as references, so they must have clone method
		 * to clone themselves. Otherwise, they remaine shared behind original and cloned instances.
		 * 
		 * @method clone
		 * @memberof WObject.prototype
		 * 
		 * @returns {WObject} cloned instance.
		 */
		clone: function() {
			var clone = new this.constructor();
			
			for (var p in this) if (this.hasOwnProperty(p)) {
				var o = this[p];
				
				if (o.clone) clone[p] = o.clone(); else {
					clone[p] = (typeof o === 'object' ? WebbyJs.WObject.prototype.clone.call(o) : o);
				}
			}
			
			return clone;
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
	}
});
