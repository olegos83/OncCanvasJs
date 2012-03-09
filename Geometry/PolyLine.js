/*
* PolyLine by OlegoS. Jan 4, 2012
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
* PolyLine class - PolyLine implementation in 2D coordinate system.
* Has an array of points, which are connected from 0 to last.
*
* @class PolyLine
* @author OlegoS
*
* @constructor
* @param {Array} pointsArr - points array. Default is empty array.
**/
var PolyLine = function(pointsArr) {
//public properties:
    /**
     * PolyLine points array.
     * @property pointsArr
     * @type Array
     **/
	this.pointsArr = (pointsArr == null ? new Array() : pointsArr);
}


//public methods:
    /**
     * Returns a clone of this PolyLine.
     * @method clone
     * @return {PolyLine} a clone of this PolyLine.
     **/
    PolyLine.prototype.clone = function() {
        var tmpArr = new Array();

        var l = this.pointsArr.length;
        for (var i = 0; i < l; i++) tmpArr.push(this.pointsArr[i].clone());

        return new PolyLine(tmpArr);
    }

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of this object.
     **/
    PolyLine.prototype.toString = function() {
        return "[PolyLine(numPoints:" + this.pointsArr.length + ")]";
    }
    