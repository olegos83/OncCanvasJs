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
WebbyJs.createClass('Geom', null,
	/**
	 * @constructs Geom
	 */
	function() {
		//empty constructor
	},
	
	/**
	 * Prototype description.
	 */
	{
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
			return null;
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
			var or = this.getBoundRect(), dx = 0, dy = 0;
			
		    //calculate deltas
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
		    switch(orientation) {
		        case 'horiz':
		            this.scale(-1, 1, this.getCenter());
		        break;

		        case 'vert':
		            this.scale(1, -1, this.getCenter());
		        break;
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
		    this.placeIntoRect(new Rectangle().placeAroundPoint(pt, dist));
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
			var trFrom = tR.from;
			
		    //Mirror shape if needed
			if (trFrom.x > tR.to.x) this.mirror('horiz');
		    if (trFrom.y > tR.to.y) this.mirror('vert');
		    
		    //move shape
		    var oR = this.getBoundRect();
		    
		    tR.normalize();
		    this.move(trFrom.x - oR.from.x, trFrom.y - oR.from.y);
		    
		    //scale shape
		    var w1 = tR.getWidth(), w2 = oR.getWidth();
		    if (w1 == 0) w1 = 1; if (w2 == 0) w2 = 1;
		    
		    var h1 = tR.getHeight(), h2 = oR.getHeight();
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
	}, null,
	
	/**
	 * Static members.
	 */
	{
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
);
