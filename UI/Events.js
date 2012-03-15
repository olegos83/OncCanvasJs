/*
* Events by OlegoS. Feb 8, 2012
*
* Copyright (c) 2012 OlegoS
*
* See license information in readme file.
*/

/**
* OncCanvasJs is a framework to work with html5 canvas. It can be used to write
* games or any other web-applications, which use canvas graphics.
* @module OncCanvasJs
**/


/**
* Events is a set of classes-helpers to identify dom and layer events.
* In these helpers there are defined string constants for event types, draggable
* behaviour and so on.
**/


/**
 * Mouse event types
 **/
var MouseEvent = {
    CLICK:'click',
    DBLCLICK:'dblclick',
    DOWN:'mousedown',
    MOVE:'mousemove',
    UP:'mouseup',
    OVER:'mouseover',
    OUT:'mouseout',
    DRAGSTART:'dragstart',
    DRAG:'drag',
    DRAGEND:'dragend'
};


/**
 * Keyboard event types
 **/
var KeyEvent = {
    KEYDOWN:'keydown',
    KEYUP:'keyup'
};


/**
 * Dom drag helper object - for DOM elements.
 * This class is not used directly - use it by Dom methods.
 * 
 * @class DomDrag
 * @author OlegoS
 *
 * @constructor
 * @param {Element} element - element to drag.
 * @param {Function} startCallback - startdrag handler.
 * @param {Function} moveCallback - drag handler.
 * @param {Function} endCallback - dragend handler.
 * @param {Element} attachElement - element, attached to drag on.
 * @param {Rectangle} bounds - drag bounds.
 **/
var DomDrag = function(element, startCallback, moveCallback, endCallback, attachElement, bounds) {
//DO NOT USE PRIVATE PROPERTIES DIRECTLY - RESULT IS UNPREDICTABLE
//private properties:
    /**
     * Drag element.
     * @property _element
     * @type {Element}
     * @private
     **/
    this._element = element;
    
    /**
     * Attached element to drag on.
     * @property _attached
     * @type {Element}
     * @private
     **/
    this._attached = attachElement;
    
    /**
     * Drag handlers.
     * @property _handlers
     * @type {Object}
     * @private
     **/
    this._handlers = {start: startCallback, drag: moveCallback, stop: endCallback};
    
    /**
     * Drag bounds.
     * @property _bounds
     * @type {Rectangle}
     * @private
     **/
    this._bounds = bounds;
    
    /**
     * Positions.
     * @property _pos
     * @type {Object}
     * @private
     **/
    this._pos = {cursor: null, element: null};
    
    /**
     * Drag flag.
     * @property _drag
     * @type {Boolean}
     * @private
     **/
    this._drag = false;
    
    //init drag
	if(!this._attached) this._attached = this._element;
	Dom(this._attached).addEvent(MouseEvent.DOWN, this.dragStart);
	var self = this;

//private methods:
	/**
	 * Drag start handler.
	 * @method _start
	 * @param {Event} e - event.
	 * @return {Boolean} false for browser.
	 **/
	this._start = function(e) {
		if (self._drag) return;
		dragging = true;

		if(startCallback != null) startCallback(eventObj, element);

		cursorStartPos = Dom.absEventMousePos(eventObj);
		elementStartPos = Dom(element).pos();

		Dom(document).addEvent(MouseEvent.MOVE, dragGo).addEvent(MouseEvent.UP, dragStop);
		return Dom.cancelEvent(eventObj);
	}
	
	/**
	 * Drag go handler.
	 * @method _go
	 * @param {Event} e - event.
	 * @return {Boolean} false for browser.
	 **/
	this._go = function(e) {
		if (!dragging) return;
	    
	    var newPos = Dom.absEventMousePos(eventObj);
	    newPos.move(elementStartPos.x, elementStartPos.y);
	    newPos.move(-cursorStartPos.x, -cursorStartPos.y);
	    newPos.checkBounds(bounds);
	    Dom(element).pos(newPos);
	    
	    if(moveCallback != null) moveCallback(newPos, element);
	    return Dom.cancelEvent(eventObj);
	}
	
	/**
	 * Drag stop handler.
	 * @method _stop
	 * @param {Event} e - event.
	 * @return {Boolean} false for browser.
	 **/
	this._stop = function(e) {
		if(!dragging) return;
	    Dom(document).removeEvent(MouseEvent.MOVE, dragGo).removeEvent(MouseEvent.UP, dragStop);
	    cursorStartPos = null;
	    elementStartPos = null;
	    if(endCallback != null) endCallback(element);
	    dragging = false;
	    return Dom.cancelEvent(eventObj);
	}
}


	
function dragObject(element, attachElement, bounds, startCallback, moveCallback, endCallback) {
	  if(typeof(element) == "string") element = document.getElementById(element);

	  var cursorStartPos = null;
	  var elementStartPos = null;
	  var dragging = false;
	  
	  if(typeof(attachElement) == "string") attachElement = document.getElementById(attachElement);
	  if(attachElement == null) attachElement = element;
	  Dom(attachElement).addEvent(MouseEvent.DOWN, dragStart);
	  
	  
	  function dragStart(eventObj) { 
			if (dragging) return;
			dragging = true;
			
			if(startCallback != null) startCallback(eventObj, element);
			
			cursorStartPos = Dom.absEventMousePos(eventObj);
			elementStartPos = Dom(element).pos();
			
			Dom(document).addEvent(MouseEvent.MOVE, dragGo).addEvent(MouseEvent.UP, dragStop);
			return Dom.cancelEvent(eventObj);
		  }
		  
		  function dragGo(eventObj) {
		    if (!dragging) return;
		    
		    var newPos = Dom.absEventMousePos(eventObj);
		    newPos.move(elementStartPos.x, elementStartPos.y);
		    newPos.move(-cursorStartPos.x, -cursorStartPos.y);
		    newPos.checkBounds(bounds);
		    Dom(element).pos(newPos);
		    
		    if(moveCallback != null) moveCallback(newPos, element);
		    return Dom.cancelEvent(eventObj);
		  }
		  
		  function dragStop(eventObj) {
		    if(!dragging) return;
		    Dom(document).removeEvent(MouseEvent.MOVE, dragGo).removeEvent(MouseEvent.UP, dragStop);
		    cursorStartPos = null;
		    elementStartPos = null;
		    if(endCallback != null) endCallback(element);
		    dragging = false;
		    return Dom.cancelEvent(eventObj);
		  }
	}


