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
		 * @returnss {BaseWebbyJsClass} current instance for chaining.
		 */
		invoke: function(method, args) {
			method.apply(this, args);
			return this;
		}
	}
);


/**
 * Options for globalCompositeOperation.
 * 
 * @enum {String}
 */
var Composite = {
    SOURCE_ATOP: 'source-atop',
    SOURCE_IN: 'source-in',
    SOURCE_OUT: 'source-out',
    SOURCE_OVER: 'source-over',
    DESTINATION_ATOP: 'destination-atop',
    DESTINATION_IN: 'destination-in',
    DESTINATION_OUT: 'destination-out',
    DESTINATION_OVER: 'destination-over',
    LIGHTER: 'lighter',
    COPY: 'copy',
    XOR: 'xor'
};

/**
 * Options for lineCap.
 * 
 * @enum {String}
 */
var LineCap = {
    BUTT: 'butt',
    ROUND: 'round',
    SQUARE: 'square'
};

/**
 * Options for lineJoin.
 * 
 * @enum {String}
 */
var LineJoin = {
    BEVEL: 'bevel',
    ROUND: 'round',
    MITER: 'miter'
};

/**
 * Options for textAlign.
 * 
 * @enum {String}
 */
var TextAlign = {
    START: 'start',
    END: 'end',
    LEFT: 'left',
    RIGHT: 'right',
    CENTER: 'center'
};

/**
 * Options for textBaseline.
 * 
 * @enum {String}
 */
var TextBaseline = {
    TOP: 'top',
    HANGING: 'hanging',
    MIDDLE: 'middle',
    ALPHABETIC: 'alphabetic',
    IDEOGRAPHIC: 'ideographic',
    BOTTOM: 'bottom'
};



/**
 * CrossBrowser request animation frame implementation.
 * 
 * @method requestFrame
 * @param {Function} callback - function to call on frame.
 */
var requestFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
				   window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
				   function(callback) { window.setTimeout(callback, 17); };


/**
 * CanvasRenderingContext2D extension with methods to simplify drawing.
 * All methods have a prefix 'oc_' to preserve native prototype garbaging.
 */
if (CanvasRenderingContext2D) { ( function() {
	var p = CanvasRenderingContext2D.prototype;
	
    /**
	 * Set transformation matrix.
	 * 
	 * @method oc_setTransform
	 * @param {Matrix} m - matrix.
	 */
    p.oc_setTransform = function(m) {
    	this.setTransform(m[0][0], m[0][1], m[1][0], m[1][1], m[2][0], m[2][1]);
    }
    
    /**
	 * Add path segment to specified point.
	 * Type of segment is determined by control points.
	 * 
	 * @method oc_segmentTo
	 * @param {Point} p - point.
	 * @param {Point} c1 - control point 1.
	 * @param {Point} c2 - control point 2.
	 */
    p.oc_segmentTo = function(p, c1, c2) {
		if (p.mv) this.moveTo(p.x, p.y); else {
			var cp = c1 || c2;
			
			if (cp) {
				if (c1 && c2) {
					this.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p.x, p.y);
				} else {
					this.quadraticCurveTo(cp.x, cp.y, p.x, p.y);
				}
			} else this.lineTo(p.x, p.y);
		}
    }
    
    /**
	 * Add path to context.
	 * 
	 * @method oc_addPath
	 * @param {Path} path - path object.
	 */
    p.oc_addPath = function(path) {
    	var pt = path.points.data, l = pt.length - 1, p = pt[0];
		if (l <= 0) return;
		
	    this.moveTo(p.x, p.y);
	    for (var i = 0; i < l; i++) { p = pt[i + 1]; this.oc_segmentTo(p, pt[i].next, p.prev); }
	    
	    if (path.closed) { this.oc_segmentTo(pt[0], pt[l].next, pt[0].prev); }
    }
}() ); } else alert('HTML5 drawing capabilities are not supported.');


