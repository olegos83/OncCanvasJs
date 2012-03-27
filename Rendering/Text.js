/*
* Text by OlegoS. Mar 27, 2012
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
* Text is an object which represents text on canvas. Extends from Shaper.
* Can be added to Layer.
* 
* @class Text
* @super Shaper
* @author OlegoS
*
* @constructor
* @param {String} id - string id of the Bitmap. Default is "".
* @param {String} text - text string. Default is "".
* @param {Object} font - font object. Default values are below.
* 				  var font = {
* 					face: "Verdana",  //css font-face
* 				 	size: "12px",     //css font-size
* 				 	weight: "normal", //normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit|auto
* 					style: "normal"   //normal|italic|oblique|inherit
* 				  }
**/
var Text = function(id, text, font) {
//public properties:
    /**
     * Text string.
     * @property text
     * @type {String}
     **/
    this.text = (text == null ? "" : text);
    
    /**
     * Font object.
     * @property fontFace
     * @type {String}
     **/
    this.font = { face: "Verdana", size: "12px", weight: "normal", style: "normal" };
    if (font) for (var f in font) this.font[f] = font[f];
    
//measure initial text size
    var ctx = Dom.create("canvas").getContext('2d');
    ctx.font = this.font.style + ' ' + this.font.weight + ' ' + this.font.size + ' ' + this.font.face;
    var w = ctx.measureText(this.text).width;
    var h = parseInt(this.font.size) / 2 + parseInt(this.font.size) / 4;
    
//initialize base class
    Shaper.call(this, id, new Rectangle(new Point(0, 0), new Point(w, -h)).toPolygon());
}

//extend from Shaper, set constructor and delete unnessesary properties
Text.prototype = new Shaper();
Text.prototype.constructor = Text;
delete Text.prototype._eventListener;


//public methods:
    /**
     * Draw function. Is called by layer to draw this Bitmap.
     * @method draw
     **/
	Text.prototype.draw = function() {
        //if can't be drawn return
        if (!this.layer) return;
        if (!this.visible) return;
        
        //draw shape
        var ctx = this.layer.ctx;
        var m = this.matrix;
        
        ctx.save();
        ctx.setTransform(m[0][0], m[0][1], m[1][0], m[1][1], m[2][0], m[2][1]);
        ctx.font = this.font.style + ' ' + this.font.weight + ' ' + this.font.size + ' ' + this.font.face;
        
        if (this.color.stroke != "") {
        	ctx.strokeStyle = this.color.stroke;
        	ctx.strokeText(this.text, 0, 0);
        }
        
        if (this.color.fill != "") {
        	ctx.fillStyle = this.color.fill;
        	ctx.fillText(this.text, 0, 0);
        }
        
        ctx.restore();
    }
    
    
    /**
     * Clone this Bitmap.
     * @method clone
     * @return {Bitmap} a cloned Bitmap.
     **/
	Text.prototype.clone = function() {
        /*var b = new Bitmap('copy_' + this.id, this.image.src, this.image.width, this.image.height);
        b.matrix.multiply(this.matrix);
        return b;*/
    }

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of this object.
     **/
	Text.prototype.toString = function() {
        return "[Text(id:" + this.id + ")]";
    }
    