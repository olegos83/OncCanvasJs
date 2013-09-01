/*
 * Gradient by OlegoS, 10 Apr 2013
 *
 * Gradient implementation. It is a wrapper for CnvasGradient.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * Gradient may be initialized from colorStops object, which is empty by default.
	 * Color stop stored as object where key is stop index and value is stop color - colorStop['0.5'] = color.
	 * 
	 * @class Gradient
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {String} type - gradient type. Can be 'linear' or 'radial'.
	 * @param {Object} colorStops - array of color stops.
	 **/
	var Gradient = function(type, colorStops) {
		/**
	     * Gradient type.
	     * 
	     * @property _type
	     * @type String
	     * 
	     * @private
	     **/
		this._type = (type == null ? 'linear' : type);
		if (this._type != 'radial') this._type = 'linear';
		
	    /**
	     * Array of color stops.
	     * 
	     * @property _colorStops
	     * @type Array
	     * 
	     * @private
	     **/
	    this._colorStops = (colorStops == null ? {} : colorStops);
	    
	    
	    /**
	     * Gradient scale koef.
	     * 
	     * @property scale
	     * @type Number
	     **/
	    this.scale = 1;
	    
	    /**
	     * Gradient rotation angle in radians.
	     * 
	     * @property rotation
	     * @type Number
	     **/
	    this.rotation = 0;
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Gradient.prototype;
	
	/**
	 * GET/SET Gradient type.
	 * 
	 * @method type
	 * @param {String} type - gradient type. Can be 'linear' or 'radial'.
	 * 
	 * @return {String} if no args - return current type.
	 **/
	p.type = function(type) {
		if (type) {
			this._type = type;
			if (this._type != 'radial') this._type = 'linear';
		} else return this._type;
	}

	/**
	 * Add color stop or change existing stop color.
	 * 
	 * @method addColorStop
	 * @param {Number} index - index of stop.
	 * @param {String} color - css color value.
	 **/
	p.addColorStop = function(index, color) {
		this._colorStops[index] = color;
	}

	/**
	 * Remove color stop.
	 * 
	 * @method removeColorStop
	 * @param {Number} index - index of stop.
	 **/
	p.removeColorStop = function(index) {
		delete this._colorStops[index];
	}

	/**
	 * Check if stop exists.
	 * 
	 * @method hasStop
	 * @param {Number} index - index of stop.
	 * 
	 * @return {Boolean} - true if stop exists or false if not.
	 **/
	p.hasStop = function(index) {
		if (this._colorStops[index]) return true; else return false;
	}

	/**
	 * Get stop color by its index.
	 * 
	 * @method getStopColor
	 * @param {Number} index - index of stop.
	 * 
	 * @return {String} color of stop with specified index or '' - if there is no stop.
	 **/
	p.getStopColor = function(index) {
		if (this.hasStop(index)) return this._colorStops[index]; else return '';
	}

	/**
	 * Change stop index if such stop exists.
	 * 
	 * @method setStopIndex
	 * @param {Number} oldIndex - index of stop.
	 * @param {Number} newIndex - new index to set.
	 **/
	p.setStopIndex = function(oldIndex, newIndex) {
		var c = this.getStopColor(oldIndex);
		
		if (c != '') {
			this.removeColorStop(oldIndex);
			this.addColorStop(newIndex, c);
		}
	}

	/**
	 * Get color stop indexes by color.
	 * 
	 * @method getStopIndexes
	 * @param {String} color - color to test. If no color passed - return all indexes.
	 * 
	 * @return {Array} array of stop indexes with specified color or null if no stops.
	 **/
	p.getStopIndexes = function(color) {
		var indexes = [];
		for (var i in this._colorStops) if ( !color || (this._colorStops[i] == color) ) indexes.push(i);
		
		if (indexes.length == 0) indexes = null;
		return indexes;
	}

	/**
	 * Clear all color stops.
	 * 
	 * @method clearStops
	 **/
	p.clearStops = function() {
		this._colorStops = {};
	}

	/**
	 * Apply Gradient to canvas gradient instance - simply add all color stops.
	 * 
	 * @method setStops
	 * @param {CanvasGradient} gr - gradient.
	 **/
	p.setStops = function(gr) {
		for (var i in this._colorStops) gr.addColorStop(i, this._colorStops[i]);
	}

	/**
	 * Convert to CanvasGradient from start to end point.
	 * 
	 * @method toCanvasGradient
	 * @param {CanvasRenderingContext2d} ctx - canvas context.
	 * @param {Point} from - start point.
	 * @param {Point} to - end point.
	 * 
	 * @return {CanvasGradient} CanvasGradient instance.
	 **/
	p.toCanvasGradient = function(ctx, from, to) {
		//init vars
		var c = new Point((from.x + to.x) / 2, (from.y + to.y) / 2);
		
		//create gradient instance
		var gr = null;
		switch (this.type()) {
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
		this.setStops(gr);
		return gr;
	}

	/**
	 * Clone this gradient.
	 * 
	 * @method clone
	 * 
	 * @return {Gradient} a cloned gradient.
	 **/
	p.clone = function() {
	    var gr = new Gradient(this._type);
	    this.setStops(gr);
	    
	    gr.scale = this.scale;
	    gr.rotation = this.rotation;
	    
	    return gr;
	}

	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[Gradient(type: " + this.type() + ")]";
	}
	
	//set up for global use
	window.Gradient = Gradient;
}() );