/**
 * Draggable helper object - for objects inside layer.
 **/
var Draggable = {
    //init vars
    obj: null,
    startx: 0,
    starty: 0,
    
    //mouse down
    onmousedown: function(e) {
    	Draggable.startx = e.pos.x;
        Draggable.starty = e.pos.y;
        Draggable.obj = e.target;
        
        e.type = MouseEvent.DRAGSTART;
        Draggable.obj.processEvent(e);
    },

    //mouse move
    onmousemove: function(e) {
        if (!Draggable.obj) return;

        var mx = e.pageX - Draggable.obj.layer.canvas.offsetLeft;
        var my = e.pageY - Draggable.obj.layer.canvas.offsetTop;
        
        var dx = mx - Draggable.startx;
        var dy = my - Draggable.starty;

        Draggable.obj.move(dx, dy);
        Draggable.obj.layer.forceRedraw();

        Draggable.startx += dx;
        Draggable.starty += dy;
        
        var evt = { pos:{x:mx, y:my}, target:Draggable.obj, type:MouseEvent.DRAG };
        Draggable.obj.processEvent(evt);
    },

    //mouse up
    onmouseup: function(e) {
        if (!Draggable.obj) return;
        
        var mx = e.pageX - Draggable.obj.layer.canvas.offsetLeft;
        var my = e.pageY - Draggable.obj.layer.canvas.offsetTop;

        var evt = { pos:{x:mx, y:my}, target:Draggable.obj, type:MouseEvent.DRAGEND };
        Draggable.obj.processEvent(evt);
        
        Draggable.obj = null;
    }
};


/**
* If EventListener is instantiated in object - object can process events.
* 
* @class EventListener
* @author OlegoS
*
* @constructor
**/
var EventListener = function() {
//DO NOT USE PRIVATE PROPERTIES DIRECTLY - RESULT IS UNPREDICTABLE
//private properties:
    /**
    * Events object. It is a container of all events. All events are stored
    * in an arrays of functions.
    * @property _events
    * @type Object
    * @private
    **/
    this._events = {};
    for (var e in MouseEvent) this._events[MouseEvent[e]] = [];
}


//public methods:
    /**
     * Add event listener for specified event type.
     * @method addEventListener
     * @param {String} eventType - type of event.
     * @param {Function} listener - event handler.
     **/
    EventListener.prototype.addEventListener = function(eventType, listener) {
        this._events[eventType].push(listener);
    }
    
    /**
     * Remove event listener for specified event type.
     * @method removeEventListener
     * @param {String} eventType - type of event.
     * @param {Function} listener - event handler.
     **/
    EventListener.prototype.removeEventListener = function(eventType, listener) {
        var eventsArr = this._events[eventType];
        var len = eventsArr.length;
        if (len == 0) return;
        
        if (listener) {
            for (var i = 0; i < len; i++) {
                if (eventsArr[i] == listener) {
                	eventsArr.splice(i, 1);
                	return;
                }
            }
        } else this._events[eventType] = [];
    }
    
    /**
     * Call listeners for specified event type.
     * @method processEvent
     * @param {Object} e - event object.
     **/
    EventListener.prototype.processEvent = function(e) {
        var eventsArr = this._events[e.type];
        var len = eventsArr.length;
        if (len == 0) return;
        
        for (var i = 0; i < len; i++) {
            eventsArr[i].call(this, e);
        }
    }
    