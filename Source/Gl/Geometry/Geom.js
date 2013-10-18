/**
 * @file Basic geometry methods interface.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Geom interface contains useful geometry methods and must be
 * implemented by all geometry shapes and renderable graphics classes.
 * 
 * @class Geom
 * @memberof WebbyJs
 */
WebbyJs.createClass({
	/**
	 * Class name.
	 */
	name: 'Geom',
	
	/**
	 * @constructor
	 */
	construct: function Geom() {
		//empty constructor
	},
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Move object by x/y deltas.
		 * 
		 * @method move
		 * @memberof Geom.prototype
		 * 
		 * @param {Number} dx - X delta.
		 * @param {Number} dy - Y delta.
		 * 
		 * @returns {Geom} current instance for chaining.
		 */
		move: function(dx, dy) {
		    this.matrixTransform(WebbyJs.Geom._tm.setTranslation(dx, dy));
			return this;
		},
		
		/**
		 * Move object by distance in specified direction.
		 * 
		 * @method moveDir
		 * @memberof Geom.prototype
		 * 
		 * @param {Number} dist - distance to move.
		 * @param {Number} angle - direction (in radians).
		 * 
		 * @returns {Geom} current instance for chaining.
		 */
		moveDir: function(dist, angle) {
		    this.matrixTransform(WebbyJs.Geom._tm.setTranslation(dist * Math.sin(angle), dist * Math.cos(angle)));
			return this;
		},
		
		/**
		 * Rotate object around pivot by specified angle.
		 * 
		 * @method rotate
		 * @memberof Geom.prototype
		 * 
		 * @param {Number} angle - rotation angle (in radians).
		 * @param {Point} pivot - pivot to rotate around.
		 * 
		 * @returns {Geom} current instance for chaining.
		 */
		rotate: function(angle, pivot) {
			var px = pivot.x, py = pivot.y, tm = WebbyJs.Geom._tm;
		    
		    this.matrixTransform(tm.setTranslation(-px, -py)).
		    	 matrixTransform(WebbyJs.Geom._rm.setRotation(angle)).
		    	 matrixTransform(tm.setTranslation(px, py));
		    
			return this;
		},
		
		/**
		 * Scale object from pivot by specified scX/scY koefs.
		 * 
		 * @method scale
		 * @memberof Geom.prototype
		 * 
		 * @param {Number} scX - x scale koef.
		 * @param {Number} scY - y scale koef.
		 * @param {Point} pivot - pivot to scale from.
		 * 
		 * @returns {Geom} current instance for chaining.
		 */
		scale: function(scX, scY, pivot) {
			var px = pivot.x, py = pivot.y, tm = WebbyJs.Geom._tm;
		    
			this.matrixTransform(tm.setTranslation(-px, -py)).
		    	 matrixTransform(WebbyJs.Geom._sm.setScale(scX, scY)).
		    	 matrixTransform(tm.setTranslation(px, py));
		    
			return this;
		},
		
		/**
		 * Apply matrix transformation.
		 * 
		 * @method matrixTransform
		 * @memberof Geom.prototype
		 * 
		 * @param {Matrix} m - matrix.
		 * 
		 * @returns {Geom} current instance for chaining.
		 */
		matrixTransform: function(m) {
			return this;
		},
		
		/**
		 * Get bounding rectangle of this object.
		 * 
		 * @method getBoundRect
		 * @memberof Geom.prototype
		 * 
		 * @returns {Rectangle} a bounding rectangle or null if no rectangle.
		 */
		getBoundRect: function() {
		    return null;
		},
		
		/**
		 * Get center point of this object.
		 * 
		 * @method getCenter
		 * @memberof Geom.prototype
		 * 
		 * @returns {Point} a center point or null if no center.
		 */
		getCenter: function() {
			var r = this.getBoundRect();
			return (r ? r.getCenter() : null);
		},
		
		/**
		 * Get object's width.
		 * 
		 * @method getWidth
		 * @memberof Geom.prototype
		 * 
		 * @returns {Number} object's width or null.
		 */
		getWidth: function() {
			var r = this.getBoundRect();
			return (r ? r.getWidth() : null);
		},
		
		/**
		 * Get object's height.
		 * 
		 * @method getHeight
		 * @memberof Geom.prototype
		 * 
		 * @returns {Number} object's height or null.
		 */
		getHeight: function() {
			var r = this.getBoundRect();
			return (r ? r.getHeight() : null);
		},
		
		/**
		 * Check if point is inside this object.
		 * 
		 * @method hasPoint
		 * @memberof Geom.prototype
		 * 
		 * @param {Point} pt - point to test.
		 * 
		 * @returns {Boolean} true if point is inside or false otherwise.
		 */
		hasPoint: function(pt) {
		    return this.hasPointInBounds(pt);
		},
		
		/**
		 * Check if point is inside this object's bounding rectangle.
		 * 
		 * @method hasPointInBounds
		 * @memberof Geom.prototype
		 * 
		 * @param {Point} pt - point to test.
		 * 
		 * @returns {Boolean} true if point is inside or false otherwise.
		 */
		hasPointInBounds: function(pt) {
			var r = this.getBoundRect();
			return (r ? r.hasPoint(pt) : false);
		},
		
		/**
		 * Check intersection between this object and target.
		 * 
		 * @method intersect
		 * @memberof Geom.prototype
		 * 
		 * @param {Rectangle} target - target to test.
		 * 
		 * @returns {Boolean} true if intersect or false otherwise.
		 */
		intersect: function(target) {
		    return this.intersectBounds(target);
		},
		
		/**
		 * Check intersection between this object and target bounding rectangles.
		 * 
		 * @method intersectBounds
		 * @memberof Geom.prototype
		 * 
		 * @param {Rectangle} target - target to test.
		 * 
		 * @returns {Boolean} true if intersect or false otherwise.
		 */
		intersectBounds: function(target) {
			var r = this.getBoundRect();
		    return (r ? r.intersectBounds(target) : false);
		},
		
		/**
		 * Align object by base in bounds of specified rectangle.
		 * 
		 * @method align
		 * @memberof Geom.prototype
		 * 
		 * @param {String} base - align base: 'left', 'right', 'center', 'top', 'bottom', 'vert'.
		 * @param {Rectangle} rect - align rectangle.
		 * 
		 * @returns {Geom} current instance for chaining.
		 */
		align: function(base, rect) {
			var or = this.getBoundRect();
			if (!or) return this;
			
		    //calculate deltas
			var dx = 0, dy = 0;
			
		    switch (base) {
		        case 'left':
		            dx = rect.from.x - or.from.x;
		        break;
		
		        case 'right':
		            dx = rect.to.x - or.to.x;
		        break;
		
		        case 'center':
		        	dx = (rect.from.x + rect.to.x - (or.from.x + or.to.x)) / 2;
		        break;
		
		        case 'top':
		            dy = rect.from.y - or.from.y;
		        break;
		
		        case 'bottom':
		            dy = rect.to.y - or.to.y;
		        break;
		
		        case 'vert':
		        	dy = (rect.from.y + rect.to.y - (or.from.y + or.to.y)) / 2;
		        break;
		    }
		    
		    //move object and return
		    this.move(dx, dy);
		    return this;
		},
		
		/**
		 * Mirror object acording to orientation.
		 * 
		 * @method mirror
		 * @memberof Geom.prototype
		 * 
		 * @param {String} orientation - 'horiz' - horizontal, 'vert' - vertical.
		 * 
		 * @returns {Geom} current instance for chaining.
		 */
		mirror: function(orientation) {
			if (orientation === 'horiz') {
				this.scale(-1, 1, this.getCenter());
			} else if (orientation === 'vert') {
				this.scale(1, -1, this.getCenter());
			}
			
		    return this;
		},
		
		/**
		 * Place object around specified Point.
		 * 
		 * @method placeAroundPoint
		 * @memberof Geom.prototype
		 * 
		 * @param {Point} pt - center point.
		 * @param {Number} dist - distance from center to sides.
		 * 
		 * @returns {Geom} current instance for chaining.
		 */
		placeAroundPoint: function(pt, dist) {
		    this.placeIntoRect(new WebbyJs.Rectangle().placeAroundPoint(pt, dist));
		    return this;
		},
		
		/**
		 * Place object into specified rectangle.
		 * 
		 * @method placeIntoRect
		 * @memberof Geom.prototype
		 * 
		 * @param {Rectangle} tR - the Rectangle.
		 * 
		 * @returns {Geom} current instance for chaining.
		 */
		placeIntoRect: function(tR) {
			//init vars
			var trFrom = tR.from, oR = this.getBoundRect();
			if (!oR) return this;
			
		    //Mirror shape if needed
			if (trFrom.x > tR.to.x) this.mirror('horiz');
		    if (trFrom.y > tR.to.y) this.mirror('vert');
		    
		    //move shape
		    tR.normalize();
		    this.move(trFrom.x - oR.from.x, trFrom.y - oR.from.y);
		    
		    //scale shape
		    var w1 = tR.to.x - trFrom.x, w2 = oR.to.x - oR.from.x,
		    	h1 = tR.to.y - trFrom.y, h2 = oR.to.y - oR.from.y;
		    
		    if (w1 == 0) w1 = 1; if (w2 == 0) w2 = 1;
		    if (h1 == 0) h1 = 1; if (h2 == 0) h2 = 1;
		    
		    this.scale(w1 / w2, h1 / h2, trFrom);
		    
		    //return
		    return this;
		},
		
		/**
		 * Get/Set svg value for this object.
		 * 
		 * @method svg
		 * @memberof Geom.prototype
		 * 
		 * @param {String} svg - svg data.
		 * 
		 * @returns {String|Geom} svg output or current instance for chaining.
		 */
		svg: function(svg) {
			if (svg) return this;
			return "<g info='no svg'></g>";
		},
		
		/**
		 * Add this object to graphics context, where it may be rendered or used anyway else.
		 * 
		 * @method toContext
		 * @memberof Geom.prototype
		 * 
		 * @param {CanvasRenderingContext2D} ctx - context.
		 * 
		 * @returns {Geom} current instance for chaining.
		 */
		toContext: function(ctx) {
			return this;
		}
	},
	
	/**
	 * Static members.
	 */
	statics: {
		/**
		 * Translation matrix.
		 * 
		 * @memberof Geom
		 * @type {Matrix}
		 * 
		 * @private
		 */
		_tm: new WebbyJs.Matrix(),
		
		/**
		 * Scale matrix.
		 * 
		 * @memberof Geom
		 * @type {Matrix}
		 * 
		 * @private
		 */
		_sm: new WebbyJs.Matrix(),
		
		/**
		 * Rotation matrix.
		 * 
		 * @memberof Geom
		 * @type {Matrix}
		 * 
		 * @private
		 */
		_rm: new WebbyJs.Matrix(),
		
		/**
		 * Get radians from degrees.
		 * 
		 * @method rad
		 * @memberof Geom
		 * 
		 * @param {Number} deg - degrees.
		 * 
		 * @returns {Number} radians.
		 */
		rad: function(deg) {
			return deg * 3.14159 / 180;
		},
		
		/**
		 * Get degrees from radians.
		 * 
		 * @method deg
		 * @memberof Geom
		 * 
		 * @param {Number} rad - radians.
		 * 
		 * @returns {Number} degrees.
		 */
		deg: function(rad) {
			return rad * 180 / 3.14159;
		}
	}
});
