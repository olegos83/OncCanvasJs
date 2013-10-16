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
