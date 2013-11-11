/**
 * @file WebbyJs core implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Name conflicts test.
 */
if (window.WebbyJs || window.webbyjs || window._w_) throw new Error('WebbyJs initialization failed - name conflict');

/**
 * WebbyJs namespace declaration and basic methods implementation.
 * 
 * @namespace
 */
var WebbyJs = window.webbyjs = window._w_ = {
	/**
	 * WebbyJs short description.
	 * 
	 * @memberof WebbyJs
	 * @type {Object}
	 * 
	 * @private
	 */
	_about: {
		name: 'WebbyJs',
		version: '0.01 unstable',
		shortcut: '_w_',
		description: 'Multipurpose web frontend framework',
		author: 'OlegoS',
		license: 'MIT'
	},
	
	/**
	 * WebbyJs members, exportable to global scope, stored by name.
	 * 
	 * @memberof WebbyJs
	 * @type {Object}
	 * 
	 * @private
	 */
	_exportable: {},
	
	/**
	 * Unique number.
	 * 
	 * @memberof WebbyJs
	 * @type {Number}
	 * 
	 * @private
	 */
	_un: 0,
	
	/**
	 * Browser short name.
	 * 
	 * @memberof WebbyJs
	 * @type {String}
	 */
	BROWSER: ( function() {
		var nav = navigator.userAgent.toLowerCase();
		
		if (nav.indexOf('firefox') != -1) return 'firefox';
		if (nav.indexOf('opera') != -1) return 'opera';
		
		if (nav.indexOf('chrome') != -1) return 'chrome';
		if (nav.indexOf('msie') != -1) return 'ie';
		
		return nav;
	}() ),
	
	/**
	 * User defined log provider for WebbyJs messages.
	 * It must be an object with 'log' method.
	 * 
	 * @memberof WebbyJs
	 * @type {Object}
	 */
	logProvider: { native: true, log: function(msg) { console.log(msg); } },
	
	/**
	 * Log message, using logProvider.
	 * 
	 * @method log
	 * @memberof WebbyJs
	 * 
	 * @param {Object} msg - message.
	 */
	log: function(msg) {
		this.logProvider.log(msg);
	},
	
	/**
	 * Throw an error exeption and log it, but only to custom logProvider.
	 * 
	 * @method error
	 * @memberof WebbyJs
	 * 
	 * @param {String} msg - error message.
	 * @param {String} name - error name.
	 */
	error: function(msg, name) {
		var err = new Error(msg || 'Unknown error');
		err.name = name || 'WebbyJsError';
		
		if (!this.logProvider.native) this.log(err.name + ': ' + err.message);
		throw err;
	},
	
	/**
	 * Log WebbyJs warning.
	 * 
	 * @method warning
	 * @memberof WebbyJs
	 * 
	 * @param {String} msg - warning message.
	 * @param {String} name - warning name.
	 */
	warning: function(msg, name) {
		this.log( (name || 'WebbyJsWarning') + ': ' + (msg || 'Unknown warning') );
	},
	
	/**
	 * Show about info.
	 * 
	 * @method about
	 * @memberof WebbyJs
	 */
	about: function() {
		this.log(this._about);
	},
	
	/**
	 * Get uniq integer number.
	 * 
	 * @method uniqNumber
	 * @memberof WebbyJs
	 * 
	 * @returns {Number} uniq number.
	 */
	uniqNumber: function() {
		return this._un++;
	},
	
	/**
	 * Invoke method in WebbyJs scope.
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
	 * Get class name for any instance.
	 * 
	 * @method classOf
	 * @memberof WebbyJs
	 * 
	 * @param {Object} obj - object.
	 * 
	 * @returns {String} objects class name or '' for undefined or null obj.
	 */
	classOf: function(obj) {
		if (obj === null || typeof obj === 'undefined') return '';
		return obj.constructor.name || obj.constructor._w_class;
	},
	
	/**
	 * WebbyJs name or class validation. Throws an error for invalid result.
	 * If 'allowed' argument present - it is a class validation, if not - name conflict test.
	 * 
	 * @method validate
	 * @memberof WebbyJs
	 * 
	 * @param {String|Object} v - name to check or instance to validate class.
	 * @param {String} allowed - names of allowed classes, for example 'Function, Object, String'.
	 */
	validate: function(v, allowed) {
		//class validation
		if (allowed) {
			v = this.classOf(v) || 'null';
			if (allowed.indexOf(v) == -1) this.error('Invalid class - ' + v + ', expected ' + allowed);
			
		//name validation
		} else {
			if (v === '' || this.classOf(v) !== 'String') this.error('Impossible to create WebbyJs.' + v);
			if (this[v]) this.error('WebbyJs.' + v + ' allready exists');
		}
	},
	
	/**
	 * Define members of WebbyJs. Each member is also cached globaly with
	 * '_w_' prefix to speed up class instantiating inside another lib class.
	 * 
	 * @method define
	 * @memberof WebbyJs
	 * 
	 * @param {Object} members - new member.
	 * @param {Object} options - define options.
	 */
	define: function(members, options) {
		this.validate(members, 'Object');
		if (options) this.validate(options, 'Object');
		
		var exportable = this._exportable, newClass = false;
		
		if (options) {
			if (options.noExport) exportable = null;
			if (options.newClass) newClass = true;
		}
		
		for (var name in members) if (members.hasOwnProperty(name)) {
			this.validate(name);
			
			var member = members[name];
			
			if (newClass) {
				this.validate(member, 'Function');
				
				if (this.WObject) this.WObject.statics.call(member, this.WObject);
				member._w_class = name;
			}
			
			this[name] = window['_w_' + name] = member;
			if (exportable) exportable[name] = member;
		}
	},
	
	/**
	 * Define new WebbyJs class.
	 * 
	 * @method Class
	 * @memberof WebbyJs
	 * 
	 * @param {Object} options - class definition options.
	 * 
	 * var optionsExample = {
	 *    name: 'ClassName',
	 *    extend: parentClassReference,
	 * 	  construct: function ClassName(args) { ... },
	 * 	  proto: { prototype },
	 * 	  implement: [interfaceRferencesArr] || interfaceReference,
	 * 	  statics: { static members }.
	 *    noExport: true || false
	 * };
	 */
	Class: function(options) {
		this.validate(options, 'Object');
		this.validate(options.name);
		
		var members = {}, opt = { newClass: true, noExport: options.noExport };
		members[options.name] = options.construct;
		
		this.define(members, opt);
		
		this[options.name].statics(options.statics).
						   extend(options.extend || this.WObject).
						   implement(options.implement).
						   implement(options.proto);
	},
	
	/**
	 * Export WebbyJs members to global object - 'window' in browser.
	 * 
	 * @method export
	 * @memberof WebbyJs
	 * 
	 * @param {String} name - member name. If ommited - all members are extracted.
	 */
	export: function(name) {
		var exportable = this._exportable;
		
		if (name) {
			if (!exportable[name]) this.error('WebbyJs.' + name + ' does not exist or can not be exported');
			if (window[name]) this.error(name + ' allready exists in global object');
			
			window[name] = this[name];
		} else {
			for (name in exportable) if (exportable.hasOwnProperty(name)) {
				if (window[name]) this.error(name + ' allready exists in global object');
				window[name] = this[name];
			}
		}
	}
};
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
	 * @returns {WObject} created instance.
	 */
	create: function() {
		return new this();
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
			console.log(p + ":" + WebbyJs.classOf(this[p]) + " = " + this[p]);
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
/**
 * @file WebbyJs events interface and basic event types.
 * @author Olegos <olegos83@yandex.ru>
 */
WebbyJs.define({
	/**
	 * Mouse event types.
	 * 
	 * @memberof WebbyJs
	 * @enum {String}
	 */
	Mouse: {
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
	Keyboard: {
	    DOWN: 'keydown',
	    UP: 'keyup'
	}
});

/**
 * EventListener interface provides events processing support.
 * 
 * To add events support, inherit or extend class with EventListener
 * and declare '_handlers' object in its constructor.
 * 
 * @class EventListener
 * @extends WObject
 * 
 * @memberof WebbyJs
 */
WebbyJs.Class({
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
		this._handlers = {};
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
			if (!this._handlers[type]) {
				this._handlers[type] = [handler];
			} else {
				var e = this._handlers[type], l = e.length, i;
				
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
		    if (!handler || !this._handlers[type]) {
		    	this._handlers[type] = [];
		    } else {
		    	var e = this._handlers[type], l = e.length, i;
		    	
		    	for (i = 0; i < l; i++) {
		    		if (e[i] == handler) { e.splice(i, 1); return this; }
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
		    if (this._handlers[evt.type]) {
		    	var e = this._handlers[evt.type], l = e.length, i;
		    	for (i = 0; i < l; i++) e[i].call(this, evt);
		    }
		    
		    return this;
		},
		
		/**
		 * Clear all event handlers and reset EventListener to default state.
		 * 
		 * @method resetEvents
		 * @memberof EventListener.prototype
		 * 
		 * @returns {EventListener} current instance for chaining.
		 */
		resetEvents: function(evt) {
			this._handlers = {};
			return this;
		}
	}
});
/**
 * @file A wrapper for array to manage event driven data.
 * @author Olegos <olegos83@yandex.ru>
 */
WebbyJs.define({
	/**
	 * Data event types.
	 * 
	 * @memberof WebbyJs
	 * @enum {String}
	 */
	Data: {
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
 * declare 'dp_storage' array in class constructor and you can alias 'dp_storage'
 * with more convinient name, 'points' or 'children' for example:
 * 
 * 		this.children = this.dp_storage = [];
 * 
 * Event support can slow down items iteration, so you can directly use 'dp_storage' array
 * to get more iteration speed, but in that case, events must be processed manually.
 * 
 * @class DataProvider
 * @extends WObject
 * 
 * @memberof WebbyJs
 */
WebbyJs.Class({
	/**
	 * Class name.
	 */
	name: 'DataProvider',
	
	/**
	 * @constructor
	 */
	construct: function DataProvider() {
		/**
		 * Events hash, containing arrays of functions by event type as key.
		 * 
		 * @memberof EventListener
		 * @type {Object}
		 * 
		 * @private
		 */
		this._handlers = {};
		
		/**
		 * Data array.
		 * 
		 * @memberof DataProvider
		 * @type {Array}
		 */
		this.dp_storage = [];
	},
	
	/**
	 * Interfaces.
	 */
	implement: WebbyJs.EventListener,
	
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
		 * @returns {Boolean} true, if item is in data provider or false otherwise.
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
	}
});
