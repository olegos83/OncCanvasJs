/*
* Bitmap by OlegoS. Feb 21, 2012
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
     * Draw function. Is called by layer to draw this Bitmap.
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
     * Returns a clone of this Bitmap.
     * @method clone
     * @return {Bitmap} a clone of this Bitmap.
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
    