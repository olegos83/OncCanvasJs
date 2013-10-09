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
	 * Invoke method with 'this' reference to WebbyJs.
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
		
		function F() {}
		F.prototype = parent.prototype;
		
		child.prototype = new F();
		child.prototype.constructor = child;
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
	 * Check name validity inside WebbyJs and throw error for invalid name.
	 * 
	 * @method checkNameValidity
	 * @memberof WebbyJs
	 * 
	 * @param {String} name - name to check.
	 */
	checkNameValidity: function(name) {
		if (name === '' || this.getClassName(name) !== 'String') this.throwError('Invalid name');
		if (this.getClassName(this[name])) this.throwError(name + " allready exists");
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
	},
	
	/**
	 * Import members to WebbyJs. Imported members can be globalized later.
	 * 
	 * @method import
	 * @memberof WebbyJs
	 * 
	 * @param {Object} members - members object reference.
	 */
	import: function(members) {
		if (this.getClassName(members) !== 'Object') this.throwError('Members must be passed as an object');
		
		for (var m in members) {
			this.checkNameValidity(m);
			
			this[m] = members[method];
			this._globals.push(m);
		}
	},
	
	/**
	 * Extract all added stuff to global scope.
	 * 
	 * @method globalize
	 * @memberof WebbyJs
	 * 
	 * @param {Object} globe - global object, window by default.
	 */
	globalize: function(globe) {
		var global = globe || window, l = this._globals.length;
		
		for (var i = 0, name; i < l; i++) {
			name = this._globals[i];
			global[name] = this[name];
		}
	}
};
