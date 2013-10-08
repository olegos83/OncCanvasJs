/**
 * @file WebbyJs core object.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * WebbyJs base namespace and core methods.
 * 
 * @namespace
 */
var WebbyJs = {
	/**
	 * All WebbyJs members, which can be globalized.
	 * 
	 * @memberof WebbyJs
	 * @type {Array}
	 * 
	 * @private
	 */
	_globals: [],
	
	//default prototype for created classes
	_defaultProto: {
		//default toString
		toString: function() {
			return '[WebbyJs.' + this.constructor._w_className + ']';
		},
		
		//default valueOf
		valueOf: function() {
			return this.constructor._w_className;
		},
		
		//get class name
		className: function() {
			return this.constructor._w_className;
		},
		
		//export as object
		toObject: function() {
			return {
				name: this.className(),
				properties: this.properties(),
				methods: this.methods()
			};
		},
		
		//dump object info to console
		dump: function() {
			console.log(this.toString());
			
			for (var p in this) {
				console.log(p + ":" + WebbyJs.getClassName(this[p]) + " = " + this[p]);
			}
			
			return this;
		},
		
		//get prototype
		getPrototype: function() {
			return this.constructor.prototype;
		},
		
		//get properties as object
		properties: function() {
			var props = {};
			
			for (var p in this) {
				if (this.hasOwnProperty(p)) props[p] = this[p];
			}
			
			return props;
		},
		
		//get methods as object
		methods: function() {
			var methods = {}, proto = this.constructor.prototype;
			
			for (var m in proto) {
				if (proto.hasOwnProperty(m)) methods[m] = proto[m];
			}
			
			return methods;
		},
		
		//mixin object properties
		mixin: function(obj, safe) {
			for (var p in obj) if (obj.hasOwnProperty(p)) {
				if (safe) {
					if (!this[p]) this[p] = obj[p];
				} else {
					this[p] = obj[p];
				}
			}
			
			return this;
		},
		
		//invoke method in native scope
		invoke: function(method, args) {
			method.apply(this, args);
			return this;
		}
	},
	
	/**
	 * Browser information.
	 * 
	 * @memberof WebbyJs
	 * @type {String}
	 * 
	 * @returns {String} vendor of currently used browser.
	 */
	BROWSER: ( function() {
		var nav = navigator.userAgent.toLowerCase();
		
		if (nav.indexOf('firefox') != -1) return 'firefox';
		if (nav.indexOf('opera') != -1) return 'opera';
		
		if (nav.indexOf('chrome') != -1) return 'chrome';
		if (nav.indexOf('msie') != -1) return 'ie';
	}() ),
	
	/**
	 * Invoke method in WebbyJs 'this' scope.
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
	 * Throw an error exeption.
	 * 
	 * @method throwError
	 * @memberof WebbyJs
	 * 
	 * @param {String} msg - error message.
	 * @param {String} name - error name.
	 */
	throwError: function(msg, name) {
		var err = new Error(msg || 'Something is going wrong');
		err.name = name || 'WebbyJsError';
		throw err;
	},
	
	/**
	 * Get class name. Use to check class for any instance.
	 * 
	 * @method getClassName
	 * @memberof WebbyJs
	 * 
	 * @param {Object} obj - object.
	 * 
	 * @returns {String} objects class name or '' for undefined or null obj.
	 */
	getClassName: function(obj) {
		if (obj === null || typeof obj === 'undefined') return '';
		return obj.constructor.name || obj.constructor._w_className;
	},
	
	//inherit prototype
	/**
	 * Get class name. Use to check class for any instance.
	 * 
	 * @method getClassName
	 * @memberof WebbyJs
	 * 
	 * @param {Object} obj - object.
	 * 
	 * @returns {String} objects class name or '' for undefined or null obj.
	 */
	extendClass: function(childClass, parentClass) {
		if (this.getClassName(childClass) !== 'Function') this.throwError('Child class must be a function');
		if (this.getClassName(parentClass) !== 'Function') this.throwError('Parent class must be a function');
		
		function F() {}
		F.prototype = parentClass.prototype;
		
		childClass.prototype = new F();
		childClass.prototype.constructor = childClass;
	},
	
	//extend class with interfaces methods
	/**
	 * Get class name. Use to check class for any instance.
	 * 
	 * @method getClassName
	 * @memberof WebbyJs
	 * 
	 * @param {Object} obj - object.
	 * 
	 * @returns {String} objects class name or '' for undefined or null obj.
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
	
	//append static methods
	/**
	 * Get class name. Use to check class for any instance.
	 * 
	 * @method getClassName
	 * @memberof WebbyJs
	 * 
	 * @param {Object} obj - object.
	 * 
	 * @returns {String} objects class name or '' for undefined or null obj.
	 */
	addStaticMembers: function(classRef, staticMembers) {
		if (this.getClassName(classRef) !== 'Function') this.throwError('Class must be a function');
		if (this.getClassName(staticMembers) !== 'Object') this.throwError('Static class members must be passed as object');
		
		for (var p in staticMembers) if (staticMembers.hasOwnProperty(p)) classRef[p] = staticMembers[p];
	},
	
	//check name validity
	
	//create new class
	/**
	 * Get class name. Use to check class for any instance.
	 * 
	 * @method getClassName
	 * @memberof WebbyJs
	 * 
	 * @param {Object} obj - object.
	 * 
	 * @returns {String} objects class name or '' for undefined or null obj.
	 */
	createClass: function(className, superClass, classConstructor, classProto, interfaces, staticMembers) {
		//check class name
		if (className === '' || this.getClassName(className) !== 'String') this.throwError('Invalid class name');
		if (this.getClassName(this[className])) this.throwError(className + " allready exists");
		
		//setup constructor
		if (this.getClassName(classConstructor) !== 'Function') this.throwError('Constructor must be a function');
		if (classConstructor.name) this.throwError('Constructor must be an anonymous function');
		
		var src = 'WebbyJs.' + className + ' = ' + classConstructor.toString().replace('function', 'function ' + className);
		window.eval(src);
		
		classConstructor = this[className];
		classConstructor._w_className = className;
		this._globals.push(className);
		
		//setup inheritance, static methods and interfaces
		if (superClass) this.extendClass(classConstructor, superClass);
		if (staticMembers) this.addStaticMembers(classConstructor, staticMembers);
		if (interfaces) this.extendProto(classConstructor, interfaces);
		
		//setup prototype
		this.extendProto(classConstructor, this._defaultProto);
		if (classProto) this.extendProto(classConstructor, classProto);
	},
	
	//append method
	/**
	 * Get class name. Use to check class for any instance.
	 * 
	 * @method getClassName
	 * @memberof WebbyJs
	 * 
	 * @param {Object} obj - object.
	 * 
	 * @returns {String} objects class name or '' for undefined or null obj.
	 */
	addMethod: function(name, method) {
		//check name
		if (name === '' || this.getClassName(name) !== 'String') this.throwError('Invalid method name');
		if (this.getClassName(this[name])) this.throwError(name + " allready exists");
		
		//check method
		if (this.getClassName(method) !== 'Function') this.throwError('Method must be a function');
		
		//append method
		this[name] = method;
		this._globals.push(name);
	},
	
	//append object
	/**
	 * Get class name. Use to check class for any instance.
	 * 
	 * @method getClassName
	 * @memberof WebbyJs
	 * 
	 * @param {Object} obj - object.
	 * 
	 * @returns {String} objects class name or '' for undefined or null obj.
	 */
	addObject: function(name, obj) {
		//check name
		if (name === '' || this.getClassName(name) !== 'String') this.throwError('Invalid method name');
		if (this.getClassName(this[name])) this.throwError(name + " allready exists");
		
		//check method
		if (this.getClassName(method) !== 'Object') this.throwError('Method must be an object');
		
		//append method
		this[name] = obj;
		this._globals.push(name);
	},
	
	//extract all classes to global scope
	/**
	 * Get class name. Use to check class for any instance.
	 * 
	 * @method getClassName
	 * @memberof WebbyJs
	 * 
	 * @param {Object} obj - object.
	 * 
	 * @returns {String} objects class name or '' for undefined or null obj.
	 */
	globalize: function(globe) {
		if (!globe) globe = window;
		
		var globals = this._globals, l = globals.length, name;
		
		for (var i = 0; i < l; i++) {
			name = globals[i];
			globe[name] = this[name];
		}
	}
};
