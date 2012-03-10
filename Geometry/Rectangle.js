/*
* Rectangle by OlegoS. Jan 4, 2012
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
* Rectangle implementation in 2D coordinate system.
* Has two points: from - up left point, to - bottom right point.
* Rectangle is very important in geometry and rendering calculations.
*
* @class Rectangle
* @super Path
* @author OlegoS
*
* @constructor
* @param {Point} from - up left point. Default is Point(0, 0).
* @param {Point} to - bottom right point. Default is Point(0, 0).
**/
var Rectangle = function(from, to) {
//public properties:
    /**
     * Up left point of rectangle.
     * @property from
     * @type Point
     **/
	this.from = (from == null ? new Point(0, 0) : from);

    /**
     * Bottom right point of rectangle.
     * @property to
     * @type Point
     **/
	this.to = (to == null ? new Point(0, 0) : to);
	
//initialize base class
    Path.call(this, [this.from, this.to]);
}

//extend, set constructor and delete unnessesary properties
Rectangle.prototype = new Path();
Rectangle.prototype.constructor = Path;
delete Rectangle.prototype.pointsArr;

//public methods:
    /**
     * Returns top right point of this Rectangle.
     * @method topRight
     * @return {Point} top right point of this Rectangle.
     **/
    Rectangle.prototype.topRight = function() {
        return new Point(this.to.x, this.from.y);
    }

    /**
     * Returns bottom left right point of this Rectangle.
     * @method botLeft
     * @return {Point} bottom left point of this Rectangle.
     **/
    Rectangle.prototype.botLeft = function() {
        return new Point(this.from.x, this.to.y);
    }

    /**
     * Returns width of this Rectangle.
     * @method getWidth
     * @return {Number} width of this Rectangle.
     **/
    Rectangle.prototype.getWidth = function() {
        return this.to.x - this.from.x;
    }

    /**
     * Returns height of this Rectangle.
     * @method getHeight
     * @return {Number} height of this Rectangle.
     **/
    Rectangle.prototype.getHeight = function() {
        return this.to.y - this.from.y;
    }

    /**
     * Returns a center point of this Rectangle.
     * @method getCenter
     * @return {Point} a center point of this Rectangle.
     **/
    Rectangle.prototype.getCenter = function() {
        var cx = (this.from.x + this.to.x) / 2;
        var cy = (this.from.y + this.to.y) / 2;
        return new Point(cx, cy);
    }
    
    /**
     * Returns a bounding rectangle of this Rectangle.
     * @method getBoundRect
     * @return {Rectangle} bounding Rectangle (clone of this Rectangle).
     **/
    Rectangle.prototype.getBoundRect = function() {
        return this.clone();
    }
    
    /**
     * Place rectangle around specified Point.
     * @method placeAroundPoint
     * @param {Point} pt - Center point of the Rectangle.
     * @param {Number} dist - distance from center to sides.
     **/
    Rectangle.prototype.placeAroundPoint = function(pt, dist) {
    	this.from.x = this.to.x = pt.x; this.from.y = this.to.y = pt.y; 
        this.from.move(-dist, -dist); this.to.move(dist, dist);
    }
    
    /**
     * Place rectangle into specified rectangle.
     * @method placeIntoRect
     * @param {Rectangle} rect - the Rectangle.
     **/
    Rectangle.prototype.placeIntoRect = function(rect) {
    	this.from.set(rect.from); this.to.set(rect.to);
    }
    
    /**
     * Set 'from' point up left to 'to' point.
     * @method normalize
     **/
    Rectangle.prototype.normalize = function() {
        var r = this.toPolygon().getBoundRect();
        this.placeIntoRect(r);
    }

    /**
     * Returns true if point is inside this Rectangle.
     * @method hasPoint
     * @param {Point} pt - point to test.
     * @return {Boolean} true if point is inside this Rectangle.
     **/
    Rectangle.prototype.hasPoint = function(pt) {
        if ((this.from.x <= pt.x) && (pt.x <= this.to.x) && (this.from.y <= pt.y) && (pt.y <= this.to.y)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Clone this Rectangle.
     * @method clone
     * @return {Rectangle} a cloned Rectangle.
     **/
    Rectangle.prototype.clone = function() {
        return new Rectangle(this.from.clone(), this.to.clone());
    }

    /**
     * Convert this Rectangle to Polygon.
     * @method toPolygon
     * @return {Polygon} result Polygon.
     **/
    Rectangle.prototype.toPolygon = function() {
        return new Polygon([this.from.clone(), this.topRight(), this.to.clone(), this.botLeft()]);
    }

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of this object.
     **/
    Rectangle.prototype.toString = function() {
        return "[Rectangle(from:" + this.from.toString() + ", to:" + this.to.toString() + ")]";
    }
    