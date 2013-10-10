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
	 **/
	var Layer = function(id, stage) {
		//initialize base class
		DataProvider.call(this);
		
	   /**
	    * Layer id.
	    * 
	    * @property id
	    * @type String
	    **/
	    this.id = (id == null ? '' : id);
	    
	    /**
	     * Animation flag.
	     * 
	     * @property animated
	     * @type Boolean
	     **/
	     this.animated = true;
	     
	    /**
	     * Redraw flag.
	     * 
	     * @property _dirty
	     * @type Boolean
	     * 
	     * @private
	     **/
	    this._dirty = false;
	    
	    /**
	     * Stage reference.
	     * 
	     * @property stage
	     * @type Stage
	     **/
	    this.stage = null;
	    
	    /**
	     * Layers canvas reference.
	     * 
	     * @property canvas
	     * @type Canvas
	     **/
	    this.canvas = document.createElement('canvas');
	    this.canvas.id = this.id;
	    
	    /**
	     * Layers canvas context reference.
	     * 
	     * @property ctx
	     * @type CanvasContext
	     **/
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
	 * @return {Rectangle} - layer rectangle.
	 **/
	p.getRect = function() {
	    return new Rectangle(new Point(), new Point(this.canvas.width, this.canvas.height));
	}

	/**
	 * Get layer center.
	 * 
	 * @method getCenter
	 * 
	 * @return {Point} - center point.
	 **/
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
	 * @return {Array} - array of objects from top to bottom.
	 **/
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
	 **/
	p.redraw = function() {
		this._dirty = true;
		if (!this.animated) this.draw();
	}

	/**
	 * Draw this layer. If animated - layer is drawn by specified interval.
	 * Objects must have draw method to be drawn. They are drawn in z order.
	 * 
	 * @method draw
	 **/
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
	 * @return {Layer} a cloned Layer.
	 **/
	p.clone = function() {
	    //need to implement
	}

	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[Layer(" + this.data + ")]";
	}
	
	//set up for global use
	window.Layer = Layer;
}() );
