/**
 * @file Point implementation in 2D coordinate system.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Point is used in all geometry calculations and shapes.
 * 
 * @class Point
 * @extends WObject
 * 
 * @memberof WebbyJs
 */
WebbyJs.Class({
	/**
	 * Class name.
	 */
	name: 'Point',
	
	/**
	 * @constructor
	 * 
	 * @param {Number} x - X position. Default is 0.
	 * @param {Number} y - Y position. Default is 0.
	 */
	construct: function Point(x, y) {
		/**
		 * X coordinate.
		 * 
		 * @memberof Point
		 * @type {Number}
		 */
		this.x = x || 0;
		
	    /**
	     * Y coordinate.
	     * 
	     * @memberof Point
	     * @type {Number}
	     */
	    this.y = y || 0;
	},
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Set Point coords equal to specified point.
		 * 
		 * @method set
		 * @memberof Point.prototype
		 * 
		 * @param {Point} to - destination point.
		 * 
		 * @returns {Point} current instance for chaining.
		 */
		set: function(to) {
		    this.x = to.x; this.y = to.y;
		    return this;
		},
		
		/**
		 * Move Point by x/y deltas.
		 * 
		 * @method move
		 * @memberof Point.prototype
		 * 
		 * @param {Number} dx - X delta.
		 * @param {Number} dy - Y delta.
		 * 
		 * @returns {Point} current instance for chaining.
		 */
		move: function(dx, dy) {
		    this.x += dx; this.y += dy;
		    return this;
		},
		
		/**
		 * Move Point by distance in specified direction.
		 * 
		 * @method moveDir
		 * @memberof Point.prototype
		 * 
		 * @param {Number} dist - distance to move.
		 * @param {Number} angle - direction (in radians).
		 * 
		 * @returns {Point} current instance for chaining.
		 */
		moveDir: function(dist, angle) {
		    this.x += dist * Math.sin(angle);
		    this.y += dist * Math.cos(angle);
		    
		    return this;
		},
		
		/**
		 * Transform Point by matrix
		 * 
		 * @method matrixTransform
		 * @memberof Point.prototype
		 * 
		 * @param {Matrix} m - matrix.
		 * 
		 * @returns {Point} current instance for chaining.
		 */
		matrixTransform: function(m) {
			var x = this.x, y = this.y;
			
			this.x = x * m[0][0] + y * m[1][0] + m[2][0];
			this.y = x * m[0][1] + y * m[1][1] + m[2][1];
			
			return this;
		},
		
		/**
		 * Rotate Point around pivot by specified angle.
		 * 
		 * @method rotate
		 * @memberof Point.prototype
		 * 
		 * @param {Number} angle - rotation angle (in radians).
		 * @param {Point} pivot - pivot to rotate around.
		 * 
		 * @returns {Point} current instance for chaining.
		 */
		rotate: function(angle, pivot) {
			var sina = Math.sin(angle), cosa = Math.cos(angle),
				px = pivot.x, py = pivot.y,
				x = this.x - px, y = this.y - py;
		    
		    this.x = x * cosa - y * sina + px;
		    this.y = x * sina + y * cosa + py;
		    
		    return this;
		},
		
		/**
		 * Scale Point from pivot by specified scX/scY koefs.
		 * 
		 * @method scale
		 * @memberof Point.prototype
		 * 
		 * @param {Number} scX - x scale koef.
		 * @param {Number} scY - y scale koef.
		 * @param {Point} pivot - pivot to scale from.
		 * 
		 * @returns {Point} current instance for chaining.
		 */
		scale: function(scX, scY, pivot) {
		    var dx = this.x - pivot.x, dy = this.y - pivot.y;
		    this.x += scX * dx - dx; this.y += scY * dy - dy;
		    
		    return this;
		},
		
		/**
		 * Return distance to the specified Point.
		 * 
		 * @method distTo
		 * @memberof Point.prototype
		 * 
		 * @param {Point} to - Point to calculate distance to.
		 * 
		 * @returns {Number} distance in pixels.
		 */
		distTo: function(to) {
		    var dx = to.x - this.x, dy = to.y - this.y;
		    return Math.sqrt(dx * dx + dy * dy);
		},
		
		/**
		 * Return angle to the specified Point.
		 * 
		 * @method angleTo
		 * @memberof Point.prototype
		 * 
		 * @param {Point} to - Point to calculate angle to.
		 * 
		 * @returns {Number} angle in radians.
		 */
		angleTo: function(to) {
		    return Math.atan2(this.y - to.y, this.x - to.x);
		},
		
		/**
		 * Clone this Point.
		 * 
		 * @method clone
		 * @memberof Point.prototype
		 * 
		 * @returns {Point} a cloned Point.
		 */
		clone: function() {
		    return new WebbyJs.Point(this.x, this.y);
		},
		
		/**
		 * Return a string representation of this object.
		 * 
		 * @method toString
		 * @memberof Point.prototype
		 * 
		 * @returns {String} a string representation of this object.
		 */
		toString: function() {
		    return "[WebbyJs.Point(" + this.x + ", " + this.y + ")]";
		}
	}
});
