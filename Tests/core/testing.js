//WebbyJs core
var WebbyJs = {
	//all created classes
	_classes: [],
	
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
	
	//web browser type
	BROWSER: ( function() {
		var nav = navigator.userAgent.toLowerCase();
		
		if (nav.indexOf('firefox') != -1) return 'firefox';
		if (nav.indexOf('opera') != -1) return 'opera';
		
		if (nav.indexOf('chrome') != -1) return 'chrome';
		if (nav.indexOf('msie') != -1) return 'ie';
	}() ),
	
	//invoke method in WebbyJs scope
	invoke: function(method, args) {
		method.apply(this, args);
	},
	
	//throw error
	throwError: function(msg, name) {
		var err = new Error(msg || 'Something is going wrong');
		err.name = name || 'WebbyJsError';
		throw err;
	},
	
	//get class name
	getClassName: function(obj) {
		if (obj === null || typeof obj === 'undefined') return '';
		return obj.constructor.name || obj.constructor._w_className;
	},
	
	//inherit prototype
	extendClass: function(childClass, parentClass) {
		if (this.getClassName(childClass) !== 'Function') this.throwError('Child class must be a function');
		if (this.getClassName(parentClass) !== 'Function') this.throwError('Parent class must be a function');
		
		function F() {}
		F.prototype = parentClass.prototype;
		
		childClass.prototype = new F();
		childClass.prototype.constructor = childClass;
	},
	
	//extend class with interfaces methods
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
	addStaticMembers: function(classRef, staticMembers) {
		if (this.getClassName(classRef) !== 'Function') this.throwError('Class must be a function');
		if (this.getClassName(staticMembers) !== 'Object') this.throwError('Static class members must be passed as object');
		
		for (var p in staticMembers) if (staticMembers.hasOwnProperty(p)) classRef[p] = staticMembers[p];
	},
	
	//create new class
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
		this._classes.push(className);
		
		//setup inheritance, static methods and interfaces
		if (superClass) this.extendClass(classConstructor, superClass);
		if (staticMembers) this.addStaticMembers(classConstructor, staticMembers);
		if (interfaces) this.extendProto(classConstructor, interfaces);
		
		//setup prototype
		this.extendProto(classConstructor, this._defaultProto);
		if (classProto) this.extendProto(classConstructor, classProto);
	},
	
	//append method
	addMethod: function(name, method) {
		//check name
		if (name === '' || this.getClassName(name) !== 'String') this.throwError('Invalid method name');
		if (this.getClassName(this[name])) this.throwError(name + " allready exists");
		
		//check method
		if (this.getClassName(method) !== 'Function') this.throwError('Method must be a function');
		
		//append method
		this[name] = method;
		this._classes.push(name);
	},
	
	//extract all classes to global scope
	globalize: function(globe) {
		if (!globe) globe = window;
		
		var classes = this._classes, l = classes.length, name;
		
		for (var i = 0; i < l; i++) {
			name = classes[i];
			globe[name] = this[name];
		}
	}
};


//WebbyJs class tests
WebbyJs.createClass('TestClass1', null, function(x, y) {
	this.prop1 = x;
	this.prop2 = y;
}, {
	method1: function(x) {
		this.prop1 = x;
	},
	
	method2: function(x) {
		this.prop2 = x;
	}
});

//test
var Test = {
	start: function() {
		console.log(WebbyJs);
		
		var dd2 = new WebbyJs.TestClass1(15, 'any');
		console.log(dd2);
		
		console.log(dd2 instanceof WebbyJs.TestClass1);
		
		dd2.dump();
		
		console.log(dd2.properties());
		console.log(dd2.getPrototype());
		console.log(dd2.methods());
		console.log(dd2.toObject());
	}
};
