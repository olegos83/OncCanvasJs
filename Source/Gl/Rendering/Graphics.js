/**
 * @file Abstract graphics object implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Graphics is a base to all renderable objects. Can contain chldren,
 * which are rendered relativly to parent. Must have global uniq id.
 * 
 * Implements EventListener to support events.
 * 
 * @class Graphics
 * @extends WObject
 * 
 * @memberof WebbyJs
 */
WebbyJs.Class({
	/**
	 * Class name.
	 */
	name: 'Graphics',
	
	/**
	 * @constructor
	 * 
	 * @param {String} id - Graphics id. If ommited - uniq id is generated.
	 */
	construct: function Graphics(id) {
		/**
		 * Events hash, containing arrays of functions by event type as key.
		 * 
		 * @memberof Graphics
		 * @type {Object}
		 * 
		 * @private
		 */
		this._events = {};
		
		/**
		 * Graphics object uniq id.
		 * 
		 * @memberof Graphics
		 * @type {String}
		 * 
		 * @private
		 */
	    this._id = '';
	    
	    /**
		 * Graphics children by id cache.
		 * 
		 * @memberof Graphics
		 * @type {Object}
		 * 
		 * @private
		 */
	    this._childrenById = {};
	    
	    /**
		 * Data array for child graphics objects.
		 * 
		 * @memberof Graphics
		 * @type {Array}
		 */
		this.dp_storage = [];
	    
	    /**
	     * Reference to parent layer.
	     * 
	     * @memberof Graphics
	     * @type {Layer}
	     */
	    this.layer = null;
	    
	    /**
	     * Graphics visibility. Default is true.
	     * 
	     * @memberof Graphics
	     * @type {Boolean}
	     */
	    this.visible = true;
	    
	    /**
	     * Transformation matrix.
	     * 
	     * @memberof Graphics
	     * @type Matrix
	     */
	    this.matrix = new WebbyJs.Matrix();
	    
	    /**
	     * Bounding rectangle.
	     * 
	     * @memberof Graphics
	     * @type Path
	     */
	    this.bounds = null;
	    
	    /**
	     * Object rendering style.
	     * 
	     * @memberof Graphics
	     * @type {Style}
	     */
	    this.style = new WebbyJs.Style();
	    
	    //init
	    this.id(id || 'gr_' + WebbyJs.getUniqId());
	    
	    this.addEventListener(WebbyJs.DataEvent.ADD, this.dataHandlers.onAdd);
	    
	    this.addEventListener(WebbyJs.DataEvent.REMOVE, this.dataHandlers.onRemove);
	    this.addEventListener(WebbyJs.DataEvent.REPLACE, this.dataHandlers.onReplace);
	    
	    this.addEventListener(WebbyJs.DataEvent.CHANGE, this.dataHandlers.onChange);
	    this.addEventListener(WebbyJs.DataEvent.CLEAR, this.dataHandlers.onClear);
	},
	
	/**
	 * Interfaces.
	 */
	implement: [WebbyJs.Geom, WebbyJs.DataProvider],
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
	     * Graphics data event handlers.
	     * 
	     * @memberof Graphics.prototype
	     * @type {Boolean}
	     */
	    dataHandlers: {
	    	onAdd: function(e) {},
	    	onRemove: function(e) {},
	    	onReplace: function(e) {},
	    	onChange: function(e) {},
	    	onClear: function(e) {}
	    },
		
		/**
		 * Set object rendering style.
		 * 
		 * @method setStyle
		 * @memberof Graphics.prototype
		 * 
		 * @param {Object} style - initial style.
		 * 
		 * @returns {Graphics} current instance for chaining.
		 */
		setStyle: function(style) {
			this.style.set(style);
			if (this.layer) this.layer.redraw();
			
			return this;
		},
		
		/**
		 * Get graphics child by its id.
		 * 
		 * @method getChildById
		 * @memberof Graphics.prototype
		 * 
		 * @param {String} id - child id.
		 * 
		 * @returns {Graphics} child or null if child not found.
		 */
		getChildById: function(id) {
			return this._childrenById[id];
		},
		
		/**
		 * Get bounding rectangle of the object.
		 * 
		 * @method getBoundRect
		 * @memberof Graphics.prototype
		 * 
		 * @returns {Rectangle} - bounding rectangle.
		 */
		getBoundRect: function() {
		    return null;
		},
		
		/**
		 * Move object by x/y deltas.
		 * 
		 * @method move
		 * @memberof Graphics.prototype
		 * 
		 * @param {Number} dx - X delta.
		 * @param {Number} dy - Y delta.
		 * 
		 * @returns {Graphics} current instance for chaining.
		 */
		move: function(dx, dy) {
		    this.matrix.translate(dx, dy);
		    if (this.layer) this.layer.redraw();
		    
		    return this;
		},
		
		/**
		 * Scale object from pivot.
		 * 
		 * @method scale
		 * @memberof Graphics.prototype
		 * 
		 * @param {Number} scX - x scale koef.
		 * @param {Number} scY - y scale koef.
		 * @param {Point} pivot - pivot to scale from.
		 * 
		 * @returns {Graphics} current instance for chaining.
		 */
		scale: function(scX, scY, pivot) {
			this.matrix.scale(scX, scY, pivot);
			if (this.layer) this.layer.redraw();
		    
		    return this;
		},
		
		/**
		 * Rotate object around pivot.
		 * 
		 * @method rotate
		 * @memberof Graphics.prototype
		 * 
		 * @param {Number} angle - rotation angle (in radians).
		 * @param {Point} pivot - pivot to rotate around.
		 * 
		 * @returns {Graphics} current instance for chaining.
		 */
		rotate: function(angle, pivot) {
		    this.matrix.rotate(angle, pivot);
		    if (this.layer) this.layer.redraw();
		    
		    return this;
		},
		
		/**
		 * Apply matrix transformation.
		 * 
		 * @method matrixTransform
		 * @memberof Graphics.prototype
		 * 
		 * @param {Matrix} m - matrix.
		 * 
		 * @returns {Graphics} current instance for chaining.
		 */
		matrixTransform: function(m) {
		    this.matrix.multiply(m);
		    if (this.layer) this.layer.redraw();
		    
		    return this;
		},
		
		/**
		 * Returns a string representation of this object.
		 * 
		 * @method toString
		 * @memberof Graphics.prototype
		 * 
		 * @returns {String} a string representation of this object.
		 */
		toString: function() {
		    return "[Graphics(id:" + this._id + ")]";
		}
	}
});
