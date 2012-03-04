/*
* Layer by OlegoS. Jan 18, 2012
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
* Layer class - Layer represents a canvas and takes its context to draw objects.
* Layer can contain objects and object groups. Also, it can be static or animatable.
* You can assign layer to existing canvas or create new canvas for it.
* Layer can draw shapes to its context and set context options.
*
* @class Layer
* @author OlegoS
*
* @constructor
* @param {String} id - canvas id, if you assign layer to existing canvas. If there
*                      is no such id, new canvas with this id will be created, using
*                      next params:
* @param {Element} elem - Element which contains canvas - parent element.
* @param {Number} x - X position of layer(and its canvas).
* @param {Number} y - Y position of layer(and its canvas).
* @param {Number} width - width of layer(and its canvas).
* @param {Number} height - height of layer(and its canvas).
**/
var Layer = function(id, elem, x, y, width, height) {
//DO NOT USE PRIVATE PROPERTIES DIRECTLY - RESULT IS UNPREDICTABLE
//private properties:
        /**
         * Visibility flag.
         * @property _visible
         * @type Boolean
         * @private
         **/
         this._visible = true;
         
         /**
         * Redraw flag. If dirty - layer will be redrawn.
         * @property _dirty
         * @type Boolean
         * @private
         **/
         this._dirty = false;
         
         /**
         * Animation fps. If 0 - layer is not redrawn.
         * @property _fps
         * @type Number
         * @private
         **/
         this._fps = 0;
         this._fpsid = null; //redraw interval id

         /**
         * Objects array. The order is z-index - objects are drawn from 0 to _objArr.length.
         * @property _objArr
         * @type {Array}
         * @private
         **/
         this._objArr = new Array();
         
         /**
          * Event listener instance - to workout events
          * @property _eventListener
          * @type EventListener
          * @private
          **/
          this._eventListener = new EventListener();
        
        
//public properties:
       /**
        * Reference to parent layer.
        * @property layer
        * @type Layer
        **/
        this.layer = null;
        
        /**
         * Layers canvas reference.
         * @property canvas
         * @type Canvas
         **/
        this.canvas = document.getElementById(id);
        
        //if no canvas with specified id - create new one
        if (!this.canvas) {
            this.canvas = Dom.create('canvas', id, 'absolute', x, y); 
            this.setSize(width, height);
            elem.appendChild(this.canvas);
        }
        
        /**
         * Layers canvas context reference.
         * @property ctx
         * @type Context
         **/
        this.ctx = this.canvas.getContext("2d");
        
        //init event handlers
        var self = this;
        
        //mouse down
        var onMouseDown = function(e) {
        	//prepare event object
            var mx = e.pageX - self.canvas.offsetLeft;
            var my = e.pageY - self.canvas.offsetTop;
 
            var event_obj = {
                event:e,
                pos:{x:mx, y:my}
            };
            
            //provess event
            var obj = self.getObjectUnderPoint({x:mx, y: my}) || self;
        	event_obj.target = obj;
            obj.processEvent(MouseEvent.DOWN, event_obj);
        }
        
        //mouse move
        var onMouseMove = function(e) {
        	//process draggable
        	Draggable.onmousemove(e);
        	
            //prepare event object
        	var mx = e.pageX - self.canvas.offsetLeft;
            var my = e.pageY - self.canvas.offsetTop;
            
            var event_obj = {
                event:e,
                pos:{x:mx, y:my}
            };
            
            //provess event
            var obj = self.getObjectUnderPoint({x:mx, y: my}) || self;
        	event_obj.target = obj;
            obj.processEvent(MouseEvent.MOVE, event_obj);
        }
        
        //mouse up
        var onMouseUp = function(e) {
        	//process draggable
        	Draggable.onmouseup(e);
        	
        	//prepare event object
            var mx = e.pageX - self.canvas.offsetLeft;
            var my = e.pageY - self.canvas.offsetTop;
            
            var event_obj = {
                event:e,
                pos:{x:mx, y:my}
            };
            
            //provess event
            var obj = self.getObjectUnderPoint({x:mx, y: my}) || self;
        	event_obj.target = obj;
            obj.processEvent(MouseEvent.UP, event_obj);
        }
        
        //mouse click
        var onClick = function(e) {
        	//prepare event object
            var mx = e.pageX - self.canvas.offsetLeft;
            var my = e.pageY - self.canvas.offsetTop;
            
            var event_obj = {
                event:e,
                pos:{x:mx, y:my}
            };
            
            //provess event
            var obj = self.getObjectUnderPoint({x:mx, y: my}) || self;
        	event_obj.target = obj;
            obj.processEvent(MouseEvent.CLICK, event_obj);
        }
        
        //mouse dblclick
        var onDblClick = function(e) {
        	//prepare event object
            var mx = e.pageX - self.canvas.offsetLeft;
            var my = e.pageY - self.canvas.offsetTop;
            
            var event_obj = {
                event:e,
                pos:{x:mx, y:my},
            };
            
            //provess event
            var obj = self.getObjectUnderPoint({x:mx, y: my}) || self;
        	event_obj.target = obj;
            obj.processEvent(MouseEvent.DBLCLICK, event_obj);
        }
        
        //start events processing
        Dom(this.canvas).addEvents({
        	mousedown: onMouseDown,
        	mousemove: onMouseMove,
        	mouseup: onMouseUp,
        	click: onClick,
        	dblclick: onDblClick
        });
}


