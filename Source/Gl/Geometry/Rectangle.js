/**
 * @file Rectangle implementation in 2D coordinate system.
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
		
	    /**
	     * Bottom right point of rectangle.
	     * 
	     * @memberof Rectangle
	     * @type {Point}
	     */
		this.to = to || new WebbyJs.Point();
	},
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Apply matrix transformation.
		 * 
		 * @method matrixTransform
		 * @memberof Rectangle.prototype
		 * 
		 * @param {Matrix} m - matrix.
		 * 
		 * @returns {Rectangle} current instance for chaining.
		 */
		matrixTransform: function(m) {
			this.from.matrixTransform(m);
			this.to.matrixTransform(m);
			
			return this;
		},
		
		/**
		 * Returns top right point of this Rectangle.
		 * 
		 * @method topRight
		 * @memberof Rectangle.prototype
		 * 
		 * @returns {Point} top right point of this Rectangle.
		 */
		topRight: function() {
		    return new WebbyJs.Point(this.to.x, this.from.y);
		},
		
		/**
		 * Returns bottom left right point of this Rectangle.
		 * 
		 * @method botLeft
		 * @memberof Rectangle.prototype
		 * 
		 * @returns {Point} bottom left point of this Rectangle.
		 */
		botLeft: function() {
		    return new WebbyJs.Point(this.from.x, this.to.y);
		},
		
		/**
		 * Returns width of this Rectangle.
		 * 
		 * @method getWidth
		 * @memberof Rectangle.prototype
		 * 
		 * @returns {Number} width of this Rectangle.
		 */
		getWidth: function() {
		    return Math.abs(this.to.x - this.from.x);
		},
		
		/**
		 * Returns height of this Rectangle.
		 * 
		 * @method getHeight
		 * @memberof Rectangle.prototype
		 * 
		 * @returns {Number} height of this Rectangle.
		 */
		getHeight: function() {
		    return Math.abs(this.to.y - this.from.y);
		},
		
		/**
		 * Get bounding rectangle of this object.
		 * 
		 * @method getBoundRect
		 * @memberof Rectangle.prototype
		 * 
		 * @returns {Rectangle} a bounding rectangle or null if no rectangle.
		 */
		getBoundRect: function() {
		    return this.clone();
		},
		
		/**
		 * Returns a center point of this Rectangle.
		 * 
		 * @method getCenter
		 * @memberof Rectangle.prototype
		 * 
		 * @returns {Point} a center point of this Rectangle.
		 */
		getCenter: function() {
		    return new WebbyJs.Point((this.from.x + this.to.x) / 2, (this.from.y + this.to.y) / 2);
		},
		
		/**
		 * Place rectangle around specified Point.
		 * 
		 * @method placeAroundPoint
		 * @memberof Rectangle.prototype
		 * 
		 * @param {Point} pt - Center point of the Rectangle.
		 * @param {Number} dist - distance from center to sides.
		 * 
		 * @returns {Rectangle} current instance for chaining.
		 */
		placeAroundPoint: function(pt, dist) {
			var px = pt.x, py = pt.y, from = this.from, to = this.to;
			
			from.x = px - dist; from.y = py - dist;
			to.x = px + dist; to.y = py + dist;
			
			return this;
		},
		
		/**
		 * Set rectangle equal to specified rectangle.
		 * 
		 * @method set
		 * @memberof Rectangle.prototype
		 * 
		 * @param {Rectangle} rect - the Rectangle.
		 * 
		 * @returns {Rectangle} current instance for chaining.
		 */
		set: function(rect) {
			this.from.set(rect.from);
			this.to.set(rect.to);
			
			return this;
		},
		
		/**
		 * Set 'from' point up left to 'to' point.
		 * 
		 * @method normalize
		 * @memberof Rectangle.prototype
		 * 
		 * @returns {Rectangle} current instance for chaining.
		 */
		normalize: function() {
			var a, from = this.from, to = this.to;
			
			if (from.x > to.x) { a = from.x; from.x = to.x; to.x = a; }
			if (from.y > to.y) { a = from.y; from.y = to.y; to.y = a; }
			
			return this;
		},
		
		/**
		 * Returns true if point is inside this Rectangle.
		 * 
		 * @method hasPoint
		 * @memberof Rectangle.prototype
		 * 
		 * @param {Point} pt - point to test.
		 * 
		 * @returns {Boolean} true if point is inside or false otherwise.
		 */
		hasPoint: function(pt) {
		    return ( (this.from.x <= pt.x) && (pt.x <= this.to.x) && (this.from.y <= pt.y) && (pt.y <= this.to.y) );
		},
		
		/**
		 * Check intersection between this and target bounding rectangle.
		 * 
		 * @method intersectBounds
		 * @memberof Rectangle.prototype
		 * 
		 * @param {Rectangle} target - target to test.
		 * 
		 * @returns {Boolean} true if intersect or false otherwise.
		 */
		intersectBounds: function(target) {
			var r = (target instanceof WebbyJs.Rectangle ? target : target.getBoundRect());
			if (!r) return false;
			
		    var w = (this.getWidth() + r.getWidth()) / 2,
		    	h = (this.getHeight() + r.getHeight()) / 2,
		    	c1 = this.getCenter(), c2 = r.getCenter();
		    
		    return ( (Math.abs(c1.x - c2.x) <= w) && (Math.abs(c1.y - c2.y) <= h) );
		},
		
		/**
		 * Clone this Rectangle.
		 * 
		 * @method clone
		 * @memberof Rectangle.prototype
		 * 
		 * @returns {Rectangle} a cloned Rectangle.
		 */
		clone: function() {
		    return new WebbyJs.Rectangle(this.from.clone(), this.to.clone());
		},
		
		/**
		 * Convert this Rectangle to Path.
		 * 
		 * @method toPath
		 * @memberof Rectangle.prototype
		 * 
		 * @returns {Path} result Path.
		 */
		toPath: function() {
		    return new WebbyJs.Path([this.from.clone(), this.topRight(), this.to.clone(), this.botLeft()], true);
		},
		
		/**
		 * Returns a string representation of this object.
		 * 
		 * @method toString
		 * @memberof Rectangle.prototype
		 * 
		 * @returns {String} a string representation of this object.
		 */
		toString: function() {
		    return "[WebbyJs.Rectangle(from:" + this.from.toString() + ", to:" + this.to.toString() + ")]";
		}
	},
	
	/**
	 * Interfaces.
	 */
	interfaces: WebbyJs.Geom
});
