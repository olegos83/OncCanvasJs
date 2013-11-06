/**
 * @file Bitmap implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Rectangle is very important in geometry and rendering calculations.
 * 
 * @class Bitmap
 * @memberof WebbyJs
 */
WebbyJs.Class({
	/**
	 * Class name.
	 */
	name: 'Bitmap',
	
	/**
	 * @constructor
	 * 
	 * @param {Point} from - up left point. Default is Point(0, 0).
	 * @param {Point} to - bottom right point. Default is Point(0, 0).
	 */
	construct: function Bitmap(from, to) {
		/**
	     * Up left point of rectangle.
	     * 
	     * @memberof Bitmap
	     * @type {Point}
	     */
		this.from = from || new WebbyJs.Point();
	},
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Check intersection between this and target bounding rectangle.
		 * 
		 * @method intersectBounds
		 * @memberof Bitmap.prototype
		 * 
		 * @param {Rectangle} target - target to test.
		 * 
		 * @returns {Bitmap} current instance for chaining.
		 */
		intersectBounds: function(target) {
		    return this;
		}
	},
	
	/**
	 * Interfaces.
	 */
	interfaces: WebbyJs.Geom
});

//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * Bitmap is an object which represents image.
	 * 
	 * @class Bitmap
	 * @super LayerObject
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {String} id - string id of the Bitmap. Default is "".
	 * @param {String} src - source of image.
	 * @param {Number} width - width.
	 * @param {Number} height - height.
	 * @param {Object} style - rendering style.
	 */
	var Bitmap = function(id, src, width, height, style) {
		//initialize base class
		LayerObject.call(this, id);
		
		this.bounds = new Rectangle(new Point(), new Point(width, height)).toPath();
		if (style) this.setStyle(style);

	    /**
	     * Image in Bitmap.
	     * 
	     * @property image
	     * @type Image
	     */
	    this.image = new Image();
	    
	    //init
	    var self = this, img = self.image;
	    
	    img.src = src;
	    img.width = width;
	    img.height = height;
	    img.onload = function() { if (self.layer) self.layer.redraw(); }
	}
	
	//extend from LayerObject
	inheritProto(Bitmap, LayerObject);
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Bitmap.prototype;
	
	/**
	 * Test if point is inside bitmap bounds.
	 * 
	 * @method hasPoint
	 * @param {Point} p - point to test.
	 * 
	 * @returns {Boolean} - true if point is inside and false otherwise.
	 */
	p.hasPoint = function(p) {
		if (this.layer && this.visible) {
			var ctx = this.layer.ctx;
		    
			ctx.oc_setTransform(this.matrix);
			ctx.beginPath();
			ctx.oc_addPath(this.bounds);
			
			return ctx.isPointInPath(p.x, p.y);
		}
	}
	
	/**
	 * Draw function. Is called by layer to draw this Bitmap.
	 * 
	 * @method draw
	 */
	p.draw = function() {
	    if (this.layer && this.visible) {
	    	var ctx = this.layer.ctx, img = this.image, style = this.style;
		    
	    	if (style.shadowColor) {
	    		ctx.shadowColor = style.shadowColor;
	    		ctx.shadowBlur = style.shadowBlur;
	    	}
	    	
			ctx.globalAlpha = style.opacity;
		    ctx.oc_setTransform(this.matrix);
		    ctx.drawImage(img, 0, 0, img.width, img.height);
	    }
	}
	
	/**
	 * Clone this Bitmap.
	 * 
	 * @method clone
	 * 
	 * @returns {Bitmap} a cloned Bitmap.
	 */
	p.clone = function() {
	    var img = this.image, cloned = new Bitmap('copy_' + this.id, img.src, img.width, img.height, this.style);
	    cloned.matrixTransform(this.matrix);
	    return cloned;
	}
	
	/**
	 * Get svg code for this object.
	 * 
	 * @method svg
	 * 
	 * @returns {String} svg code string.
	 */
	p.svg = function() {
		var img = this.image;
		
		return '<image preserveAspectRatio="none" width="' + img.width + 'px" height="' + img.height + 'px" opacity="' +
				this.style.opacity + '" transform="' + this.matrix.svg() + '" xlink:href="' + img.src + '"></image>';
	}
	
	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @returns {String} a string representation of this object.
	 */
	p.toString = function() {
	    return "[Bitmap(id:" + this.id + ")]";
	}
	
	//set up for global use
	window.Bitmap = Bitmap;
}() );
