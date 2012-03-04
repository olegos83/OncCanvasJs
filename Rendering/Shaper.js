/*
* Shaper by OlegoS. Feb 7, 2012
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
* Shaper class - Shaper is an object which represents geometry shape.
* Can be added to Layer.
* 
* @class Shaper
* @author OlegoS
*
* @constructor
* @param {String} id - string id of the Shaper. Default is "".
* @param {Object} shape - content of the Shaper. Default is null.
* @param {Object} color - color of the Shaper. Default is {stroke:"#000000", fill:"#ffffff"}.
**/
var Shaper = function(id, shape, color) {
//DO NOT USE PRIVATE PROPERTIES DIRECTLY - RESULT IS UNPREDICTABLE
//private properties:
    /**
    * Event listener instance - to workout events
    * @property _eventListener
    * @type EventListener
    * @private
    **/
    this._eventListener = new EventListener();


//public properties:
    /**
    * Shaper id.
    * @property id
    * @type String
    **/
    this.id = (id == null ? "" : id);

    /**
    * Content of object.
    * @property shape
    * @type Object
    **/
    this.shape = (shape == null ? null : shape);

    /**
    * Transformation matrix.
    * @property matrix
    * @type Matrix
    **/
    this.matrix = new Matrix();

    /**
    * Reference to parent layer.
    * @property layer
    * @type Layer
    **/
    this.layer = null;

    /**
    * Shaper visibility. Default is true.
    * @property visible
    * @type Boolean
    **/
    this.visible = true;

    /**
    * Shaper color in css notation. Default is {stroke:"#000000", fill:"#ffffff"}.
    * If stroke or fill is "" - it is not rendered.
    * @property color
    * @type Object
    **/
    this.color = (color == null ? {stroke:"#000000", fill:"#ffffff"} : color);
}


