/*
* Line by OlegoS. Jan 4, 2012
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
* Line class - base line implementation in 2D coordinate system.
* Has two points: from - start point, to - end point.
*
* @class Line
* @author OlegoS
*
* @constructor
* @param {Point} from - start point. Default is Point(0, 0).
* @param {Point} to - end point. Default is Point(0, 0).
**/
var Line = function(from, to) {
//public properties:
    /**
     * Start point of line.
     * @property from
     * @type Point
     **/
	this.from = (from == null ? new Point(0, 0) : from);

    /**
     * End point of line.
     * @property to
     * @type Point
     **/
	this.to = (to == null ? new Point(0, 0) : to);
}


//public methods
    /**
     * Returns a bounding rectangle of this Line.
     * @method getBoundRect
     * @return {Rectangle} a bounding rectangle of this Line.
     **/
    Line.prototype.getBoundRect = function() {
        return new Rectangle(this.from.clone(), this.to.clone());
    }
    
    /**
     * Returns a center point of this Line.
     * @method getCenter
     * @return {Point} a center point of this Line.
     **/
    Line.prototype.getCenter = function() {
        return this.getBoundRect().getCenter();
    }

    /**
     * Returns a Polyline from this Line.
     * @method toPolyLine
     * @return {PolyLine} a PolyLine from this Line.
     **/
    Line.prototype.toPolyLine = function() {
        return new PolyLine([this.from.clone(), this.to.clone()]);
    }

    /**
     * Returns a clone of this Line.
     * @method clone
     * @return {Line} a clone of this Line.
     **/
    Line.prototype.clone = function() {
        return new Line(this.from.clone(), this.to.clone());
    }

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of this object.
     **/
    Line.prototype.toString = function() {
        return "[Line(from:" + this.from.toString() + ", to:" + this.to.toString() + ")]";
    }
    