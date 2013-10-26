/**
 * @file Gradient implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Gradient is an array of color stops to make color transition.
 * Stops are rendered only from indexes between 0 and 100.
 * 
 * Gradient can be linear or radial, has scale koef and rotation angle.
 * Also, gradient must have start and end point references to define rendering coordinates.
 * 
 * Stop colors are stored as hex value inside, if non-hex color is added, it
 * is converted witch Color class to hex. If you manually add non-hex color to
 * stops array - it can work not as you expect.
 * 
 * @class Gradient
 * @memberof WebbyJs
 */
WebbyJs.createClass({
	/**
	 * Class name.
	 */
	name: 'Gradient',
	
	/**
	 * @constructor
	 * 
	 * @param {Number} type - gradient type. Can be linear(default) - 0, or radial - 1.
	 * @param {Number} scale - scale koef. Default is 1.
	 * @param {Number} rotation - rotation angle in radians. 0 by default.
	 * @param {Point} from - start rendering point. Undefined by default.
	 * @param {Point} to - end rendering point. Undefined by default.
	 */
	construct: function Gradient(type, scale, rotation, from, to) {
		/**
	     * Gradient type.
	     * 
	     * @memberof Gradient
	     * @type {Number}
	     */
		this.type = type || 0;
		
	    /**
	     * Gradient scale koef.
	     * 
	     * @memberof Gradient
	     * @type {Number}
	     */
	    this.scale = scale || 1;
	    
	    /**
	     * Gradient rotation angle in radians.
	     * 
	     * @memberof Gradient
	     * @type {Number}
	     */
	    this.rotation = rotation || 0;
	    
	    /**
	     * Start rendering point.
	     * 
	     * @memberof Gradient
	     * @type {Point}
	     */
	    this.from = from;
	    
	    /**
	     * End rendering point.
	     * 
	     * @memberof Gradient
	     * @type {Point}
	     */
	    this.to = to;
	    
	    /**
	     * Color stops. You can manually add colors here to gain performance,
	     * but prefere hex color format to be sure in correct gradient behaviour.
	     * 
	     * @memberof Gradient
	     * @type {Object}
	     */
	    this.stops = {};
	},
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Set gradient parameters. Ommited parameter is reseted to default.
		 * 
		 * @method set
		 * @memberof Gradient.prototype
		 * 
		 * @param {Number} type - gradient type. Can be linear(default) - 0, or radial - 1.
		 * @param {Number} scale - scale koef. Default is 1.
	 	 * @param {Number} rotation - rotation angle in radians. 0 by default.
	 	 * @param {Point} from - start rendering point. Undefined by default.
	 	 * @param {Point} to - end rendering point. Undefined by default.
		 * 
		 * @returns {Gradient} current instance for chaining.
		 */
		set: function(type, scale, rotation, from, to) {
			this.type = type || 0;
			this.scale = scale || 1;
			this.rotation = rotation || 0;
			
			this.from = from;
			this.to = to;
			
			return this;
		},
		
		/**
		 * Set all stops from source gradient to current instance.
		 * 
		 * Source stops will owerwrite all existing data, but will not
		 * touch other indexes.
		 * 
		 * @method setStops
		 * @memberof Gradient.prototype
		 * 
		 * @param {Gradient} gr - source gradient.
		 * 
		 * @returns {Gradient} current instance for chaining.
		 */
		setStops: function(gr) {
			var stops = this.stops; gr = gr.stops;
			
			for (var i in gr) stops[i] = gr[i];
			return this;
		},
		
		/**
		 * Add color stop or change existing stop color at specified index.
		 * 
		 * @method addStop
		 * @memberof Gradient.prototype
		 * 
		 * @param {Number} index - index of stop.
		 * @param {String|Color|Object} color - stop color, compatible with Color class.
		 * 
		 * @returns {Gradient} current instance for chaining.
		 */
		addStop: function(index, color) {
			this.stops[index] = WebbyJs.Gradient.COLOR.set(color).hex();
			return this;
		},
		
		/**
		 * Remove color stop from specified index.
		 * 
		 * @method removeStop
		 * @memberof Gradient.prototype
		 * 
		 * @param {Number} index - index of stop.
		 * 
		 * @returns {Gradient} current instance for chaining.
		 */
		removeStop: function(index) {
			delete this.stops[index];
			return this;
		},
		
		/**
		 * Change stop index if such stop exists. If new index contains
		 * stop - new index is moved back to the first free index in the direction of change.
		 * 
		 * @method moveStop
		 * @memberof Gradient.prototype
		 * 
		 * @param {Number} oldIndex - index of stop.
		 * @param {Number} newIndex - new index to set.
		 * 
		 * @returns {Gradient} current instance for chaining.
		 */
		moveStop: function(oldIndex, newIndex) {
			var stops = this.stops, s = stops[oldIndex];
			
			if (s) {
				delete stops[oldIndex];
				
				if (stops[newIndex]) {
					var d = (newIndex < oldIndex ? 1 : -1);
					while (stops[newIndex]) newIndex += d;
				}
				
				stops[newIndex] = s;
			}
			
			return this;
		},
		
		/**
		 * Get stop color at specified index.
		 * 
		 * @method getColor
		 * @memberof Gradient.prototype
		 * 
		 * @param {Number} index - index of stop.
		 * 
		 * @returns {String} - stop color or null if stop does not exist.
		 */
		getColor: function(index) {
			return this.stops[index];
		},
		
		/**
		 * Get used stop indexes by color.
		 * 
		 * @method getIndexes
		 * @memberof Gradient.prototype
		 * 
		 * @param {String|Color|Object} color - stop color, compatible with Color class. If ommited - get all used indexes.
		 * 
		 * @returns {Array} array of stop indexes - can be empty if no stops found.
		 */
		getIndexes: function(color) {
			var indexes = [], stops = this.stops, i;
			
			if (color == null) for (i in stops) indexes.push(i); else {
				color = WebbyJs.Gradient.COLOR.set(color).hex();
				for (i in stops) if (stops[i] == color) indexes.push(i);
			}
			
			return indexes;
		},
		
		/**
		 * Clear all color stops.
		 * 
		 * @method clearStops
		 * @memberof Gradient.prototype
		 * 
		 * @returns {Gradient} current instance for chaining.
		 */
		clearStops: function() {
			this.stops = {};
			return this;
		},
		
		/**
		 * Convert to CanvasGradient to be rendered from start to end points.
		 * 
		 * @method toCanvasGradient
		 * @memberof Gradient.prototype
		 * 
		 * @param {CanvasRenderingContext2d} ctx - canvas context.
		 * 
		 * @returns {CanvasGradient} CanvasGradient instance or null if can`t be rendered.
		 */
		toCanvasGradient: function(ctx) {
			//check rendering points
			var from = this.from, to = this.to;
			if (!from || !to) return null;
			
			//init vars
			var c = new WebbyJs.Point((from.x + to.x) / 2, (from.y + to.y) / 2), scale = this.scale, gr;
			
			//create gradient instance
			if (this.type == 0) {
				from.scale(scale, scale, c).rotate(this.rotation, c);
				to.scale(scale, scale, c).rotate(this.rotation, c);
				gr = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
			} else {
				to.scale(scale, scale, c);
				gr = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, Math.round(to.distTo(c)));
			}
			
			//set stops
			var stops = this.stops;
			
			for (var i in stops) {
				if (i > -1 && i < 101) gr.addColorStop(i / 100, stops[i]);
			}
			
			//return canvas gradient
			return gr;
		},
		
		/**
		 * Clone this gradient.
		 * 
		 * @method clone
		 * @memberof Gradient.prototype
		 * 
		 * @returns {Gradient} a cloned gradient.
		 */
		clone: function() {
		    return new WebbyJs.Gradient(this.type, this.scale, this.rotation, this.from, this.to).setStops(this);
		},
		
		/**
		 * Returns a string representation of this object.
		 * 
		 * @method toString
		 * @memberof Gradient.prototype
		 * 
		 * @returns {String} a string representation of this object.
		 */
		toString: function() {
		    return "[Gradient(" + this.stops + ")]";
		}
	},
	
	/**
	 * Static members.
	 */
	statics: {
		/**
		 * Color converter.
		 * 
		 * @memberof Gradient
		 * @type {Color}
		 */
		COLOR: new Color(),
		
		/**
		 * Linear gradient type constant.
		 * 
		 * @memberof Gradient
		 * @type {Number}
		 */
		LINEAR: 0,
		
		/**
		 * Radial gradient type constant.
		 * 
		 * @memberof Gradient
		 * @type {Number}
		 */
		RADIAL: 1
	}
});
