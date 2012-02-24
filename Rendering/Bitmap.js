/*
* Bitmap by OlegoS. Feb 21, 2012
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
* Bitmap class - Bitmap is an object which represents image. Extends from Shaper.
* Can be added to Layer.
* 
* @class Bitmap
* @super Shaper
* @author OlegoS
*
* @constructor
* @param {String} id - string id of the Bitmap. Default is "".
* @param {String} src - source of image.
* @param {Number} width - image width.
* @param {Number} height - image height.
**/
var Bitmap = function(id, src, width, height) {
//initialize base class
    Shaper.call(this, id, new Rectangle(new Point(0, 0), new Point(width, height)).toPolygon());

//public properties:
    /**
     * Image in Bitmap.
     * @property image
     * @type {Image}
     **/
    this.image = new Image();
    this.image.src = src;
    this.image.width = width;
    this.image.height = height;
}

//extend from Shaper, set constructor and delete unnessesary properties
Bitmap.prototype = new Shaper();
Bitmap.prototype.constructor = Bitmap;
delete Bitmap.prototype._eventListener;


//public methods:
    /**
     * Draw function. Is called by layer to draw this Shaper.
     * @method draw
     **/
    Bitmap.prototype.draw = function() {
        //if can't be drawn return
        if (!this.layer) return;
        if (!this.visible) return;
        
        //draw shape
        var ctx = this.layer.ctx;
        var m = this.matrix;
        
        ctx.save();
        ctx.setTransform(m[0][0], m[0][1], m[1][0], m[1][1], m[2][0], m[2][1]);
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
        ctx.restore();
    }
    
    
    /**
     * Returns a clone of this Shaper.
     * @method clone
     * @return {Shaper} a clone of this Shaper.
     **/
    Bitmap.prototype.clone = function() {
        var b = new Bitmap('copy_' + this.id, this.image.src, this.image.width, this.image.height);
        b.matrix.multiply(this.matrix);
        return b;
    }

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of this object.
     **/
    Bitmap.prototype.toString = function() {
        return "[Bitmap(id:" + this.id + ")]";
    }
    