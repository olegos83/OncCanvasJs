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
* @param {String} id - string id of the Text. Default is "".
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
     * @property font
     * @type {Object}
     **/
    this.font = { face: "Verdana", size: "12px", weight: "normal", style: "normal" };
    if (font) for (var f in font) this.font[f] = font[f];
    
//initialize base class
    var sz = this.getTextSize();
    Shaper.call(this, id, new Rectangle(new Point(0, 0), new Point(sz.width, -sz.height)).toPolygon());
}

//extend from Shaper, set constructor and delete unnessesary properties
Text.prototype = new Shaper();
for (var p in Text.prototype) if (Text.prototype.hasOwnProperty(p)) delete Text.prototype[p];
Text.prototype.constructor = Text;


//public methods:
	/**
	 * Get text size.
	 * @method getTextSize
	 * @return {Object} text metrics - {width: width, height: height}.
	 **/
	Text.prototype.getTextSize = function() {
		var ctx = Dom.create("canvas").getContext('2d');
	    ctx.font = this.font.style + ' ' + this.font.weight + ' ' + this.font.size + ' ' + this.font.face;
	    
	    return {width: ctx.measureText(this.text).width, height: parseInt(this.font.size) / 2 + parseInt(this.font.size) / 4};
	}

    /**
     * Draw function. Is called by layer to draw this Text.
     * @method draw
     **/
	Text.prototype.draw = function() {
        //if can't be drawn return
        if (!this.layer) return;
        if (!this.visible) return;
        
        //init context and transforms
        var ctx = this.layer.ctx;
        var m = this.matrix;
        
        ctx.save();
        ctx.setTransform(m[0][0], m[0][1], m[1][0], m[1][1], m[2][0], m[2][1]);
        ctx.font = this.font.style + ' ' + this.font.weight + ' ' + this.font.size + ' ' + this.font.face;
        
        //stroke and fill
        if (this.color.stroke != "") {
        	if (this.color.stroke instanceof Gradient) {
            	this.color.stroke = this.color.stroke.setup(this, this.layer);
            }
        	
        	ctx.strokeStyle = this.color.stroke;
        	ctx.strokeText(this.text, 0, 0);
        }
        
        if (this.color.fill != "") {
        	if (this.color.fill instanceof Gradient) {
            	this.color.fill = this.color.fill.setup(this, this.layer);
            }
        	
        	ctx.fillStyle = this.color.fill;
        	ctx.fillText(this.text, 0, 0);
        }
        
        ctx.restore();
    }
    
    
    /**
     * Clone this Text.
     * @method clone
     * @return {Text} a cloned Text.
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
    