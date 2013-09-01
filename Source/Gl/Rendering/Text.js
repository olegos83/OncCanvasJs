/*
 * Text by OlegoS, 10 Apr 2013
 *
 * Text object implementation - to render vector text on canvas.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	var defaultFontStyle = { fontFamily: 'Verdana', fontSize: '12px', fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' };
	
//CONSTRUCTOR
	/**
	 * Renders text as vector path on canvas. Fonts must be prepared to render text.
	 * Style is extended with new properties, like in example:
	 * 	fontFamily: "Verdana", //css font-face
	 * 	fontSize: "12px",      //css font-size
	 * 	fontWeight: "normal",  //normal|bold
	 * 	fontStyle: "normal",   //normal|italic
	 *  textAlign: "left"      //left|center|right
	 * 
	 * @class Text
	 * @super Shaper
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {String} id - object id. Default is "".
	 * @param {String} text - text value. Default is "".
	 * @param {Object} style - rendering style.
	 **/
	var Text = function(id, text, style) {
		//initialize base class
	    Shaper.call(this, id);
	    
	    //set style
	    this.setStyle(defaultFontStyle);
	    if (style) this.setStyle(style);
	    
	    /**
	     * Font reference.
	     * 
	     * @property font
	     * @type Font
	     **/
	    this.font = null;
	    
	    /**
	     * Text value.
	     * 
	     * @property text
	     * @type String
	     **/
	    this.text = '';
	    if (text) this.setText(text);
	}
	
	//extend from Shaper
	inheritProto(Text, Shaper);
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Text.prototype;
	
	/**
	 * Set text.
	 * 
	 * @method setText
	 * @param {Sting} text - text to set.
	 **/
	p.setText = function(text) {
		//init vars
		var style = this.style, font = this.font = FontsManager.getFontByStyle(style),
			chars = text.split(''), l = chars.length, ofsx = 0, ofsy = 0, grp = new ObjGroup(),
			pathArr = grp.objects.data, glyph, path, i, sHeight = font.sHeight,
			txtLine = new ObjGroup(), txtLineData = txtLine.objects.data, txtLinesArr = [txtLine];
			
		//process text
		for (i = 0; i < l; i++) {
			if (chars[i] == '\n') {
				txtLine = new ObjGroup();
				txtLineData = txtLine.objects.data;
				txtLinesArr.push(txtLine);
				
				ofsx = 0; ofsy -= sHeight + sHeight / 4;
				continue;
			}
			
			glyph = font.getGlyph(chars[i]); path = glyph.path;
			if (!path) continue;
			
			path = path.clone();
			path.move(ofsx, ofsy);
			
			txtLineData.push(path);
			pathArr.push(path);
			
			ofsx += glyph.ha;
		}
		
		//set font size
		var fsz = style.fontSize, k = (fsz.indexOf('px') != -1 ? 0.75 * parseInt(fsz) : parseInt(fsz)),
			sc = k / sHeight;
		
		grp.scale(sc, -sc, new Point());
		
		//set text align
		if (style.textAlign != 'left') {
			var r = grp.getBoundRect(); k = r.getWidth();
			
			if (style.textAlign == 'center') k = k / 2;
			r.from.x -= k; r.to.x -= k; l = txtLinesArr.length;
			
			for (i = 0; i < l; i++) txtLinesArr[i].align(style.textAlign, r);
		}
		
		//update shape
		this.text = text;
		this.shapes.data = grp.objects.data;
		this.cacheShapes();
	}

	/**
	 * Set font style. Updates text after font change.
	 * 
	 * @method setFont
	 * @param {Object} style - style.
	 **/
	p.setFont = function(style) {
		this.setStyle(style);
		this.setText(this.text);
	}

	/**
	 * Test if point is inside the Text bounds.
	 * 
	 * @method hasPoint
	 * @param {Point} p - point to test.
	 * 
	 * @return {Boolean} - true if point is inside and false otherwise.
	 **/
	p.hasPoint = function(p) {
		if (!this.layer || !this.visible || this.shapes.length() == 0) return;
		
		var ctx = this.layer.ctx, bounds = this.bounds.toPath();
		
		bounds.matrixTransform(this.matrix);
		ctx.oc_resetTransform();
		
		ctx.beginPath();
		ctx.oc_addPath(bounds);
		
		return ctx.isPointInPath(p.x, p.y);
	}

	/**
	 * Clone this Text.
	 * 
	 * @method clone
	 * 
	 * @return {Text} a cloned Text.
	 **/
	p.clone = function() {
		var cloned = new Text(this.id, this.text, this.style);
		cloned.matrixTransform(this.matrix);
		return cloned;
	}

	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[Text(id:" + this.id + ")]";
	}
	
	//set up for global use
	window.Text = Text;
}() );
