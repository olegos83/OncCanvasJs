/*
* Line by OlegoS. Jan 4, 2012
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
    