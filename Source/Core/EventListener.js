/**
 * @file The implementation of WebbyJs class creation.
 * @author Olegos <olegos83@yandex.ru>
 */

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

/*
 * EventListener by OlegoS, 09 Apr 2013
 *
 * Event manager for objects and data driven structures.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * EventListener is used to manage events for objects and data. User can define his own events.
	 *
	 * @class EventListener
	 * @author OlegoS
	 *
	 * @constructor
	 **/
	var EventListener = function() {
		/**
		 * Events container. All events are stored in arrays of functions.
		 * 
		 * @property _events
		 * @type Object
		 * 
		 * @private
		 **/
		this._events = {};
	}
	
	
//STATIC
	/**
	 * Mouse event types.
	 **/
	var MouseEvent = {
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
	
	/**
	 * Keyboard event types.
	 **/
	var KeyEvent = {
	    KEYDOWN: 'keydown',
	    KEYUP: 'keyup'
	};
	
//PROTOTYPE
	//get prototype reference
	var p = EventListener.prototype;
	
	/**
	 * Add event listener for specified event type.
	 * 
	 * @method addEventListener
	 * @param {String} eventType - type of event.
	 * @param {Function} listener - event handler.
	 **/
	p.addEventListener = function(eventType, listener) {
		if (!listener) return;
		var events = this._events[eventType];
		
		if (!events) this._events[eventType] = [listener]; else {
			for (var i = 0, l = events.length; i < l; i++) if (events[i] == listener) return;
			events.push(listener);
		}
	}

	/**
	 * Remove event listener for specified event type.
	 * 
	 * @method removeEventListener
	 * @param {String} eventType - type of event.
	 * @param {Function} listener - event handler.
	 **/
	p.removeEventListener = function(eventType, listener) {
	    var events = this._events[eventType]; if (!events) return;
	    
	    if (!listener) this._events[eventType] = []; else {
	    	for (var i = 0, l = events.length; i < l; i++) if (events[i] == listener) { events.splice(i, 1); return; }
	    }
	}

	/**
	 * Call listeners for specified event type.
	 * 
	 * @method processEvent
	 * @param {Object} e - event object.
	 **/
	p.processEvent = function(e) {
	    var events = this._events[e.type];
	    if (events) for (var i = 0, l = events.length; i < l; i++) events[i].call(this, e);
	}
	
	//set up for global use
	window.MouseEvent = MouseEvent;
	window.KeyEvent = KeyEvent;
	window.EventListener = EventListener;
}() );
