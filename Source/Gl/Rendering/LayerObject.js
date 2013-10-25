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
		 * @returnss {BaseWebbyJsClass} current instance for chaining.
		 */
		invoke: function(method, args) {
			method.apply(this, args);
			return this;
		}
	}
);


/*
 * LayerObject by OlegoS, 10 Apr 2013
 *
 * LayerObject is an abstraction for object which can be added to Layer.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * LayerObject is a base to all graphic objects, but it can not be used itself.
	 * Inherited from EventListener to support events.
	 * 
	 * @class LayerObject
	 * @super EventListener
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {String} id - LayerObject id. Default is "".
	 */
	var LayerObject = function(id) {
		//initialize base class
		EventListener.call(this);

	   /**
	    * LayerObject id.
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
	    * LayerObject visibility. Default is true.
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
	inheritProto(LayerObject, EventListener);
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = LayerObject.prototype;
	
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
	    return "[LayerObject(id:" + this.id + ")]";
	}
	
	//set up for global use
	window.LayerObject = LayerObject;
}() );