//public methods:
    /**
     * Add event listener for specified event type.
     * @method addEventListener
     * @param {String} eventType - type of event.
     * @param {Function} listener - event handler.
     **/
    Shaper.prototype.addEventListener = function(eventType, listener) {
        this._eventListener.addEventListener(eventType, listener);
    }
    
    /**
     * Remove event listener for specified event type.
     * @method removeEventListener
     * @param {String} eventType - type of event.
     * @param {Function} listener - event handler.
     **/
    Shaper.prototype.removeEventListener = function(eventType, listener) {
        this._eventListener.removeEventListener(eventType, listener);
    }
    
    /**
     * Call listeners for specified event type.
     * @method processEvent
     * @param {String} eventType - type of event.
     * @param {String} arg - argument for event listener.
     **/
    Shaper.prototype.processEvent = function(eventType, arg) {
        this._eventListener.processEvent(eventType, arg);
    }
    
    /**
     * Make object draggable.
     * @method draggable
     **/
    Shaper.prototype.startDrag = function() {
        this.addEventListener(MouseEvent.DOWN, Draggable.onmousedown);
    }
    
    /**
     * Stop object draggable ability.
     * @method stopDrag
     **/
    Shaper.prototype.stopDrag = function() {
        this.removeEventListener(MouseEvent.DOWN, Draggable.onmousedown);
    }
    
    /**
     * Get bounding rectangle.
     * @method getBoundRect
     * @return {Rectangle} - bounding rectangle.
     **/
    Shaper.prototype.getBoundRect = function() {
        var s = this.shape.clone();
        s.matrixTransform(this.matrix);
        return s.getBoundRect();
    }
    
    /**
     * Get center point.
     * @method getCenter
     * @return {Point} - center of shaper.
     **/
    Shaper.prototype.getCenter = function() {
        return this.getBoundRect().getCenter();
    }
    
    /**
     * Get width.
     * @method getWidth
     * @return {Number} - width of shaper.
     **/
    Shaper.prototype.getWidth = function() {
        return this.getBoundRect().getWidth();
    }
    
    /**
     * Get height.
     * @method getHeight
     * @return {Number} - height of shaper.
     **/
    Shaper.prototype.getHeight = function() {
        return this.getBoundRect().getHeight();
    }
    
    /**
     * Move Shaper by x/y deltas.
     * @method move
     * @param {Number} dx - X delta.
     * @param {Number} dy - Y delta.
     **/
    Shaper.prototype.move = function(dx, dy) {
        var m = new Matrix();
        m.setTranslation(dx, dy);
        this.matrix.multiply(m);
    }
    
    /**
     * Scale shaper.
     * @method scale
     * @param {Number} scX - x scale koef.
     * @param {Number} scY - y scale koef.
     * @param {Point} pivot - pivot to scale from.
     **/
    Shaper.prototype.scale = function(scX, scY, pivot) {
        var m = new Matrix();
        
        m.setTranslation(-pivot.x, -pivot.y);
        this.matrix.multiply(m);
        
        m.setScale(scX, scY);
        this.matrix.multiply(m);
        
        m.setTranslation(pivot.x, pivot.y);
        this.matrix.multiply(m);
    }
    
    /**
     * Rotate shaper.
     * @method rotate
     * @param {Number} angle - rotation angle (in radians).
     * @param {Point} pivot - pivot to rotate around.
     **/
    Shaper.prototype.rotate = function(angle, pivot) {
        var m = new Matrix();
        
        m.setTranslation(-pivot.x, -pivot.y);
        this.matrix.multiply(m);
        
        m.setRotation(angle);
        this.matrix.multiply(m);
        
        m.setTranslation(pivot.x, pivot.y);
        this.matrix.multiply(m);
    }
    
    /**
     * Mirror Shaper acording to orientation.
     * @method mirror
     * @param {String} orientation - 'horiz' - horizontal, 'vert' - vertical.
     **/
    Shaper.prototype.mirror = function(orientation) {
        this.shape.mirror.call(this, orientation);
    }
    
    /**
     * Returns a center point of this Shaper.
     * @method align
     * @param {String} base - align base: 'left', 'right', 'center', 'top', 'bottom', 'vert'.
     * @param {Rectangle} rect - align rectangle.
     **/
    Shaper.prototype.align = function(base, rect) {
        this.shape.align.call(this, base, rect);
    }
    
    /**
     * Place Shaper into specified rectangle.
     * @method placeIntoRect
     * @param {Rectangle} tR - the Rectangle.
     **/
    Shaper.prototype.placeIntoRect = function(tR) {
        this.shape.placeIntoRect.call(this, tR);
    }  
    
    /**
     * Place Shaper around specified Point.
     * @method placeAroundPoint
     * @param {Point} pt - Center point of the Shaper.
     * @param {Number} dist - distance from center to sides.
     **/
    Shaper.prototype.placeAroundPoint = function(pt, dist) {
        this.shape.placeAroundPoint.call(this, pt, dist);
    }
    
    /**
     * Test if point is inside the Shaper.
     * @method hasPoint
     * @param {Point} p - point to test.
     * @return {Boolean} - true if point is inside and false otherwise.
     **/
    Shaper.prototype.hasPoint = function(p) {
        //if can't be drawn return
        if (!this.layer) return;
        if (!this.visible) return;
        
        //setup path and test point
        var ctx = this.layer.ctx;
        var m = this.matrix;
        
        ctx.save();
        ctx.setTransform(m[0][0], m[0][1], m[1][0], m[1][1], m[2][0], m[2][1]);
        this.layer.drawShape("", "", this.shape);
        ctx.restore();
        
        //return result
        var result = this.layer.ctx.isPointInPath(p.x, p.y);
        return result;
    }

    /**
     * Draw function. Is called by layer to draw this Shaper.
     * @method draw
     **/
    Shaper.prototype.draw = function() {
        //if can't be drawn return
        if (!this.layer) return;
        if (!this.visible) return;
        
        //draw shape
        var ctx = this.layer.ctx;
        var m = this.matrix;
        
        ctx.save();
        ctx.setTransform(m[0][0], m[0][1], m[1][0], m[1][1], m[2][0], m[2][1]);
        this.layer.drawShape(this.color.stroke, this.color.fill, this.shape);
        ctx.restore();
    }

    /**
     * Returns a clone of this Shaper.
     * @method clone
     * @return {Shaper} a clone of this Shaper.
     **/
    Shaper.prototype.clone = function() {
        var sh = new Shaper('copy_' + this.id, this.shape.clone(), {stroke:this.color.stroke, fill:this.color.fill});
        sh.matrix.multiply(this.matrix);
        return sh;
    }

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of this object.
     **/
    Shaper.prototype.toString = function() {
        return "[Shaper(id:" + this.id + ")]";
    }
