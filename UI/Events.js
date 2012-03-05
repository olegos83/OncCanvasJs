/*
* Events by OlegoS. Feb 8, 2012
*
* Copyright (c) 2012 OlegoS
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
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
    