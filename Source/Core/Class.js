/**
 * @file The implementation of WebbyJs class creation.
 * @author Olegos <olegos83@yandex.ru>
 */
WebbyJs.import({
	/**
	 * Class prototype inheritance method.
	 * 
	 * @method extendClass
	 * @memberof WebbyJs
	 * 
	 * @param {Object} child - child class reference.
	 * @param {Object} parent - parent class reference.
	 */
	extendClass: function(child, parent) {
		if (child == parent) return;
		if (this.getClassName(child) !== 'Function') this.throwError('Child class must be a function');
		if (this.getClassName(parent) !== 'Function') this.throwError('Parent class must be a function');
		
		var proto = child.prototype = new parent();
		for (var p in proto) if (proto.hasOwnProperty(p)) delete proto[p];
		
		proto.constructor = child;
		proto.parentclass = parent.prototype;
	},
	
	/**
	 * Extend class prototype with interfaces methods.
	 * 
	 * @method getClassName
	 * @memberof WebbyJs
	 * 
	 * @param {Object} classRef - class reference.
	 * @param {Object|Array} interfaces - single or array of interfaces.
	 */
	extendProto: function(classRef, interfaces) {
		if (this.getClassName(classRef) !== 'Function') this.throwError('Class must be a function');
		if (this.getClassName(interfaces) !== 'Array') interfaces = [interfaces];
		
		var proto = classRef.prototype, l = interfaces.length;
		
		for (var i = 0; i < l; i++) {
			var iface = interfaces[i], ifaceClass = this.getClassName(iface);
			
			if (ifaceClass !== 'Object' && ifaceClass !== 'Function') continue;
			if (ifaceClass === 'Function') iface = iface.prototype;
			
			for (var p in iface) if (iface.hasOwnProperty(p)) proto[p] = iface[p];
		}
	},
	
	/**
	 * Append static methods to class.
	 * 
	 * @method addStaticMembers
	 * @memberof WebbyJs
	 * 
	 * @param {Object} classRef - class reference.
	 * @param {Object} staticMembers - object with static members.
	 */
	addStaticMembers: function(classRef, staticMembers) {
		if (this.getClassName(classRef) !== 'Function') this.throwError('Class must be a function');
		if (this.getClassName(staticMembers) !== 'Object') this.throwError('Static class members must be passed as object');
		
		for (var p in staticMembers) if (staticMembers.hasOwnProperty(p)) classRef[p] = staticMembers[p];
	},
	
	/**
	 * Create new class.
	 * 
	 * @method createClass
	 * @memberof WebbyJs
	 * 
	 * @param {String} name - class name.
	 * @param {Object} parent - parent class reference.
	 * @param {Function} construct - class constructor.
	 * @param {Object} proto - object with prototype members.
	 * @param {Object} interfaces - single or array of interfaces.
	 * @param {Object} staticMembers - object with static members.
	 */
	createClass: function(name, parent, construct, proto, interfaces, staticMembers) {
		//check name and constructor
		this.checkNameValidity(name);
		
		if (this.getClassName(construct) !== 'Function') this.throwError('Constructor must be a function');
		if (construct.name) this.throwError('Constructor must be an anonymous function');
		
		//setup constructor
		var src = 'WebbyJs.' + name + ' = ' + construct.toString().replace('function', 'function ' + name);
		window.eval(src);
		
		construct = this[name];
		construct._w_className = name;
		this._globals.push(name);
		
		//extend class
		if (!parent) parent = this.BaseWebbyJsClass;
		this.extendClass(construct, parent);
		
		//setup prototype, static methods and interfaces
		if (staticMembers) this.addStaticMembers(construct, staticMembers);
		if (interfaces) this.extendProto(construct, interfaces);
		if (proto) this.extendProto(construct, proto);
	}
}, true);

/**
 * Base class for all WebbyJs created classes.
 * All created classes are inherited from it.
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
			
			delete methods.constructor;
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
		 * Clone current instance.
		 * 
		 * All non-primitive members are stored as references, so they must have clone method
		 * to clone themselves. Otherwise, they remaine shared behind original and cloned instances.
		 * 
		 * @method clone
		 * @memberof BaseWebbyJsClass.prototype
		 * 
		 * @returns {BaseWebbyJsClass} cloned instance.
		 */
		clone: function() {
			var clone = new this.constructor();
			
			for (var p in this) if (this.hasOwnProperty(p)) {
				var o = this[p];
				
				if (o.clone) clone[p] = o.clone(); else {
					clone[p] = (typeof o === 'object' ? WebbyJs.BaseWebbyJsClass.prototype.clone.call(o) : o);
				}
			}
			
			return clone;
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
