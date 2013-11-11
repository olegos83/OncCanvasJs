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
