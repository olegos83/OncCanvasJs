/**
 * @file Color utility class.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Color class is usefull to perform color manipulations and conversions
 * between different color formats, such as CSS notations, CMYK, RGB, HSV or integer number.
 * 
 * @class Color
 * @memberof WebbyJs
 */
WebbyJs.createClass({
	/**
	 * Class name.
	 */
	name: 'Color',
	
	/**
	 * @constructor
	 * 
	 * @param {Object} val - initial color value.
	 */
	construct: function Color(val) {
		/**
	     * Red value for internal calculations. Stored as number between 0 and 1.
	     * 
	     * @memberof Color
	     * @type {Number}
	     * 
	     * @private
	     */
		this._r = 0;
		
		/**
	     * Green value for internal calculations. Stored as number between 0 and 1.
	     * 
	     * @memberof Color
	     * @type {Number}
	     * 
	     * @private
	     */
		this._g = 0;
		
		/**
	     * Blue value for internal calculations. Stored as number between 0 and 1.
	     * 
	     * @memberof Color
	     * @type {Number}
	     * 
	     * @private
	     */
		this._b = 0;
		
		//init color
		if (val) this.set(val);
	},
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Set color from specified value.
		 * Color may be initialized from RGB, HSV, CMYK or CSS color string.
		 * 
		 * Also standart colors by names or integer numbers, which are
		 * interpreted as hex, are accepted.
		 * 
		 * @method set
		 * @memberof Color.prototype
		 * 
		 * @param {Object} val - color value to set.
		 * 
		 * @returns {Color} current instance for chaining.
		 */
		set: function(val) {
			if (val instanceof WebbyJs.Color) {
				this._r = val._r; this._g = val._g; this._b = val._b;
				return this;
			}
			
			if (typeof val == 'number') return this.num(val);
			
			if (typeof val == 'string') {
				if (val.substr(0, 1) == '#') return this.hex(val);
				if (val.substr(0, 3).toLowerCase() == 'rgb') return this.rgb(val);
				
				return this.name(val);
			}
			
			if (typeof val == 'object') {
				if (val.r != null) return this.rgb(val);
				if (val.h != null) return this.hsv(val);
				if (val.c != null) return this.cmyk(val);
			}
			
		    return this;
		},
		
		/**
		 * GET/SET color from integer number.
		 * 
		 * @method num
		 * @memberof Color.prototype
		 * 
		 * @param {Number} n - integer value.
		 * 
		 * @returns {Number|Color} current instance for chaining or color value as integer.
		 */
		num: function(n) {
			if (n == null) return parseInt(this.hex().substr(1), 16);
			
			var hex = n.toString(16), l = 6 - hex.length;
			
			if (l > 0) {
				for (var i = 0, a = ''; i < l; i++) a += '0';
				hex = a + hex;
			}
			
			this._r = parseInt(hex.substr(0, 2), 16) / 255;
			this._g = parseInt(hex.substr(2, 2), 16) / 255;
			this._b = parseInt(hex.substr(4, 2), 16) / 255;
			
			return this;
		},
		
		/**
		 * GET/SET color from name.
		 * 
		 * @method name
		 * @memberof Color.prototype
		 * 
		 * @param {String} name - color name.
		 * 
		 * @returns {String|Color} current instance for chaining or if no args - color name || color hex value.
		 */
		name: function(name) {
			var hex;
			
			if (!name) {
				hex = this.hex();
				return WebbyJs.Color.NameByHex[hex.substr(1)] || hex;
			}
			
			hex = WebbyJs.Color.HexByName[name];
			
			if (hex) {
				this._r = parseInt(hex.substr(0, 2), 16) / 255;
				this._g = parseInt(hex.substr(2, 2), 16) / 255;
				this._b = parseInt(hex.substr(4, 2), 16) / 255;
			}
			
			return this;
		},
		
		/**
		 * GET/SET color from hex string.
		 * 
		 * @method hex
		 * @memberof Color.prototype
		 * 
		 * @param {String} hex - '#rrggbb' or '#rgb'.
		 * 
		 * @returns {String|Color} current instance for chaining or if no args - hex as '#rrggbb'.
		 */
		hex: function(hex) {
			var r, g, b;
			
			if (!hex)  {
				r = Math.round(this._r * 255).toString(16); if (r.length == 1) r = '0' + r;
				g = Math.round(this._g * 255).toString(16); if (g.length == 1) g = '0' + g;
				b = Math.round(this._b * 255).toString(16); if (b.length == 1) b = '0' + b;
				
				return ('#' + r + g + b);
			}
			
			if (hex.substr(0, 1) == '#') hex = hex.substr(1);
			
			if (hex.length == 6) {
				this._r = parseInt(hex.substr(0, 2), 16) / 255;
				this._g = parseInt(hex.substr(2, 2), 16) / 255;
				this._b = parseInt(hex.substr(4, 2), 16) / 255;
				
			} else if (hex.length == 3) {
				r = hex.substr(0, 1); this._r = parseInt(r + r, 16) / 255;
				g = hex.substr(1, 1); this._g = parseInt(g + g, 16) / 255;
				b = hex.substr(2, 1); this._b = parseInt(b + b, 16) / 255;
			}
			
			return this;
		},
		
		/**
		 * GET/SET color from rgb.
		 * 
		 * @method rgb
		 * @memberof Color.prototype
		 * 
		 * @param {Object|String} rgb - { r: red, g: green, b: blue } or 'rgb(r, g, b)'.
		 * 
		 * @returns {Object|Color} current instance for chaining or if no args - rgb as { r: red, g: green, b: blue }.
		 */
		rgb: function(rgb) {
			if (!rgb) return { r: Math.round(this._r * 255), g: Math.round(this._g * 255), b: Math.round(this._b * 255) };
			
			if (typeof rgb == 'string') {
				rgb = rgb.split('(')[1].split(',');
				
				this._r = parseInt(rgb[0]) / 255;
				this._g = parseInt(rgb[1]) / 255;
				this._b = parseInt(rgb[2]) / 255;
				
			} else {
				this._r = rgb.r / 255;
				this._g = rgb.g / 255;
				this._b = rgb.b / 255;
			}
			
			return this;
		},
		
		/**
	     * Get color as rgba string.
	     * 
	     * @method rgba
	     * @memberof Color.prototype
	     * 
	     * @param {Number} a - alpha value.
	     * 
	     * @returns {String} color as 'rgba(r, g, b, a)' or 'rgb(r, g, b)' if no alpha.
	     */
		rgba: function(a) {
	        var rgb = this.rgb();
	        return (a == null ? 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')' : 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + a + ')');
	    },
		
		/**
		 * GET/SET color from hsv.
		 * 
		 * @method hsv
		 * @memberof Color.prototype
		 * 
		 * @param {Object} hsv - { h: hue, s: saturation, v: value }.
		 * 
		 * @returns {Object|Color} current instance for chaining or if no args - hsv as { h: hue, s: saturation, v: value }.
		 */
		hsv: function(hsv) {
			var s = 0, v;
			
			if (!hsv) {
				var r = this._r, g = this._g, b = this._b, h = 0, min = Math.min(Math.min(r, g), b);
				
				v = Math.max(Math.max(r, g), b);
				
				if (v != 0) s = 1 - min / v;
				if (v == min) return { h: h, s: s, v: v };
				
				var d = v - min;
				
				if (v == r) h = (g - b) / d; else if (v == g) h = 2 + ((b - r) / d); else h = 4 + ((r - g) / d);
				  
				h = h * 60;
				if (h < 0) h += 360;
				
				return { h: Math.round(h), s: s, v: v };
			}
			
			v = hsv.v; s = hsv.s;
			if (v == 0 || s == 0) { this._r = this._g = this._b = v; return this; }
			
			var tHue = hsv.h / 60, i = Math.floor(tHue), f = tHue - i,
				p = v * (1 - s), q = v * (1 - s * f), t = v * (1 - s * (1 - f));
			
			switch (i) {
				 case 0: this._r = v; this._g = t; this._b = p; break;
				 case 1: this._r = q; this._g = v; this._b = p; break;
				 case 2: this._r = p; this._g = v; this._b = t; break;
				 case 3: this._r = p; this._g = q; this._b = v; break;
				 case 4: this._r = t; this._g = p; this._b = v; break;
				default: this._r = v; this._g = p; this._b = q; break;
			}
			
			return this;
		},
		
		/**
		 * GET/SET color from cmyk values.
		 * 
		 * @method cmyk
		 * @memberof Color.prototype
		 * 
		 * @param {Object} cmyk - { c: cyan, m: magenta, y: yellow, k: key }.
		 * 
		 * @returns {Object|Color} current instance for chaining or if no args - cmyk as { c: cyan, m: magenta, y: yellow, k: key }.
		 */
		cmyk: function(cmyk) {
			var c, m, y, k, d;
			
			if (!cmyk) {
				c = 1 - this._r; m = 1 - this._g; y = 1 - this._b; k = Math.min(c, m, y, 1);
				if (k == 1) c = m = y = 0; else { d = 1 - k; c = (c - k) / d; m = (m - k) / d; y = (y - k) / d; }
				
				return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
			}
			
			c = cmyk.c / 100; m = cmyk.m / 100; y = cmyk.y / 100; k = cmyk.k / 100; d = 1 - k;
			this._r = (1 - c) * d; this._g = (1 - m) * d; this._b = (1 - y) * d;
			
			return this;
		},
		
		/**
		 * Clone this color.
		 * 
		 * @method clone
		 * @memberof Color.prototype
		 * 
		 * @returns {Color} cloned color.
		 */
		clone: function() {
			return new WebbyJs.Color(this);
		},
		
		/**
	     * Get string representation of this object.
	     * 
	     * @method toString
	     * @memberof Color.prototype
	     * 
	     * @returns {String} object as string.
	     */
		toString: function() {
	        return "[Color(" + this.hex() + ")]";
	    }
	},
	
	/**
	 * Static members.
	 */
	statics: {
		/**
		 * Colors as hex by name table.
		 * 
		 * @memberof Color
		 * @type {Object}
		 */
		HexByName: null,
		
		/**
		 * Color names by hex table.
		 * 
		 * @memberof Color
		 * @type {Object}
		 */
		NameByHex: null
	}
});

/**
 * Generate static color tables.
 */
WebbyJs.invoke(function() {
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
	
	this.Color.HexByName = hexByName;
	this.Color.NameByHex = nameByHex;
});
