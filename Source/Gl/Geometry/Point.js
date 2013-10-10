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
 * Point by OlegoS, 09 Apr 2013
 *
 * Point implementation in 2D coordinate system.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * Point is used in all geometry calculations and shapes.
	 *
	 * @class Point
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {Number} x - X position. Default is 0.
	 * @param {Number} y - Y position. Default is 0.
	 **/
	var Point = function(x, y) {
		/**
		 * X position.
		 * 
		 * @property x
		 * @type Number
		 **/
		this.x = x || 0;

	    /**
	     * Y position.
	     * 
	     * @property y
	     * @type Number
	     **/
	    this.y = y || 0;
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Point.prototype;
	
	/**
	 * Set Point coords equal to specified point.
	 * 
	 * @method set
	 * @param {Point} to - destination point.
	 **/
	p.set = function(to) {
	    this.x = to.x; this.y = to.y;
	}

	/**
	 * Move Point by x/y deltas.
	 * 
	 * @method move
	 * @param {Number} dx - X delta.
	 * @param {Number} dy - Y delta.
	 **/
	p.move = function(dx, dy) {
	    this.x += dx; this.y += dy;
	}

	/**
	 * Move Point by distance in specified direction.
	 * 
	 * @method moveDir
	 * @param {Number} dist - distance to move.
	 * @param {Number} angle - direction (in radians).
	 **/
	p.moveDir = function(dist, angle) {
	    this.x += dist * Math.sin(angle);
	    this.y += dist * Math.cos(angle);
	}

	/**
	 * Transform Point by matrix
	 * 
	 * @method matrixTransform
	 * @param {Matrix} m
	 **/
	p.matrixTransform = function(m) {
		var x = this.x, y = this.y;
		
		this.x = x * m[0][0] + y * m[1][0] + m[2][0];
		this.y = x * m[0][1] + y * m[1][1] + m[2][1];
	}

	/**
	 * Rotate Point around pivot by specified angle.
	 * 
	 * @method rotate
	 * @param {Number} angle - rotation angle (in radians).
	 * @param {Point} pivot - pivot to rotate around.
	 **/
	p.rotate = function(angle, pivot) {
		var sina = Math.sin(angle), cosa = Math.cos(angle),
			px = pivot.x, py = pivot.y,
			x = this.x - px, y = this.y - py;
	    
	    this.x = x * cosa - y * sina + px;
	    this.y = x * sina + y * cosa + py;
	}

	/**
	 * Scale Point from pivot by specified scX/scY koefs.
	 * 
	 * @method scale
	 * @param {Number} scX - x scale koef.
	 * @param {Number} scY - y scale koef.
	 * @param {Point} pivot - pivot to scale from.
	 **/
	p.scale = function(scX, scY, pivot) {
	    var dx = this.x - pivot.x, dy = this.y - pivot.y;
	    this.x += scX * dx - dx; this.y += scY * dy - dy;
	}
	
	/**
	 * Return distance to the specified Point.
	 * 
	 * @method distTo
	 * @param {Point} to - Point to calculate distance to.
	 * 
	 * @return {Number} distance in pixels.
	 **/
	p.distTo = function(to) {
	    var dx = to.x - this.x, dy = to.y - this.y;
	    return Math.sqrt(dx * dx + dy * dy);
	}
	
	/**
	 * Return angle to the specified Point.
	 * 
	 * @method angleTo
	 * @param {Point} to - Point to calculate angle to.
	 * 
	 * @return {Number} angle in radians.
	 **/
	p.angleTo = function(to) {
	    return Math.atan2(this.y - to.y, this.x - to.x);
	}

	/**
	 * Clone this Point.
	 * 
	 * @method clone
	 * 
	 * @return {Point} a cloned Point.
	 **/
	p.clone = function() {
	    return new Point(this.x, this.y);
	}

	/**
	 * Return a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[Point(" + this.x + ", " + this.y + ")]";
	}
	
	//set up for global use
	window.Point = Point;
}() );
