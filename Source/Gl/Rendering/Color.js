/**
 * @file The implementation of WebbyJs class creation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Base class for all WebbyJs created classes.
 * All created classes are inherited from it.
 * 
 * @class BaseWebbyJsClass
 * @memberof WebbyJs
 */
WebbyJs.createClass('BaseWebbyJsClass', null,
	/**
	 * @constructs BaseWebbyJsClass
	 */
	function() {
		/**
		 * All WebbyJs members, which can be globalized.
		 * 
		 * @memberof BaseWebbyJsClass
		 * @type {Array}
		 * 
		 * @private
		 */
		_globals: [];
	},
	
	/**
	 * Prototype description.
	 */
	{
		/**
		 * Invoke method with 'this' reference to current instance.
		 * 
		 * @method invoke
		 * @memberof BaseWebbyJsClass.prototype
		 * 
		 * @param {Function} method - method to invoke.
		 * @param {Array} args - method arguments.
		 * 
		 * @returns {BaseWebbyJsClass} current instance for chaining.
		 */
		invoke: function(method, args) {
			method.apply(this, args);
			return this;
		}
	}
);


/*
 * Color by OlegoS, 4 Apr 2013
 * 
 * Color implementation for automatic calculation RGB, CMYK and HSV values and simple conversion between them.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	//hexByName and nameByHex tables
	var hexByName = {
        aliceblue: 'f0f8ff', antiquewhite: 'faebd7', aqua: '00ffff', aquamarine: '7fffd4', azure: 'f0ffff', beige: 'f5f5dc', bisque: 'ffe4c4', black: '000000',
        blanchedalmond: 'ffebcd', blue: '0000ff', blueviolet: '8a2be2', brown: 'a52a2a', burlywood: 'deb887', cadetblue: '5f9ea0', chartreuse: '7fff00',
        chocolate: 'd2691e', coral: 'ff7f50', cornflowerblue: '6495ed', cornsilk: 'fff8dc', crimson: 'dc143c', cyan: '00ffff', darkblue: '00008b', darkcyan: '008b8b',
        darkgoldenrod: 'b8860b', darkgray: 'a9a9a9', darkgreen: '006400', darkkhaki: 'bdb76b', darkmagenta: '8b008b', darkolivegreen: '556b2f', darkorange: 'ff8c00',
        darkorchid: '9932cc', darkred: '8b0000', darksalmon: 'e9967a', darkseagreen: '8fbc8f', darkslateblue: '483d8b', darkslategray: '2f4f4f', darkturquoise: '00ced1',
        darkviolet: '9400d3', deeppink: 'ff1493', deepskyblue: '00bfff', dimgray: '696969', dodgerblue: '1e90ff', feldspar: 'd19275', firebrick: 'b22222', floralwhite: 'fffaf0',
        forestgreen: '228b22', fuchsia: 'ff00ff', gainsboro: 'dcdcdc', ghostwhite: 'f8f8ff', gold: 'ffd700', goldenrod: 'daa520', gray: '808080', green: '008000',
        greenyellow: 'adff2f', honeydew: 'f0fff0', hotpink: 'ff69b4', indianred : 'cd5c5c', indigo : '4b0082', ivory: 'fffff0', khaki: 'f0e68c', lavender: 'e6e6fa',
        lavenderblush: 'fff0f5', lawngreen: '7cfc00', lemonchiffon: 'fffacd', lightblue: 'add8e6', lightcoral: 'f08080', lightcyan: 'e0ffff', lightgoldenrodyellow: 'fafad2',
        lightgrey: 'd3d3d3', lightgreen: '90ee90', lightpink: 'ffb6c1', lightsalmon: 'ffa07a', lightseagreen: '20b2aa', lightskyblue: '87cefa', lightslateblue: '8470ff',
        lightslategray: '778899', lightsteelblue: 'b0c4de', lightyellow: 'ffffe0', lime: '00ff00', limegreen: '32cd32', linen: 'faf0e6', magenta: 'ff00ff', maroon: '800000',
        mediumaquamarine: '66cdaa', mediumblue: '0000cd', mediumorchid: 'ba55d3', mediumpurple: '9370d8', mediumseagreen: '3cb371', mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a', mediumturquoise: '48d1cc', mediumvioletred: 'c71585', midnightblue: '191970', mintcream: 'f5fffa', mistyrose: 'ffe4e1', moccasin: 'ffe4b5',
        navajowhite: 'ffdead', navy: '000080', oldlace: 'fdf5e6', olive: '808000', olivedrab: '6b8e23', orange: 'ffa500', orangered: 'ff4500', orchid: 'da70d6',
        palegoldenrod: 'eee8aa', palegreen: '98fb98', paleturquoise: 'afeeee', palevioletred: 'd87093', papayawhip: 'ffefd5', peachpuff: 'ffdab9', peru: 'cd853f', pink: 'ffc0cb',
        plum: 'dda0dd', powderblue: 'b0e0e6', purple: '800080', red: 'ff0000', rosybrown: 'bc8f8f', royalblue: '4169e1', saddlebrown: '8b4513', salmon: 'fa8072',
        sandybrown: 'f4a460', seagreen: '2e8b57', seashell: 'fff5ee', sienna: 'a0522d', silver: 'c0c0c0', skyblue: '87ceeb', slateblue: '6a5acd', slategray: '708090',
        snow: 'fffafa', springgreen: '00ff7f', steelblue: '4682b4', tan: 'd2b48c', teal: '008080', thistle: 'd8bfd8', tomato: 'ff6347', turquoise: '40e0d0', violet: 'ee82ee',
        violetred: 'd02090', wheat: 'f5deb3', white: 'ffffff', whitesmoke: 'f5f5f5', yellow: 'ffff00', yellowgreen: '9acd32'
	}, nameByHex = {};
	
	for (var key in hexByName) nameByHex[hexByName[key]] = key;
	
	
//CONSTRUCTOR
	/**
	 * Color may be initialized from RGB, HSV, CMYK or CSS color string.
	 * Supports standart colors by names. Default color is '#000000'.
	 * 
	 * @class Color
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {Object} val - initial color.
	 **/
	var Color = function(val) {
		/**
	     * Init RGB values for internal calculations. Stored as values between 0 and 1.
	     * 
	     * @property _rgb
	     * @type Object
	     * 
	     * @private
	     **/
		this._rgb = { r: 0, g: 0, b: 0 };
		
		//init color
		if (val) {
			if (val.r != null) this.rgb(val);
			else if (val.h != null) this.hsv(val);
			else if (val.c != null) this.cmyk(val);
			
			else if (val.substr) {
				if (val.substr(0, 3).toLowerCase() == 'rgb') this.rgb(val);
				else if (val.substr(0, 1) == '#') this.hex(val);
				else this.name(val);
			}
		}
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Color.prototype;
	
	/**
	 * SET color from number.
	 * 
	 * @method num
	 * @param {Number} n - number value.
	 * 
	 * @return {Object} this for chaining.
	 **/
	p.num = function(n) {
		var rgb = this._rgb, hex = n.toString(16), l = 6 - hex.length;
		
		if (l > 0) {
			for (var i = 0, a = ''; i < l; i++) a += '0';
			hex = a + hex;
		}
		
		rgb.r = parseInt(hex.substr(0, 2), 16) / 255;
		rgb.g = parseInt(hex.substr(2, 2), 16) / 255;
		rgb.b = parseInt(hex.substr(4, 2), 16) / 255;
		
		return this;
	}
	
	/**
	 * GET/SET color from name.
	 * 
	 * @method name
	 * @param {String} name - color name.
	 * 
	 * @return {Object} this for chaining or if no args - color name or 'black'.
	 **/
	p.name = function(name) {
		if (!name) return nameByHex[this.hex().substr(1)] || 'black';
		
		var rgb = this._rgb, hex = hexByName[name] || '000000';
		rgb.r = parseInt(hex.substr(0, 2), 16) / 255;
		rgb.g = parseInt(hex.substr(2, 2), 16) / 255;
		rgb.b = parseInt(hex.substr(4, 2), 16) / 255;
		
		return this;
	}
	
	/**
	 * GET/SET color from hex string.
	 * 
	 * @method hex
	 * @param {String} hex - '#rrggbb' or '#rgb'.
	 * 
	 * @return {Object} this for chaining or if no args - hex as '#rrggbb'.
	 **/
	p.hex = function(hex) {
		var rgb = this._rgb, r, g, b;
		
		if (!hex)  {
			rgb = this.rgb();
			
			r = rgb.r.toString(16), g = rgb.g.toString(16), b = rgb.b.toString(16);
			if (r.length == 1) r = '0' + r;
			if (g.length == 1) g = '0' + g;
			if (b.length == 1) b = '0' + b;
			  
			return ('#' + r + g + b);
		}
		
		if (hex.substr(0, 1) == '#') hex = hex.substr(1);
		
		if (hex.length == 6) {
			rgb.r = parseInt(hex.substr(0, 2), 16) / 255;
			rgb.g = parseInt(hex.substr(2, 2), 16) / 255;
			rgb.b = parseInt(hex.substr(4, 2), 16) / 255;
		} else if (hex.length == 3) {
			r = hex.substr(0, 1), g = hex.substr(1, 1), b = hex.substr(2, 1);
			rgb.r = parseInt(r + r, 16) / 255;
			rgb.g = parseInt(g + g, 16) / 255;
			rgb.b = parseInt(b + b, 16) / 255;
		} else {
			rgb.r = rgb.g = rgb.b = 0;
		}
		    
		return this;
	}
	
	/**
	 * GET/SET color from rgb.
	 * 
	 * @method rgb
	 * @param {Object} rgb - { r: red, g: green, b: blue } or 'rgb(r, g, b)'.
	 * 
	 * @return {Object} this for chaining or if no args - rgb as { r: red, g: green, b: blue }.
	 **/
	p.rgb = function(rgb) {
		var _rgb = this._rgb;
		if (!rgb) return { r: Math.round(_rgb.r * 255), g: Math.round(_rgb.g * 255), b: Math.round(_rgb.b * 255) };
		
		if (rgb.substr && rgb.substr(0, 3).toLowerCase() == 'rgb') {
			var tmp = rgb.split('(')[1].split(',');
			_rgb.r = parseInt(tmp[0]) / 255;
			_rgb.g = parseInt(tmp[1]) / 255;
			_rgb.b = parseInt(tmp[2]) / 255;
		} else if (rgb.r != null) {
			_rgb.r = rgb.r / 255;
			_rgb.g = rgb.g / 255;
			_rgb.b = rgb.b / 255;
		} else {
			_rgb.r = _rgb.g = _rgb.b = 0;
		}
		
		return this;
	}

	/**
     * Get color as rgba string.
     * 
     * @method rgba
     * @param {Number} alpha - alpha value.
     * 
     * @return {String} color as 'rgba(r, g, b, a)' or 'rgb(r, g, b)' if no alpha.
     **/
	p.rgba = function(alpha) {
        var rgb = this.rgb();
        
        if (alpha == null) {
        	return  'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
        } else {
        	return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
        }
    }
	
	/**
	 * GET/SET color from hsv.
	 * 
	 * @method hsv
	 * @param {Object} hsv - { h: hue, s: saturation, v: value }.
	 * 
	 * @return {Object} this for chaining or if no args - hsv as { h: hue, s: saturation, v: value }.
	 **/
	p.hsv = function(hsv) {
		var rgb = this._rgb, s = 0, v;
		
		if (!hsv) {
			var h = 0, min = Math.min(Math.min(rgb.r, rgb.g), rgb.b); v = Math.max(Math.max(rgb.r, rgb.g), rgb.b);
			
			if (v != 0) s = 1 - min / v;
			if (v == min) return { h: h, s: s, v: v };
			
			var d = v - min;
			if (v == rgb.r) h = (rgb.g - rgb.b) / d; else if (v == rgb.g) h = 2 + ((rgb.b - rgb.r) / d); else h = 4 + ((rgb.r - rgb.g) / d);
			  
			h = h * 60;
			if (h < 0) h += 360;
			
			return { h: Math.round(h), s: s, v: v };
		}
		
		v = hsv.v; s = hsv.s;
		if (v == 0 || s == 0) { rgb.r = rgb.g = rgb.b = v; return this; }
		
		var tHue = hsv.h / 60, i = Math.floor(tHue), f = tHue - i,
			p = v * (1 - s), q = v * (1 - s * f), t = v * (1 - s * (1 - f));
		
		switch(i) {
			 case 0: rgb.r = v; rgb.g = t; rgb.b = p; break;
			 case 1: rgb.r = q; rgb.g = v; rgb.b = p; break;
			 case 2: rgb.r = p; rgb.g = v; rgb.b = t; break;
			 case 3: rgb.r = p; rgb.g = q; rgb.b = v; break;
			 case 4: rgb.r = t; rgb.g = p; rgb.b = v; break;
			default: rgb.r = v; rgb.g = p; rgb.b = q; break;
		}
		
		return this;
	}
	
	/**
	 * GET/SET color from cmyk values.
	 * 
	 * @method cmyk
	 * @param {Object} cmyk - { c: cyan, m: magenta, y: yellow, k: key }.
	 * 
	 * @return {Object} this for chaining or if no args - cmyk as { c: cyan, m: magenta, y: yellow, k: key }.
	 **/
	p.cmyk = function(cmyk) {
		var rgb = this._rgb, c, m, y, k, d;
		
		if (!cmyk) {
			c = 1 - rgb.r; m = 1 - rgb.g; y = 1 - rgb.b; k = Math.min(c, m, y, 1);
			
			if (k == 1) {
				c = m = y = 0;
			} else {
				d = 1 - k; c = (c - k) / d; m = (m - k) / d; y = (y - k) / d;
			}
			
			return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
		}
		
		c = cmyk.c / 100; m = cmyk.m / 100; y = cmyk.y / 100; k = cmyk.k / 100;
		d = 1 - k; rgb.r = (1 - c) * d; rgb.g = (1 - m) * d; rgb.b = (1 - y) * d;
		
		return this;
	}
	
	/**
     * Get string representation of this object.
     * 
     * @method toString
     * 
     * @return {String} object as string.
     **/
	p.toString = function() {
        return "[Color(" + this.hex() + ")]";
    }
	
	//set up for global use
	window.Color = Color;
}() );
