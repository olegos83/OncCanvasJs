/*
* Colors by OlegoS. Mar 12, 2012
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
* Colors is a set of classes-helpers to work with color and gradients.
* The idea is to organize or color functions in one place.
**/


/**
 * Color implementation. Can calculate RGB and HSV values. Used in ColorPicker.
 * Can be initialized from RGB, HSV or HEX if specified.
 * 
 * @class Color
 * @author OlegoS
 *
 * @constructor
 * @param {String} type - initialization type. Can be 'RGB', 'HSV' or 'HEX'.
 * @param {Object} val - initial value: {r: red, g: green, b: blue}, {h: hue, s: saturation, v: value} or '#rrggbb'.
 **/
var Color = function(type, val) {
    //DO NOT USE PRIVATE PROPERTIES DIRECTLY - RESULT IS UNPREDICTABLE
    //private properties:
        /**
         * RGB values for inner calculations. Stored as values between 0 and 1.
         * @property _rgb
         * @type Object
         * @private
         **/
         this._rgb = {r: 0, g: 0, b: 0};

        /**
         * HSV values for inner calculations. Stored as values between 0 and 1.
         * H is between 0 and 360.
         * @property _hsv
         * @type Object
         * @private
         **/
         this._hsv = {h: 0, s: 0, v: 0};
         
         //init color if needed
         if (type) {
        	 switch (type) {
		   		case 'RGB':
		   			this.RGB(val.r, val.g, val.b);
				break;
				  
				case 'HSV':
					this.HSV(val.h, val.s, val.v);
				break;
				  
				case 'HEX':
					this.HEX(val);
				break;
        	 }
         }
}
   

//private methods:
	/**
	 * Calculate inner HSV values.
	 * @method _calcHSV
	 * @private
	 **/
	Color.prototype._calcHSV = function() {
		var rgb = this._rgb;
		var hsv = this._hsv;
		
		var max = Math.max(Math.max(rgb.r, rgb.g), rgb.b);
		var min = Math.min(Math.min(rgb.r, rgb.g), rgb.b);
		
		hsv.v = max;
		hsv.s = 0; if(max != 0) hsv.s = 1 - min/max;
		hsv.h = 0;
		
		if(min == max) return;
		var delta = (max - min);
		
		if (rgb.r == max) hsv.h = (rgb.g - rgb.b) / delta;
		else if (rgb.g == max) hsv.h = 2 + ((rgb.b - rgb.r) / delta);
		else hsv.h = 4 + ((rgb.r - rgb.g) / delta);
		  
		hsv.h = hsv.h * 60; if (hsv.h < 0) hsv.h += 360;
	}
	
	/**
	 * Calculate inner RGB values.
	 * @method _calcRGB
	 * @private
	 **/
	Color.prototype._calcRGB = function() {
		var rgb = this._rgb;
		var hsv = this._hsv;
		
		rgb.r = rgb.g = rgb.b = hsv.v;
		if(hsv.v == 0 || hsv.s == 0) return;
		 
		var tHue = hsv.h / 60;
		var i = Math.floor(tHue);
		var f = tHue - i;
		var p = hsv.v * (1 - hsv.s);
		var q = hsv.v * (1 - hsv.s * f);
		var t = hsv.v * (1 - hsv.s * (1 - f));
		
		switch(i) {
		  case 0:
			  rgb.r = hsv.v; rgb.g = t; rgb.b = p;
		  break;
		  
		  case 1:
			  rgb.r = q; rgb.g = hsv.v; rgb.b = p;
		  break;
		  
		  case 2:
			  rgb.r = p; rgb.g = hsv.v; rgb.b = t;
		  break;
		  
		  case 3:
			  rgb.r = p; rgb.g = q; rgb.b = hsv.v;
		  break;
		  
		  case 4:
			  rgb.r = t; rgb.g = p; rgb.b = hsv.v;
		  break;
		  
		  default:
			  rgb.r = hsv.v; rgb.g = p; rgb.b = q;
		  break;
		}
	}


//public methods:
	/**
	 * GET/SET color from RGB values.
	 * @method RGB
	 * @param {Number} r - red.
	 * @param {Number} g - green.
	 * @param {Number} b - blue.
	 * @return {Object} if no args - return current RGB values as {r: red, g: green, b: blue}.
	 **/
	Color.prototype.RGB = function(r, g, b) {
		var rgb = this._rgb;
		
		if (arguments.length == 0) return {r: Math.round(rgb.r * 255), g: Math.round(rgb.g * 255), b: Math.round(rgb.b * 255)};
		if (isNaN(r) || isNaN(g) || isNaN(b)) return;
		
		r = r / 255.0;
		rgb.r = r > 1 ? 1 : r < 0 ? 0 : r;
		
		g = g / 255.0;
		rgb.g = g > 1 ? 1 : g < 0 ? 0 : g;
		
		b = b / 255.0;
		rgb.b = b > 1 ? 1 : b < 0 ? 0 : b;
		  
		this._calcHSV();
	}

	/**
	 * GET/SET color from HSV values.
	 * @method HSV
	 * @param {Number} h - hue.
	 * @param {Number} s - saturation.
	 * @param {Number} v - value.
	 * @return {Object} if no args - return current HSV values as {h: hue, s: saturation, v: value}.
	 **/
	Color.prototype.HSV = function(h, s, v) {
		var hsv = this._hsv;
		
		if (arguments.length == 0) return {h: hsv.h, s: hsv.s, v: hsv.v};
		if (isNaN(h) || isNaN(s) || isNaN(v)) return;
		
		hsv.h = (h >= 360) ? 359.99 : (h < 0) ? 0 : h;
		hsv.s = (s > 1) ? 1 : (s < 0) ? 0 : s;
		hsv.v = (v > 1) ? 1 : (v < 0) ? 0 : v;
		
		this._calcRGB();
	}
     
     
	/**
	 * GET/SET color from HEX string.
	 * @method HEX
	 * @param {String} hex - hue.
	 * @return {String} if no args - return current HEX value as '#rrggbb'.
	 **/
	Color.prototype.HEX = function(hex) {
		if (arguments.length == 0)  {
			var rgb = this._rgb;
			
			var rr = rgb.r.toString(16); if (rr.length == 1) rr = '0' + rr;
			var gg = rgb.g.toString(16); if (gg.length == 1) gg = '0' + gg;
			var bb = rgb.b.toString(16); if (bb.length == 1) bb = '0' + bb;
			  
			return ('#' + rr + gg + bb);
		} else {
			if (hex.substr(0, 1) == '#') hex = hex.substr(1);
			if (hex.length != 6) return;
			    
			var r = parseInt(hex.substr(0, 2), 16);
			var g = parseInt(hex.substr(2, 2), 16);
			var b = parseInt(hex.substr(4, 2), 16);
			 
			this.SetRGB(r, g, b);
		}
	}
