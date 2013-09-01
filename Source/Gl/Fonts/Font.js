/*
 * Font by OlegoS, 20 Jul 2013
 *
 * Font contains all converted ttf info. Used by FontManager and Text.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * Font is used to render vector text on canvas.
	 * It is registered by FontsManager.
	 *
	 * @class Font
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {Object} fnt - source font object.
	 **/
	var Font = function(fnt) {
		/**
		 * Family name.
		 * 
		 * @property family
		 * @type String
		 **/
		this.family = fnt.original_font_information.font_family_name.toLowerCase();
		
		/**
		 * Full name.
		 * 
		 * @property fullName
		 * @type String
		 **/
		this.fullName = fnt.original_font_information.full_font_name.toLowerCase();
		
		/**
		 * Postscript name.
		 * 
		 * @property postscriptName
		 * @type String
		 **/
		this.postscriptName = fnt.original_font_information.postscript_name.toLowerCase();
		
		/**
		 * Weight, bold|bolder|lighter|normal.
		 * 
		 * @property weight
		 * @type String
		 **/
		this.weight = fnt.cssFontWeight.toLowerCase();
		
		/**
		 * Style, normal|italic|oblique.
		 * 
		 * @property style
		 * @type String
		 **/
		this.style = fnt.cssFontStyle.toLowerCase();
		
		/**
		 * Ascender.
		 * 
		 * @property ascender
		 * @type Number
		 **/
		this.ascender = Number(fnt.ascender);
		
		/**
		 * Descender.
		 * 
		 * @property descender
		 * @type Number
		 **/
		this.descender = Number(fnt.descender);
		
		/**
		 * Underline position.
		 * 
		 * @property ascender
		 * @type Number
		 **/
		this.underlinePosition = Number(fnt.underlinePosition);
		
		/**
		 * Underline thickness.
		 * 
		 * @property underlineThickness
		 * @type Number
		 **/
		this.underlineThickness = Number(fnt.underlineThickness);
		
		/**
		 * Line height.
		 * 
		 * @property lineHeight
		 * @type Number
		 **/
		this.lineHeight = Number(fnt.lineHeight);
		
		/**
		 * Resolution.
		 * 
		 * @property resolution
		 * @type Number
		 **/
		this.resolution = Number(fnt.resolution);
		
		/**
		 * Raw glyphs info.
		 * Each glyph is an object - { ha: x offset, o: "path as String" }.
		 * 
		 * @property rawGlyphsInfo
		 * @type Object
		 **/
		this.rawGlyphsInfo = fnt.glyphs;
		
		/**
		 * Unpacked usable glyphs. Used for Text rendering.
		 * Each glyph is an object - { ha: x offset, path: path as Path }.
		 * 
		 * @property glyphs
		 * @type Object
		 **/
		this.glyphs = {};
		
		/**
		 * 'S' glyph height.
		 * 
		 * @property sHeight
		 * @type Number
		 **/
		this.sHeight = this.getGlyph('S').path.getBoundRect().getHeight();
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Font.prototype;
	
	/**
	 * Unpack raw glyph to usable.
	 * 
	 * @method _unpackGlyph
	 * @param {String} ch - character.
	 **/
	p.unpackGlyph = function(ch) {
		//check glyph info and set empty path if none
		var glyphInfo = this.rawGlyphsInfo[ch];
		
		if (!glyphInfo) {
			this.glyphs[ch] = { ha: 0, path: null };
			return;
		}
		
		//process outline
		var path = new Path(), ol = glyphInfo.o, points, cmd, p;
		
		if (ol) {
			//process path commands
			ol = ol.split(' '); points = path.points.data;
			
			for (var i = 0, l = ol.length; i < l;) {
				//get command
				cmd = ol[i++];
				
				//move
				if (cmd == 'm') {
					p = new Point(Number(ol[i++]), Number(ol[i++])); p.mv = true;
					points.push(p);
					
				//straight line
				} else if (cmd == 'l') {
					points.push(new Point(Number(ol[i++]), Number(ol[i++])));
					
				//quadratic curve
				} else if (cmd == 'q') {
					p = new Point(Number(ol[i++]), Number(ol[i++]));
					p.prev = new Point(Number(ol[i++]), Number(ol[i++]));
					points.push(p);
					
				//bezier curve
				} else if (cmd == 'b') {
					p = new Point(Number(ol[i++]), Number(ol[i++]));
					points[points.length - 1].next = new Point(Number(ol[i++]), Number(ol[i++]));
					p.prev = new Point(Number(ol[i++]), Number(ol[i++]));
					points.push(p);
				}
			}
		}
	
		//set up glyph
		this.glyphs[ch] = { ha: glyphInfo.ha, path: path };
	}
	
	/**
	 * Get unpacked usable glyph.
	 * 
	 * @method getGlyph
	 * @param {String} ch - character.
	 * 
	 * @return {Object} unpacked glyph as { ha: x offset, path: path as Path }.
	 **/
	p.getGlyph = function(ch) {
		if (!this.glyphs[ch]) this.unpackGlyph(ch);
		return this.glyphs[ch];
	}

	/**
	 * Return a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[Font(" + this.fullName + ")]";
	}
	
	//set up for global use
	window.Font = Font;
}() );
