/**
 * @file Abstract graphics object implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Rectangle is very important in geometry and rendering calculations.
 * 
 * @class Rectangle
 * @memberof WebbyJs
 */
WebbyJs.createClass({
	/**
	 * Class name.
	 */
	name: 'Rectangle',
	
	/**
	 * @constructor
	 * 
	 * @param {Point} from - up left point. Default is Point(0, 0).
	 * @param {Point} to - bottom right point. Default is Point(0, 0).
	 */
	construct: function Rectangle(from, to) {
		/**
	     * Up left point of rectangle.
	     * 
	     * @memberof Rectangle
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
		 * @memberof Rectangle.prototype
		 * 
		 * @param {Rectangle} target - target to test.
		 * 
		 * @returns {Rectangle} current instance for chaining.
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


/*
 * Graphics by OlegoS, 10 Apr 2013
 *
 * 
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * Graphics is a base to all graphic objects, but it can not be used itself.
	 * Inherited from EventListener to support events.
	 * 
	 * @class Graphics
	 * @super EventListener
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {String} id - Graphics id. Default is "".
	 */
	var Graphics = function(id) {
		//initialize base class
		EventListener.call(this);

	   /**
	    * Graphics id.
	    * 
	    * @property id
	    * @type String
	    */
	    this.id = (id == null ? '' : id);

	   /**
	    * Reference to parent layer.
	    * 
	    * @property layer
	    * @type Layer
	    */
	    this.layer = null;

	   /**
	    * Graphics visibility. Default is true.
	    * 
	    * @property visible
	    * @type Boolean
	    */
	    this.visible = true;
	    
	    /**
	     * Transformation matrix.
	     * 
	     * @property matrix
	     * @type Matrix
	     */
	    this.matrix = new Matrix();
	    
	    /**
	     * Object bounds shape. Mostly used for internal calculations in some cases.
	     * 
	     * @property bounds
	     * @type Path
	     */
	    this.bounds = null;
	    
	    /**
	     * Object rendering style - color, stroke width, opacity, etc.
	     * More object specific styles can be added dynamically.
	     * 
	     * @property style
	     * @type Number
	     */
	    this.style = { strokeWidth: 1, opacity: 1, strokeColor: '#000000', fillColor: '#ffffff', shadowColor: '', shadowBlur: 0 };
	}

	//extend from EventListener
	inheritProto(Graphics, EventListener);
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Graphics.prototype;
	
	/**
	 * Make object draggable.
	 * 
	 * @method startDrag
	 */
	p.startDrag = function() {
	    this.addEventListener(MouseEvent.DOWN, Stage.dragStart);
	}

	/**
	 * Stop object draggable ability.
	 * 
	 * @method stopDrag
	 */
	p.stopDrag = function() {
	    this.removeEventListener(MouseEvent.DOWN, Stage.dragStart);
	}

	/**
	 * Set object style.
	 * 
	 * @method setStyle
	 * @param {Object} style - style to set.
	 */
	p.setStyle = function(style) {
		for (var p in style) this.style[p] = style[p];
	}

	/**
	 * Clone object style.
	 * 
	 * @method cloneStyle
	 * 
	 * @returns {Object} cloned object style.
	 */
	p.cloneStyle = function() {
		var style = this.style, res = {};
		for (var p in style) res[p] = style[p];
		return res;
	}

	/**
	 * Get bounding rectangle of the object.
	 * 
	 * @method getBoundRect
	 * 
	 * @returns {Rectangle} - bounding rectangle.
	 */
	p.getBoundRect = function() {
	    var s = this.bounds.clone();
	    s.matrixTransform(this.matrix);
	    return s.getBoundRect();
	}

	/**
	 * Get object center point.
	 * 
	 * @method getCenter
	 * 
	 * @returns {Point} - center point.
	 */
	p.getCenter = function() {
	    return this.getBoundRect().getCenter();
	}

	/**
	 * Get object width.
	 * 
	 * @method getWidth
	 * 
	 * @returns {Number} - width.
	 */
	p.getWidth = function() {
	    return this.getBoundRect().getWidth();
	}

	/**
	 * Get object height.
	 * 
	 * @method getHeight
	 * 
	 * @returns {Number} - height.
	 */
	p.getHeight = function() {
	    return this.getBoundRect().getHeight();
	}

	/**
	 * Move object by x/y deltas.
	 * 
	 * @method move
	 * @param {Number} dx - X delta.
	 * @param {Number} dy - Y delta.
	 */
	p.move = function(dx, dy) {
	    this.matrix.translate(dx, dy);
	    //this.dirty = true;
	}

	/**
	 * Scale object from pivot.
	 * 
	 * @method scale
	 * @param {Number} scX - x scale koef.
	 * @param {Number} scY - y scale koef.
	 * @param {Point} pivot - pivot to scale from.
	 */
	p.scale = function(scX, scY, pivot) {
		this.matrix.scale(scX, scY, pivot);
	}

	/**
	 * Rotate object around pivot.
	 * 
	 * @method rotate
	 * @param {Number} angle - rotation angle (in radians).
	 * @param {Point} pivot - pivot to rotate around.
	 */
	p.rotate = function(angle, pivot) {
	    this.matrix.rotate(angle, pivot);
	}

	/**
	 * Apply matrix transformation.
	 * 
	 * @method matrixTransform
	 * @param {Matrix} m - matrix.
	 */
	p.matrixTransform = function(m) {
	    this.matrix.multiply(m);
	}

	/**
	 * Mirror object acording to orientation.
	 * 
	 * @method mirror
	 * @param {String} orientation - 'horiz' - horizontal, 'vert' - vertical.
	 */
	p.mirror = function(orientation) {
		Path.prototype.mirror.call(this, orientation);
	}

	/**
	 * Align object in rectangle by base.
	 * 
	 * @method align
	 * @param {String} base - align base: 'left', 'right', 'center', 'top', 'bottom', 'vert'.
	 * @param {Rectangle} rect - align rectangle.
	 */
	p.align = function(base, rect) {
		Path.prototype.align.call(this, base, rect);
	}

	/**
	 * Place object into specified rectangle.
	 * 
	 * @method placeIntoRect
	 * @param {Rectangle} tR - the Rectangle.
	 */
	p.placeIntoRect = function(tR) {
		Path.prototype.placeIntoRect.call(this, tR);
	}  

	/**
	 * Place object around specified Point.
	 * 
	 * @method placeAroundPoint
	 * @param {Point} pt - center point.
	 * @param {Number} dist - distance from center to sides.
	 */
	p.placeAroundPoint = function(pt, dist) {
		Path.prototype.placeAroundPoint.call(this, pt, dist);
	}

	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @returns {String} a string representation of this object.
	 */
	p.toString = function() {
	    return "[Graphics(id:" + this.id + ")]";
	}
	
	//set up for global use
	window.Graphics = Graphics;
}() );
