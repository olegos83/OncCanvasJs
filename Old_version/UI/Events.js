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
 * @param {Element} attached - element, attached to drag on.
 * @param {Rectangle} bounds - drag bounds.
 * @param {Function} startCallback - startdrag handler.
 * @param {Function} moveCallback - drag handler.
 * @param {Function} endCallback - dragend handler.
 **/
var DomDrag = function(element, attached, bounds, startCallback, moveCallback, endCallback) {
    //init vars
	var pos = {cursor: null, element: null};
    var drag = false;
    
    if (typeof(attached) == "string") attached = document.getElementById(attached);
    if (!attached) attached = element;
    
    //init drag
	Dom(attached).addEvent(MouseEvent.DOWN, start);

	//Drag start handler.
	function start(e) {
		if (drag) return;
		drag = true;
		
		if (startCallback) startCallback(e, element);
		pos.cursor = Dom.absEventMousePos(e);
		pos.element = Dom(element).pos();

		Dom(document).addEvent(MouseEvent.MOVE, go).addEvent(MouseEvent.UP, stop);
		return Dom.cancelEvent(e);
	}
	
	//Drag go handler.
	function go(e) {
		if (!drag) return;
	    
	    var newPos = Dom.absEventMousePos(e);
	    newPos.move(pos.element.x, pos.element.y);
	    newPos.move(-pos.cursor.x, -pos.cursor.y);
	    
	    if (bounds) newPos.checkBounds(bounds);
	    Dom(element).pos(newPos);
	    
	    if (moveCallback) moveCallback(newPos, element);
	    return Dom.cancelEvent(e);
	}
	
	//Drag stop handler.
	function stop(e) {
		if (!drag) return;
		drag = false;
		
	    Dom(document).removeEvent(MouseEvent.MOVE, go).removeEvent(MouseEvent.UP, stop);
	    pos.cursor = null; pos.element = null;
	    
	    if (endCallback) endCallback(element);
	    return Dom.cancelEvent(e);
	}
	
	//stop drag
	this.stopDrag = function() {
		//null all vars
		pos = element = attached = bounds = startCallback = moveCallback = endCallback = null;
		
		//remove listeners
		Dom(attached).removeEvent(MouseEvent.DOWN, start);
		Dom(document).removeEvent(MouseEvent.MOVE, go).removeEvent(MouseEvent.UP, stop);
	}
}


/**
 * Draggable helper object - for objects inside layer.
 **/
var Draggable = {
    //init vars
    obj: null,
    dragged: false,
    startx: 0,
    starty: 0,
    
    //mouse down
    onmousedown: function(e) {
    	Draggable.startx = e.pos.x;
    	Draggable.starty = e.pos.y;
        Draggable.obj = e.target;
    },

    //mouse move
    onmousemove: function(e) {
        if (!Draggable.obj) return;

        var mx = e.pageX - Draggable.obj.layer.canvas.offsetLeft;
        var my = e.pageY - Draggable.obj.layer.canvas.offsetTop;
        
        if ( (!Draggable.dragged) && ( (mx != Draggable.startx) || (my != Draggable.starty) ) ) {
        	Draggable.dragged = true;
        	Draggable.obj.processEvent({ pos:{x:Draggable.startx, y:Draggable.starty}, target:Draggable.obj, type:MouseEvent.DRAGSTART });
        }
        
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
        Draggable.dragged = false;
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
    