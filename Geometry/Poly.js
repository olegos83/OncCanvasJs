/*
* Poly by OlegoS. Jan 4, 2012
* Polygon and PolyLine classes are defined here.
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
* Polygon implementation in 2D coordinate system.
* Extends from Path.
*
* @class Polygon
* @super Path
* @author OlegoS
*
* @constructor
* @param {Array} pointsArr - points array. Default is empty array.
**/
var Polygon = function(pointsArr) {
	//initialize base class
    Path.call(this, pointsArr);
}

//extend from Shaper, set constructor and delete unnessesary properties
Polygon.prototype = new Path();
Polygon.prototype.constructor = Path;
delete Polygon.prototype.pointsArr;

//public methods:
    /**
     * Clone this Polygon.
     * @method clone
     * @return {Polygon} a cloned Polygon.
     **/
    Polygon.prototype.clone = function() {
        var pt = this.clonePoints();
        return new Polygon(pt);
    }

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of this object.
     **/
    Polygon.prototype.toString = function() {
        return "[Polygon(numPoints:" + this.pointsArr.length + ")]";
    }
    
    
/**
* PolyLine implementation in 2D coordinate system.
* Extends from Path.
*
* @class PolyLine
* @super Path
* @author OlegoS
*
* @constructor
* @param {Array} pointsArr - points array. Default is empty array.
**/
var PolyLine = function(pointsArr) {
	//initialize base class
    Path.call(this, pointsArr);
}

//extend from Shaper, set constructor and delete unnessesary properties
PolyLine.prototype = new Path();
PolyLine.prototype.constructor = Path;
delete PolyLine.prototype.pointsArr;

//public methods:
    /**
     * Clone this PolyLine.
     * @method clone
     * @return {PolyLine} a cloned PolyLine.
     **/
	PolyLine.prototype.clone = function() {
        var pt = this.clonePoints();
        return new PolyLine(pt);
    }

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of this object.
     **/
	PolyLine.prototype.toString = function() {
        return "[PolyLine(numPoints:" + this.pointsArr.length + ")]";
    }
    