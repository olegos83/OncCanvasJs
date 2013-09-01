/*
 * Shaper by OlegoS, 10 Apr 2013
 *
 * Shaper is an object for rendering shapes from geometry.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * Shaper contains array of shapes, which are rendered and processes events globally for all shapes in it.
	 * 
	 * @class Shaper
	 * @super LayerObject
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {String} id - Shaper id. Default is "".
	 * @param {Array} shapes - content of the Shaper. Can be array of shapes or one shape.
	 * @param {Object} style - rendering style.
	 **/
	var Shaper = function(id, shapes, style) {
		//initialize base class
		LayerObject.call(this, id);
		if (style) this.setStyle(style);
		
	   /**
	    * Shapes data provider.
	    * 
	    * @property shapes
	    * @type DataProvider
	    **/
		if (!shapes) shapes = [];
		if (shapes instanceof Array) this.shapes = new DataProvider(shapes); else this.shapes = new DataProvider([shapes]);
		
	   /**
		* Cached shapes data provider - for internal caching and optimizations.
		* 
		* @property cachedShapes
		* @type DataProvider
		**/
		this.cachedShapes = new DataProvider();
		
		//cache shapes
		this.cacheShapes();
	}

	//extend from LayerObject
	inheritProto(Shaper, LayerObject);
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Shaper.prototype;
	
	/**
	 * Cache shapes for optimization.
	 * 
	 * @method cacheBounds
	 **/
	p.cacheShapes = function() {
		this.cachedShapes.clear();
		
		var data = this.shapes.data, cached = this.cachedShapes.data;
		for (var i = 0, l = data.length; i < l; i++) cached.push(data[i].clone());
		
		this.bounds = this.getBoundRect();
		this.cachedShapes.each(Path.prototype.matrixTransform, [this.matrix]);
	}

	/**
	 * Get bounding rectangle.
	 * 
	 * @method getBoundRect
	 * 
	 * @return {Rectangle} - bounding rectangle.
	 **/
	p.getBoundRect = function() {
		var data = this.cachedShapes.data, tp = new Path(), tp_pt = tp.points.data;
		
		for (var i = 0, l = data.length; i < l; i++) {
			var r = data[i].getBoundRect();
			if (r) tp_pt.push(r.from, r.to);
		}
		
		return tp.getBoundRect();
	}

	/**
	 * Move object by x/y deltas.
	 * 
	 * @method move
	 * @param {Number} dx - X delta.
	 * @param {Number} dy - Y delta.
	 **/
	p.move = function(dx, dy) {
	    this.matrix.translate(dx, dy);
	    this.cachedShapes.each(Path.prototype.move, [dx, dy]);
	}

	/**
	 * Scale object from pivot.
	 * 
	 * @method scale
	 * @param {Number} scX - x scale koef.
	 * @param {Number} scY - y scale koef.
	 * @param {Point} pivot - pivot to scale from.
	 **/
	p.scale = function(scX, scY, pivot) {
		this.matrix.scale(scX, scY, pivot);
		this.cachedShapes.each(Path.prototype.scale, [scX, scY, pivot]);
	}

	/**
	 * Rotate object around pivot.
	 * 
	 * @method rotate
	 * @param {Number} angle - rotation angle (in radians).
	 * @param {Point} pivot - pivot to rotate around.
	 **/
	p.rotate = function(angle, pivot) {
	    this.matrix.rotate(angle, pivot);
	    this.cachedShapes.each(Path.prototype.rotate, [angle, pivot]);
	}

	/**
	 * Apply matrix transformation.
	 * 
	 * @method matrixTransform
	 * @param {Matrix} m - matrix.
	 **/
	p.matrixTransform = function(m) {
	    this.matrix.multiply(m);
	    this.cachedShapes.each(Path.prototype.matrixTransform, [m]);
	}

	/**
	 * Test if point is inside the Shaper.
	 * 
	 * @method hasPoint
	 * @param {Point} p - point to test.
	 * 
	 * @return {Boolean} - true if point is inside and false otherwise.
	 **/
	p.hasPoint = function(p) {
		if (!this.layer || !this.visible || this.shapes.length() == 0) return;
		var ctx = this.layer.ctx, data = this.cachedShapes.data;
	    
		ctx.oc_resetTransform();
		ctx.beginPath();
		for (var i = 0, l = data.length; i < l; i++) ctx.oc_addPath(data[i]);
		
		return ctx.isPointInPath(p.x, p.y);
	}

	/**
	 * Draw function. Is called by layer to draw this Shaper.
	 * 
	 * @method draw
	 **/
	p.draw = function() {
		//get style info
		var style = this.style, stroke = style.strokeColor, fill = style.fillColor;
		if (style.strokeWidth == 0) stroke = null;
		
		//test draw ability
		if (!stroke && !fill) return;
		if (!this.layer || !this.visible || this.shapes.length() == 0) return;
		
		//get layer and drawing info
	    var ctx = this.layer.ctx, data = this.cachedShapes.data, nogr = true;
	    if (fill instanceof Gradient) nogr = false;
	    
	    //setup global styles
	    ctx.globalAlpha = style.opacity;
	    
	    //if stroke and no gradient, add cached path data to layer
	    if (stroke || (fill && nogr)) {
	    	ctx.oc_resetTransform();
	    	ctx.beginPath();
	    	for (var i = 0, l = data.length; i < l; i++) ctx.oc_addPath(data[i]);
	    }
	    
	    //draw stroke
		if (stroke) {
			ctx.lineWidth = style.strokeWidth;
	        ctx.strokeStyle = stroke;
	        ctx.stroke();
		}
	    
	    //draw fill
	    if (fill) {
	    	//no gradient - fill cached path
	    	if (nogr) {
	    		ctx.fillStyle = fill;
		        ctx.fill();
	    	} else {
	    		//transform context, add original path and fill gradient
	    		data = this.shapes.data;
	    		
	    		ctx.save();
		        ctx.oc_setTransform(this.matrix);
		        
		        ctx.beginPath();
		        for (var i = 0, l = data.length; i < l; i++) ctx.oc_addPath(data[i]);
		        
		        var r = this.bounds, y = r.getCenter().y;
	        	ctx.fillStyle = fill.toCanvasGradient(ctx, new Point(r.from.x, y), new Point(r.to.x, y));
	        	
		        ctx.fill();
		        ctx.restore();
	    	}
	    }
	}

	/**
	 * Clone this Shaper.
	 * 
	 * @method clone
	 * 
	 * @return {Shaper} a cloned Shaper.
	 **/
	p.clone = function() {
		var pt = this.shapes.data, l = pt.length, tmpArr = [];
	    for (var i = 0; i < l; i++) tmpArr.push(pt[i].clone());
	    
	    var cloned = new Shaper('copy_' + this.id, tmpArr, this.style);
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
	    return "[Shaper(id:" + this.id + ")]";
	}
	
	//set up for global use
	window.Shaper = Shaper;
}() );