/*
 * Layer by OlegoS, 10 Apr 2013
 *
 * Layer represents canvas and takes its context to draw objects.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	//object management handlers
	function onObjAdd(e) {
		var item = e.item;
		if (item.layer && item.layer != this) item.layer.remove(item);
		
		item.layer = this;
		this.redraw();
	}
	
	function onObjRemove(e) {
		e.item.layer = null;
		this.redraw();
	}
	
	function onClear(e) {
		this.redraw();
	}
	
	function onChange(e) {
		this.redraw();
	}
	
	//rendering cycle
	function startRenderingCycle(layer) {
    	( function next() {
    		requestFrame(next);
       		if (layer.animated) layer.draw();
    	}() );
    }
	
	
//CONSTRUCTOR
	/**
	 * Layer is a container for objects, it inherits DataProvider and has events support.
	 * Also, it can be static or animated(default). Must be added to Stage to work with it.
	 *
	 * @class Layer
	 * @super DataProvider
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {String} id - layer id.
	 * @param {Stage} stage - stage to add layer.
	 */
	var Layer = function(id, stage) {
		//initialize base class
		DataProvider.call(this);
		
	   /**
	    * Layer id.
	    * 
	    * @property id
	    * @type String
	    */
	    this.id = (id == null ? '' : id);
	    
	    /**
	     * Animation flag.
	     * 
	     * @property animated
	     * @type Boolean
	     */
	     this.animated = true;
	     
	    /**
	     * Redraw flag.
	     * 
	     * @property _dirty
	     * @type Boolean
	     * 
	     * @private
	     */
	    this._dirty = false;
	    
	    /**
	     * Stage reference.
	     * 
	     * @property stage
	     * @type Stage
	     */
	    this.stage = null;
	    
	    /**
	     * Layers canvas reference.
	     * 
	     * @property canvas
	     * @type Canvas
	     */
	    this.canvas = document.createElement('canvas');
	    this.canvas.id = this.id;
	    
	    /**
	     * Layers canvas context reference.
	     * 
	     * @property ctx
	     * @type CanvasContext
	     */
	    this.ctx = this.canvas.getContext("2d");
	    
	    //init
	    this.addEventListener(DataEvent.ADD, onObjAdd);
	    this.addEventListener(DataEvent.REMOVE, onObjRemove);
	    
	    this.addEventListener(DataEvent.CLEAR, onClear);
	    this.addEventListener(DataEvent.CHANGE, onChange);
	    
	    if (stage) stage.add(this);
	    startRenderingCycle(this);
	}
	
	//extend from DataProvider
	inheritProto(Layer, DataProvider);
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Layer.prototype;
	
	/**
	 * Get layer rectangle.
	 * 
	 * @method getRect
	 * 
	 * @returns {Rectangle} - layer rectangle.
	 */
	p.getRect = function() {
	    return new Rectangle(new Point(), new Point(this.canvas.width, this.canvas.height));
	}

	/**
	 * Get layer center.
	 * 
	 * @method getCenter
	 * 
	 * @returns {Point} - center point.
	 */
	p.getCenter = function() {
	    return new Point(this.canvas.width / 2, this.canvas.height / 2);
	}

	/**
	 * Get objects under point. Object must implement hasPoint method to test point.
	 * 
	 * @method getObjectsUnderPoint
	 * @param {Point} p - point to test.
	 * @param {Number} limit - limit of objects to get.
	 * 
	 * @returns {Array} - array of objects from top to bottom.
	 */
	p.getObjectsUnderPoint = function(p, limit) {
	    var objs = this.data, objArr = [];
	    
	    for (var i = objs.length - 1; i >= 0; i--) {
	    	if (objs[i].hasPoint(p)) objArr.push(objs[i]);
	    	if (objArr.length == limit) break;
	    }
	    
	    return objArr;
	}
	
	/**
	 * Force layer redraw.
	 * 
	 * @method redraw
	 */
	p.redraw = function() {
		this._dirty = true;
		if (!this.animated) this.draw();
	}

	/**
	 * Draw this layer. If animated - layer is drawn by specified interval.
	 * Objects must have draw method to be drawn. They are drawn in z order.
	 * 
	 * @method draw
	 */
	p.draw = function() {
		if (this._dirty) {
	        var objs = this.data;
	        
	        this.ctx.oc_clear();
	        for (var i = 0, l = objs.length; i < l; i++) objs[i].draw();
	        
	        this._dirty = false;
		}
	}

	/**
	 * Clone this Layer.
	 * 
	 * @method clone
	 * 
	 * @returns {Layer} a cloned Layer.
	 */
	p.clone = function() {
	    //need to implement
	}

	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @returns {String} a string representation of this object.
	 */
	p.toString = function() {
	    return "[Layer(" + this.data + ")]";
	}
	
	//set up for global use
	window.Layer = Layer;
}() );
