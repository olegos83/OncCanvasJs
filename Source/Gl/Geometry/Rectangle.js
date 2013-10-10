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
 * Rectangle by OlegoS, 09 Apr 2013
 *
 * Rectangle implementation in 2D coordinate system.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * Rectangle is very important in geometry and rendering calculations.
	 * Has two points: from - up left point, to - bottom right point.
	 *
	 * @class Rectangle
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {Point} from - up left point. Default is Point(0, 0).
	 * @param {Point} to - bottom right point. Default is Point(0, 0).
	 **/
	var Rectangle = function(from, to) {
	    /**
	     * Up left point of rectangle.
	     * 
	     * @property from
	     * @type Point
	     **/
		this.from = (from == null ? new Point() : from);

	    /**
	     * Bottom right point of rectangle.
	     * 
	     * @property to
	     * @type Point
	     **/
		this.to = (to == null ? new Point() : to);
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Rectangle.prototype;
	
	/**
	 * Returns top right point of this Rectangle.
	 * 
	 * @method topRight
	 * 
	 * @return {Point} top right point of this Rectangle.
	 **/
	p.topRight = function() {
	    return new Point(this.to.x, this.from.y);
	}

	/**
	 * Returns bottom left right point of this Rectangle.
	 * 
	 * @method botLeft
	 * 
	 * @return {Point} bottom left point of this Rectangle.
	 **/
	p.botLeft = function() {
	    return new Point(this.from.x, this.to.y);
	}

	/**
	 * Returns width of this Rectangle.
	 * 
	 * @method getWidth
	 * 
	 * @return {Number} width of this Rectangle.
	 **/
	p.getWidth = function() {
	    return this.to.x - this.from.x;
	}

	/**
	 * Returns height of this Rectangle.
	 * 
	 * @method getHeight
	 * 
	 * @return {Number} height of this Rectangle.
	 **/
	p.getHeight = function() {
	    return this.to.y - this.from.y;
	}

	/**
	 * Returns a center point of this Rectangle.
	 * 
	 * @method getCenter
	 * 
	 * @return {Point} a center point of this Rectangle.
	 **/
	p.getCenter = function() {
	    return new Point((this.from.x + this.to.x) / 2, (this.from.y + this.to.y) / 2);
	}

	/**
	 * Place rectangle around specified Point.
	 * 
	 * @method placeAroundPoint
	 * @param {Point} pt - Center point of the Rectangle.
	 * @param {Number} dist - distance from center to sides.
	 **/
	p.placeAroundPoint = function(pt, dist) {
		var px = pt.x, py = pt.y, from = this.from, to = this.to;
		
		from.x = px - dist; from.y = py - dist;
		to.x = px + dist; to.y = py + dist;
	}

	/**
	 * Set rectangle equal to specified rectangle.
	 * 
	 * @method set
	 * @param {Rectangle} rect - the Rectangle.
	 **/
	p.set = function(rect) {
		this.from.set(rect.from); this.to.set(rect.to);
	}

	/**
	 * Set 'from' point up left to 'to' point.
	 * 
	 * @method normalize
	 **/
	p.normalize = function() {
		var a, from = this.from, to = this.to;
		
		if (from.x > to.x) { a = from.x; from.x = to.x; to.x = a; }
		if (from.y > to.y) { a = from.y; from.y = to.y; to.y = a; }
	}

	/**
	 * Returns true if point is inside this Rectangle.
	 * 
	 * @method hasPoint
	 * @param {Point} pt - point to test.
	 * 
	 * @return {Boolean} true if point is inside this Rectangle.
	 **/
	p.hasPoint = function(pt) {
	    return ( (this.from.x <= pt.x) && (pt.x <= this.to.x) && (this.from.y <= pt.y) && (pt.y <= this.to.y) );
	}

	/**
	 * Check intersection between two rectangles.
	 * 
	 * @method intersect
	 * @param {Rectangle} r - rectangle to test.
	 * 
	 * @return {Boolean} true if rectangles intersect or false otherwise.
	 **/
	p.intersect = function(r) {
	    var w = (Math.abs(this.getWidth()) + Math.abs(r.getWidth())) / 2,
	    	h = (Math.abs(this.getHeight()) + Math.abs(r.getHeight())) / 2,
	    	c1 = this.getCenter(), c2 = r.getCenter(),
	    	dx = c1.x - c2.x, dy = c1.y - c2.y;
	    
	    return ( (Math.abs(dx) <= w) && (Math.abs(dy) <= h) );
	}

	/**
	 * Clone this Rectangle.
	 * 
	 * @method clone
	 * 
	 * @return {Rectangle} a cloned Rectangle.
	 **/
	p.clone = function() {
	    return new Rectangle(this.from.clone(), this.to.clone());
	}

	/**
	 * Convert this Rectangle to Path.
	 * 
	 * @method toPath
	 * 
	 * @return {Path} result Path.
	 **/
	p.toPath = function() {
	    return new Path([this.from.clone(), this.topRight(), this.to.clone(), this.botLeft()], true);
	}

	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[Rectangle(from:" + this.from.toString() + ", to:" + this.to.toString() + ")]";
	}
	
	//set up for global use
	window.Rectangle = Rectangle;
}() );