//public methods:
	/**
	 * Add event listener for specified event type.
	 * @method addEventListener
	 * @param {String} eventType - type of event.
	 * @param {Function} listener - event handler.
	 **/
	Layer.prototype.addEventListener = function(eventType, listener) {
	    this._eventListener.addEventListener(eventType, listener);
	}
	
	/**
	 * Remove event listener for specified event type.
	 * @method removeEventListener
	 * @param {String} eventType - type of event.
	 * @param {Function} listener - event handler.
	 **/
	Layer.prototype.removeEventListener = function(eventType, listener) {
	    this._eventListener.removeEventListener(eventType, listener);
	}
	
	/**
	 * Call listeners for specified event type.
	 * @method processEvent
	 * @param {String} eventType - type of event.
	 * @param {String} arg - argument for event listener.
	 **/
	Layer.prototype.processEvent = function(eventType, arg) {
	    this._eventListener.processEvent(eventType, arg);
	}

    /**
     * Set layer position.
     * @method setPosition
     * @param {Point} pos - position of the layer.
     **/
    Layer.prototype.setPosition = function(pos) {
        Dom(this.canvas).placeTo(pos);
    }

    /**
     * Get layer position.
     * @method getPosition
     * @return {Point} - position of the layer.
     **/
    Layer.prototype.getPosition = function() {
        return new Point(parseInt(this.canvas.style.left), parseInt(this.canvas.style.top));
    }
    
    /**
     * Set layer size. 
     * @method setSize
     * @param {Number} width - width.
     * @param {Number} height - height.
     **/
    Layer.prototype.setSize = function(width, height) {
    	Dom(this.canvas).prop({width: width, height: height});
        this._dirty = true;
    }

    /**
     * Get layer size.
     * @method getSize
     * @return {Object} - size object - {width:width, height:height}
     **/
    Layer.prototype.getSize = function() {
        return {width:this.canvas.width, height:this.canvas.height};
    }
    
    /**
     * Get layer center.
     * @method getCenter
     * @return {Point} - center point.
     **/
    Layer.prototype.getCenter = function() {
        var s = this.getSize();
        return new Point(s.width / 2, s.height / 2);
    }

    /**
     * Show/Hide layer.
     * @method visible
     * @param {Boolean} flag - can be true or false.
     * @return {Boolean} if called without arguments returns current visibility flag.
     **/
    Layer.prototype.visible = function(flag) {
        if (arguments.length == 0) return this._visible;
        
        if (flag) {
            this._visible = true;
            this.canvas.style.display = 'block';
        } else {
            this._visible = false;
            this.canvas.style.display = 'none';
        }
    }
    
    /**
     * Set fps of layer animation. If 0 - animation is disabled.
     * @method setFps
     * @param {Number} fps - frames per second.
     * @return {Number} if called without arguments returns current fps.
     **/
    Layer.prototype.setFps = function(fps) {
        if (arguments.length == 0) return this._fps;
        
        if (this._fpsid != null) window.clearInterval(this._fpsid);
        this._fps = fps;
        
        if (fps > 0) {
            var self = this;
            self._fpsid = window.setInterval(function(){self.draw();}, 1000 / fps);
        }
    }

    /**
     * Add object to this layer. Object is added to the top.
     * @method addObject
     * @param {Object} obj - object to add.
     **/
    Layer.prototype.addObject = function(obj) {
        var last = this.getNumObjects();
        this.addObjectAt(obj, last);
    }
    
    /**
     * Add object to this layer to specified index position.
     * @method addObjectAt
     * @param {Object} obj - object to add.
     * @param {Number} at - index.
     **/
    Layer.prototype.addObjectAt = function(obj, at) {
        obj.layer = this;
        this._objArr.splice(at, 0, obj);
        this._dirty = true;
    }
    
    /**
     * Remove object from this layer.
     * @method removeObject
     * @param {Object} obj - object to remove.
     **/
    Layer.prototype.removeObject = function(obj) {
        var index = this.getObjectIndex(obj);
        if (index == -1) return;
        this.removeObjectAt(index);
    }
    
    /**
     * Remove object from this layer from specified index position.
     * @method removeObjectAt
     * @param {Number} at - index.
     **/
    Layer.prototype.removeObjectAt = function(at) {
        if (at >= this.getNumObjects()) return;
        this._objArr.splice(at, 1);
        this._dirty = true;
    }
    
    /**
     * Get object at specified index in this layer.
     * @method getObjectAt
     * @param at - index to search.
     * @return {Object} object or null if object is not there.
     **/
    Layer.prototype.getObjectAt = function(at) {
        if (at >= this.getNumObjects()) return null;
        return this._objArr[at];
    }
    
    /**
     * Get object under poit. Object must implement hasPoint method to test point.
     * @method getObjectUnderPoint
     * @param {Point} p - point to test.
     * @return {Object} - the most top object under point or null if there is no object.
     **/
    Layer.prototype.getObjectUnderPoint = function(p) {
        var len = this.getNumObjects();
        
        for (var i = len - 1; i >= 0; i--) {
            var obj = this.getObjectAt(i);
            if (obj.hasPoint(p)) return obj;
        }
        
        return null;
    }
    
    /**
     * Set object index. Object is moved to specified index in layer.
     * @method setObjectIndex
     * @param {Object} obj - object reference.
     * @param {Number} index - new object index.
     **/
    Layer.prototype.setObjectIndex = function(obj, index) {
        this.removeObject(obj);
        this.addObjectAt(obj, index);
    }
    
    /**
     * Get object index.
     * @method getObjectIndex
     * @param {Object} obj - object to search.
     * @return {Number} index of specified object or -1 if there is no object.
     **/
    Layer.prototype.getObjectIndex = function(obj) {
        var len = this.getNumObjects();
        
        for (var i = 0; i < len; i++) {
            if (this._objArr[i] == obj) return i;
        }
        
        return -1;
    }
    
    /**
     * Get number of objects in this layer.
     * @method getNumObjects
     * @return {Number} number of objects.
     **/
    Layer.prototype.getNumObjects = function() {
        return this._objArr.length;
    }
    
    /**
     * Remove all objects from this layer.
     * @method clear
     **/
    Layer.prototype.clear = function() {
        this._objArr = [];
        this._dirty = true;
    }
    
    /**
     * Force redraw of this layer.
     * @method forceRedraw
     **/
    Layer.prototype.forceRedraw = function() {
        this._dirty = true;
        if (this._fps == 0) this.draw();
    }
    
    /**
     * Draw this layer. If animated - layer is drawn by specified interval.
     * Objects must have draw method to be drawn. They are drawn in z order.
     * @method draw
     **/
    Layer.prototype.draw = function() {
        if (!this._visible) return;
        if (!this._dirty) return;
        
        var len = this._objArr.length;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (var i = 0; i < len; i++) {
            this._objArr[i].draw();
        }
        
        this._dirty = false;
    }
    
    /**
     * Draw any shape, defined in Geometry. Path is processed even if no stroke
     * or fill is specified.
     * @method drawShape
     * @param {String} stroke - stroke color. "" - no stroke.
     * @param {String} fill - fill color. "" - no fill.
     * @param {Object} shape - shape to draw.
     **/
    Layer.prototype.drawShape = function(stroke, fill, shape) {
        //init vars
        var ctx = this.ctx;
        var i;
        
        //draw shape
        //if Line - convert it to PolyLine
        if (shape instanceof Line) shape = shape.toPolyLine();
        
        //if Rectangle - convert it to Polygon
        if (shape instanceof Rectangle) shape = shape.toPolygon();
        
        //process polyline or polygon
        if ( (shape instanceof PolyLine) || (shape instanceof Polygon) ) {
            var numPoints = shape.pointsArr.length;
            
            ctx.beginPath();
            ctx.moveTo(shape.pointsArr[0].x, shape.pointsArr[0].y);
            
            for (i = 1; i < numPoints; i++) ctx.lineTo(shape.pointsArr[i].x, shape.pointsArr[i].y);
            if (shape instanceof Polygon) ctx.lineTo(shape.pointsArr[0].x, shape.pointsArr[0].y);
  
            if (stroke != "") {
                ctx.strokeStyle = stroke;
                ctx.stroke();
            }
            
            if (fill != "") {
                ctx.fillStyle = fill;
                ctx.fill();
            }
            
            ctx.closePath();
        }
    }
    
    /**
     * Returns a clone of this Layer.
     * @method clone
     * @return {Layer} a clone of this Layer.
     **/
    Layer.prototype.clone = function() {
        var id = this.canvas.id + '_copy';
        var elem = this.canvas.parentNode;
        var pos = this.getPosition();
        var size = this.getSize();
        
        var newLayer = new Layer(id, elem, pos.x, pos.y, size.width, size.height);
        newLayer.visible(this.visible());
        
        var len = this.getNumObjects();
        for (var i = 0; i < len; i++) newLayer.addObject(this.getObjectAt(i).clone());
        
        return newLayer;
    }
    
    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of this object.
     **/
    Layer.prototype.toString = function() {
        return "[Layer(id:" + this.canvas.id + ", numObjects:" + this.getNumObjects() + ")]";
    }
