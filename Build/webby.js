/**
 * @file WebbyJs core implementation.
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
	 * Unique global numeric id.
	 * 
	 * @memberof WebbyJs
	 * @type {Number}
	 * 
	 * @private
	 */
	_uniqId: 0,
	
	/**
	 * Global unique id generator.
	 * 
	 * @method getUniqId
	 * @memberof WebbyJs
	 * 
	 * @returns {Number} global numeric id.
	 */
	getUniqId: function() {
		return this._uniqId++;
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
	 * Import members to WebbyJs. Imported members can be globalized later.
	 * 
	 * @method import
	 * @memberof WebbyJs
	 * 
	 * @param {Object} members - members object reference.
	 * @param {Boolean} noGlobal - if true, globalization is canceled for current import.
	 */
	import: function(members, noGlobal) {
		if (this.getClassName(members) !== 'Object') this.throwError('Members must be passed as an object');
		
		for (var m in members) {
			this.checkNameValidity(m);
			this[m] = members[m];
			
			if (!noGlobal) this._globals.push(m);
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
	 * @param {Object} newClass - new class declaration object, like in example below.
	 * 
	 * 							  var newClassSample = {
	 * 								  name: 'ClassName',
	 * 								  parent: parentClassReference,
	 * 								  construct: function ClassName(args) { ... },
	 * 								  proto: { prototype },
	 * 								  interfaces: [interfaceRferencesArr] || interfaceReference,
	 * 								  statics: { static members }
	 * 							  };
	 */
	createClass: function(newClass) {
		//check input object, name and constructor
		if (this.getClassName(newClass) !== 'Object') this.throwError('New class must be passed as object');
		if (this.getClassName(newClass.construct) !== 'Function') this.throwError('Constructor must be a function');
		this.checkNameValidity(newClass.name);
		
		//setup constructor
		newClass.construct._w_className = newClass.name;
		this[newClass.name] = newClass.construct;
		this._globals.push(newClass.name);
		
		//extend class
		if (!newClass.parent) newClass.parent = this.BaseWebbyJsClass;
		this.extendClass(newClass.construct, newClass.parent);
		
		//setup static methods, interfaces and prototype
		if (newClass.statics) this.addStaticMembers(newClass.construct, newClass.statics);
		if (newClass.interfaces) this.extendProto(newClass.construct, newClass.interfaces);
		if (newClass.proto) this.extendProto(newClass.construct, newClass.proto);
	}
}, true);

/**
 * Base class for all WebbyJs created classes.
 * All created classes are inherited from it.
 * 
 * @class BaseWebbyJsClass
 * @memberof WebbyJs
 */
WebbyJs.createClass({
	/**
	 * Class name.
	 */
	name: 'BaseWebbyJsClass',
	
	/**
	 * @constructor
	 */
	construct: function BaseWebbyJsClass() {
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
});
/**
 * @file WebbyJs events interface and basic event types.
 * @author Olegos <olegos83@yandex.ru>
 */
WebbyJs.import({
	/**
	 * Mouse event types.
	 * 
	 * @memberof WebbyJs
	 * @enum {String}
	 */
	MouseEvent: {
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
	},
	
	/**
	 * Keyboard event types.
	 * 
	 * @memberof WebbyJs
	 * @enum {String}
	 */
	KeyEvent: {
	    KEYDOWN: 'keydown',
	    KEYUP: 'keyup'
	}
});

/**
 * EventListener interface provides events processing support.
 * 
 * To add events support, inherit or extend class with EventListener
 * and declare '_events' object in its constructor.
 * 
 * @class EventListener
 * @memberof WebbyJs
 */
WebbyJs.createClass({
	/**
	 * Class name.
	 */
	name: 'EventListener',

	/**
	 * @constructor
	 */
	construct: function EventListener() {
		/**
		 * Events hash, containing arrays of functions by event type as key.
		 * 
		 * @memberof EventListener
		 * @type {Object}
		 * 
		 * @private
		 */
		this._events = {};
	},
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Add event listener for specified event type.
		 * 
		 * @method addEventListener
		 * @memberof EventListener.prototype
		 * 
		 * @param {String} type - event type.
		 * @param {Function} handler - event handler.
		 * 
		 * @returns {EventListener} current instance for chaining.
		 */
		addEventListener: function(type, handler) {
			if (!this._events[type]) {
				this._events[type] = [handler];
			} else {
				var e = this._events[type], l = e.length, i;
				
				for (i = 0; i < l; i++) {
					if (e[i] == handler) return this;
				}
				
				e.push(handler);
			}
			
			return this;
		},
		
		/**
		 * Remove event listener for specified event type.
		 * 
		 * @method removeEventListener
		 * @memberof EventListener.prototype
		 * 
		 * @param {String} type - event type.
		 * @param {Function} handler - event handler, can be ommited to remove all handlers.
		 * 
		 * @returns {EventListener} current instance for chaining.
		 */
		removeEventListener: function(type, handler) {
		    if (!handler || !this._events[type]) {
		    	this._events[type] = [];
		    } else {
		    	var e = this._events[type], l = e.length, i;
		    	
		    	for (i = 0; i < l; i++) {
		    		if (e[i] == handler) { e.splice(i, 1); break; }
		    	}
		    }
		    
		    return this;
		},
		
		/**
		 * Process handlers for specified event type.
		 * 
		 * @method processEvent
		 * @memberof EventListener.prototype
		 * 
		 * @param {Object} evt - event object.
		 * 
		 * @returns {EventListener} current instance for chaining.
		 */
		processEvent: function(evt) {
		    if (this._events[evt.type]) {
		    	var e = this._events[evt.type], l = e.length, i;
		    	for (i = 0; i < l; i++) e[i].call(this, evt);
		    }
		    
		    return this;
		}
	}
});
/**
 * @file A wrapper for array to manage event driven data.
 * @author Olegos <olegos83@yandex.ru>
 */
WebbyJs.import({
	/**
	 * Data event types.
	 * 
	 * @memberof WebbyJs
	 * @enum {String}
	 */
	DataEvent: {
		ADD: 'add',
	    REMOVE: 'remove',
	    REPLACE: 'replace',
	    CLEAR: 'clear',
	    CHANGE: 'change'
	}
});

/**
 * DataProvider is designed to work with event driven data collections.
 * Events support is provided by extending EventListener prototype.
 * 
 * Any class may be inherited or extend DataProvider to support data events.
 * In that case, EventListener is applied to that class too. Don`t forget to
 * declare 'dp_storage' array in class constructor.
 * 
 * Event support can slow down items iteration, so you can directly use 'dp_storage' array
 * to get more iteration speed, but in that case, events must be processed manually.
 * 
 * @class DataProvider
 * @memberof WebbyJs
 */
WebbyJs.createClass({
	/**
	 * Class name.
	 */
	name: 'DataProvider',
	
	/**
	 * @constructor
	 */
	construct: function DataProvider() {
		/**
		 * Data array.
		 * 
		 * @memberof DataProvider
		 * @type {Array}
		 */
		this.dp_storage = [];
	},
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Append new item to the end and trigger DataEvent.ADD event.
		 * 
		 * @method append
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Object} item - item reference.
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		append: function(item) {
			this.dp_storage.push(item);
			this.processEvent({ item: item, type: DataEvent.ADD });
			
			return this;
		},
		
		/**
		 * Insert new item to specified index position and trigger DataEvent.ADD event.
		 * 
		 * @method appendAt
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Object} item - item reference.
		 * @param {Number} index - index position.
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		appendAt: function(item, index) {
		    this.dp_storage.splice(index, 0, item);
		    this.processEvent({ item: item, index: index, type: WebbyJs.DataEvent.ADD });
		    
		    return this;
		},
		
		/**
		 * Remove item from data and trigger DataEvent.REMOVE event.
		 * 
		 * @method remove
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Object} item - item reference.
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		remove: function(item) {
			var data = this.dp_storage, l = data.length, i;
			
			for (i = 0; i < l; i++) if (data[i] == item) {
				data.splice(i, 1);
				this.processEvent({ item: item, type: WebbyJs.DataEvent.REMOVE });
				
				return this;
			}
			
			return this;
		},
		
		/**
		 * Remove item from data at specified index position and trigger DataEvent.REMOVE event.
		 * 
		 * @method removeAt
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Number} index - index position.
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		removeAt: function(index) {
			var evt = { item: this.dp_storage[index], index: index, type: WebbyJs.DataEvent.REMOVE };
			
		    this.dp_storage.splice(index, 1);
		    this.processEvent(evt);
		    
		    return this;
		},
		
		/**
		 * Replace item by another item and trigger DataEvent.REPLACE event.
		 * 
		 * @method replace
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Object} item - item reference.
		 * @param {Object} newItem - new item reference.
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		replace: function(item, newItem) {
			var data = this.dp_storage, l = data.length, i;
			
			for (i = 0; i < l; i++) if (data[i] == item) {
				data[i] = newItem;
				this.processEvent({ oldItem: item, newItem: newItem, type: WebbyJs.DataEvent.REPLACE });
				
				return this;
			}
			
			return this;
		},
		
		/**
		 * Replace item by another item at specified index position and trigger DataEvent.REPLACE event.
		 * 
		 * @method replaceAt
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Number} index - index position.
		 * @param {Object} newItem - new item reference.
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		replaceAt: function(index, newItem) {
			var evt = { oldItem: this.dp_storage[index], newItem: newItem, index: index, type: WebbyJs.DataEvent.REPLACE };
			
		    this.dp_storage[index] = newItem;
		    this.processEvent(evt);
		    
		    return this;
		},
		
		/**
		 * Remove all data and trigger DataEvent.CLEAR event.
		 * 
		 * @method clear
		 * @memberof DataProvider.prototype
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		clear: function() {
			var evt = { data: [].concat(this.dp_storage), type: WebbyJs.DataEvent.CLEAR };
			
		    this.dp_storage.length = 0;
		    this.processEvent(evt);
		    
		    return this;
		},
		
		/**
		 * Get item at specified index.
		 * 
		 * @method itemAt
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Number} index - index position.
		 * 
		 * @returns {Object} found item.
		 */
		itemAt: function(index) {
		    return this.dp_storage[index];
		},
		
		/**
		 * Get item index.
		 * 
		 * @method indexOf
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Object} item - item reference.
		 * 
		 * @returns {Number} item index or -1, if item not found.
		 */
		indexOf: function(item) {
			var data = this.dp_storage, l = data.length, i;
			
		    for (i = 0; i < l; i++) {
		    	if (data[i] == item) return i;
		    }
		    
		    return -1;
		},
		
		/**
		 * Check if this data provider contains specified item.
		 * 
		 * @method contains
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Object} item - item reference.
		 * 
		 * @returns {Boolean} true, if item is in data provider or false othervise.
		 */
		contains: function(item) {
			var data = this.dp_storage, l = data.length, i;
			
		    for (i = 0; i < l; i++) {
		    	if (data[i] == item) return true;
		    }
		    
		    return false;
		},
		
		/**
		 * Change item index position and trigger DataEvent.CHANGE event.
		 * 
		 * @method setItemIndex
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Object} item - item reference.
		 * @param {Number} index - new index position.
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		setItemIndex: function(item, index) {
			var data = this.dp_storage, l = data.length, i;
		    
			for (i = 0; i < l; i++) if (data[i] == item) {
				data.splice(i, 1);
			    data.splice(index, 0, item);
			    
			    this.processEvent({ item: item, oldIndex: i, newIndex: index, type: WebbyJs.DataEvent.CHANGE });
			    return this;
		    }
			
			return this;
		},
		
		/**
		 * Get number of items in data.
		 * 
		 * @method length
		 * @memberof DataProvider.prototype
		 * 
		 * @returns {Number} number of items.
		 */
		length: function() {
			return this.dp_storage.length;
		},
		
		/**
		 * Iterate items form the begining to the end and invoke
		 * method with 'this' pointing to iterated item.
		 * 
		 * @method forEach
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Function} method - method reference.
		 * @param {Array} args - method arguments.
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		forEach: function(method, args) {
			var data = this.dp_storage, l = data.length, i;
			
			for (i = 0; i < l; i++) {
				method.apply(data[i], args);
			}
			
			return this;
		}
	},
	
	/**
	 * Interfaces.
	 */
	interfaces: WebbyJs.EventListener
});
