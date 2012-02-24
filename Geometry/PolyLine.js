/*
* PolyLine by OlegoS. Jan 4, 2012
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
    