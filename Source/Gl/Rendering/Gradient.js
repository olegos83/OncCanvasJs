/**
 * @file Gradient implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Gradient is an array of color stops to make color transition.
 * Stops are rendered only at indexes between 0 and 100.
 * 
 * It can be linear or radial and has two points - 'from' and 'to',
 * which define gradient rendering coordinates.
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
	 * @param {Point} from - start point. Default is Point(0, 0).
	 * @param {Point} to - end point. Default is Point(0, 0).
	 * @param {Number} type - gradient type. Can be linear(default) - 0, or radial - 1.
	 */
	construct: function Gradient(from, to, type) {
		/**
	     * Start point.
	     * 
	     * @memberof Gradient
	     * @type {Point}
	     */
		this.from = from || new WebbyJs.Point();
		
		/**
	     * End point.
	     * 
	     * @memberof Gradient
	     * @type {Point}
	     */
		this.to = to || new WebbyJs.Point();
		
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
	     * @property scale
	     * @type {Number}
	     */
	    this.scale = 1;
	    
	    /**
	     * Gradient rotation angle in radians.
	     * 
	     * @property rotation
	     * @type {Number}
	     */
	    this.rotation = 0;
	    
	    /**
	     * Array of color stops.
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
		 * Check intersection between this and target bounding rectangle.
		 * 
		 * @method intersectBounds
		 * @memberof Gradient.prototype
		 * 
		 * @param {Rectangle} target - target to test.
		 * 
		 * @returns {Gradient} current instance for chaining.
		 */
		intersectBounds: function(target) {
		    return this;
		}
	}
});



//ANONYMOUS FUNCTION WRAPPER
( function() {
//PROTOTYPE
	//get prototype reference
	var p = Gradient.prototype;

	/**
	 * Add color stop or change existing stop color at specified index.
	 * 
	 * @method addStop
	 * @memberof Gradient.prototype
	 * 
	 * @param {Number} index - index of stop.
	 * @param {String|Color} color - css color value or Color instance.
	 * 
	 * @returns {Gradient} current instance for chaining.
	 */
	p.addStop = function(index, color) {
		this.stops[index] = color;
		return this;
	}
	
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
	p.removeStop = function(index) {
		delete this.stops[index];
		return this;
	}
	
	/**
	 * Get stop color at specified index.
	 * 
	 * @method getStop
	 * @memberof Gradient.prototype
	 * 
	 * @param {Number} index - index of stop.
	 * 
	 * @returns {String|Color} - stop color or null if stop does not exist.
	 */
	p.getStop = function(index) {
		return this.stops[index];
	}
	
	/**
	 * Change stop index if such stop exists. If new index contains
	 * stop - it is moved back to the first free index in the direction of change.
	 * 
	 * @method moveStop
	 * @memberof Gradient.prototype
	 * 
	 * @param {Number} oldIndex - index of stop.
	 * @param {Number} newIndex - new index to set.
	 * 
	 * @returns {Gradient} current instance for chaining.
	 */
	p.moveStop = function(oldIndex, newIndex) {
		var stops = this.stops, s = stops[oldIndex];
		
		if (s) {
			delete stops[oldIndex];
			
			if (stops[newIndex]) {
				var d = (newIndex < oldIndex ? -1 : 1);
				while (stops[newIndex]) newIndex += d;
			}
			
			stops[newIndex] = s;
		}
		
		return this;
	}
	
	/**
	 * Get stop indexes by color.
	 * 
	 * @method getIndexes
	 * @memberof Gradient.prototype
	 * 
	 * @param {String|Color} color - color to test. If no color passed - return all indexes, containing stops.
	 * 
	 * @returns {Array} array of stop indexes - can be empty if no stops found.
	 */
	p.getIndexes = function(color) {
		var indexes = [], stops = this.stops, i;
		
		if (color == null) for (i in stops) indexes.push(i);
		else for (i in stops) if (stops[i] == color) indexes.push(i);
		
		return indexes;
	}
	
	/**
	 * Clear all color stops.
	 * 
	 * @method clearStops
	 * @memberof Gradient.prototype
	 * 
	 * @returns {Gradient} current instance for chaining.
	 */
	p.clear = function() {
		this.stops = {};
		return this;
	}
	
	/**
	 * Set all stops from source gradient to current instance.
	 * 
	 * Source stops will owerwrite all existing data, but will not
	 * touch unaffected indexes.
	 * 
	 * @method setStops
	 * @memberof Gradient.prototype
	 * 
	 * @param {Gradient} gr - source gradient.
	 * 
	 * @returns {Gradient} current instance for chaining.
	 */
	p.setStops = function(gr) {
		var stops = this.stops; gr = gr.stops;
		
		for (var i in gr) stops[i] = gr[i];
		return this;
	}
	
	/**
	 * Convert to CanvasGradient from start to end point.
	 * 
	 * @method toCanvasGradient
	 * @memberof Gradient.prototype
	 * 
	 * @param {CanvasRenderingContext2d} ctx - canvas context.
	 * @param {Point} from - start point.
	 * @param {Point} to - end point.
	 * 
	 * @returns {CanvasGradient} CanvasGradient instance.
	 */
	p.toCanvasGradient = function(ctx, from, to) {
		//check coords
		if (from) this.from.set(from);
		if (to) this.to.set(to);
		
		//init vars
		var c = new WebbyJs.Point((from.x + to.x) / 2, (from.y + to.y) / 2), gr = null;
		
		//create gradient instance
		switch (this.type) {
			case 'linear':
				from.scale(this.scale, this.scale, c);
				to.scale(this.scale, this.scale, c);
				
				from.rotate(this.rotation, c);
				to.rotate(this.rotation, c);
				
				gr = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
			break;
			
			case 'radial':
				to.scale(this.scale, this.scale, c);
				gr = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, to.x - c.x);
			break;
		}
		
		//return canvas gradient
		this.setStops(gr); //for (var i in stops) gr.addColorStop(i, stops[i]);
		return gr;
	}
	
	/**
	 * Clone this gradient.
	 * 
	 * @method clone
	 * @memberof Gradient.prototype
	 * 
	 * @returns {Gradient} a cloned gradient.
	 */
	p.clone = function() {
	    var gr = new WebbyJs.Gradient(this.from.clone(), this.to.clone(), this.type).setStops(this);
	    
	    gr.scale = this.scale;
	    gr.rotation = this.rotation;
	    
	    return gr;
	}
	
	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * @memberof Gradient.prototype
	 * 
	 * @returns {String} a string representation of this object.
	 */
	p.toString = function() {
	    return "[Gradient(type: " + this.stops + ")]";
	}
	
	//set up for global use
	window.Gradient = Gradient;
}() );
