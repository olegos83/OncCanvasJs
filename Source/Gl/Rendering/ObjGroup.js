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


/*
 * ObjGroup by OlegoS, 10 Apr 2013
 *
 * A group of objects implementation.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * ObjGroup allows manipulations with many objects.
	 * 
	 * @class ObjGroup
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {String} id - group id. Default is "".
	 * @param {Array} objects - objects to add. Can be array or one object.
	 */
	var ObjGroup = function(id, objects) {
	   /**
	    * Group id.
	    * 
	    * @property id
	    * @type String
	    */
		this.id = (id == null ? '' : id);
		
	   /**
	    * Objects data provider.
	    * 
	    * @property objects
	    * @type DataProvider
	    */
		if (!objects) objects = [];
		if (objects instanceof Array) this.objects = new DataProvider(objects); else this.objects = new DataProvider([objects]);
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = ObjGroup.prototype;
	
	/**
	 * Get bounding rectangle.
	 * 
	 * @method getBoundRect
	 * 
	 * @returns {Rectangle} - bounding rectangle.
	 */
	p.getBoundRect = function() {
		var objs = this.objects.data, tp = new Path(), tp_pt = tp.points.data;
		
		for (var i = 0, l = objs.length; i < l; i++) {
			var r = objs[i].getBoundRect();
			if (r) tp_pt.push(r.from, r.to);
		}
		
		return tp.getBoundRect();
	}

	/**
	 * Get center point.
	 * 
	 * @method getCenter
	 * 
	 * @returns {Point} - center point.
	 */
	p.getCenter = function() {
	    return this.getBoundRect().getCenter();
	}

	/**
	 * Move by x/y deltas.
	 * 
	 * @method move
	 * @param {Number} dx - X delta.
	 * @param {Number} dy - Y delta.
	 */
	p.move = function(dx, dy) {
		var objs = this.objects.data;
		for (var i = 0, l = objs.length; i < l; i++) objs[i].move(dx, dy);
	}

	/**
	 * Scale from pivot.
	 * 
	 * @method scale
	 * @param {Number} scX - x scale koef.
	 * @param {Number} scY - y scale koef.
	 * @param {Point} pivot - pivot to scale from.
	 */
	p.scale = function(scX, scY, pivot) {
		var objs = this.objects.data;
		for (var i = 0, l = objs.length; i < l; i++) objs[i].scale(scX, scY, pivot);
	}

	/**
	 * Rotate around pivot.
	 * 
	 * @method rotate
	 * @param {Number} angle - rotation angle (in radians).
	 * @param {Point} pivot - pivot to rotate around.
	 */
	p.rotate = function(angle, pivot) {
		var objs = this.objects.data;
		for (var i = 0, l = objs.length; i < l; i++) objs[i].rotate(angle, pivot);
	}

	/**
	 * Apply matrix transformation.
	 * 
	 * @method matrixTransform
	 * @param {Matrix} m - matrix.
	 */
	p.matrixTransform = function(m) {
		var objs = this.objects.data;
		for (var i = 0, l = objs.length; i < l; i++) objs[i].matrixTransform(m);
	}

	/**
	 * Mirror according to orientation.
	 * 
	 * @method mirror
	 * @param {String} orientation - 'horiz' - horizontal, 'vert' - vertical.
	 */
	p.mirror = function(orientation) {
		Path.prototype.mirror.call(this, orientation);
	}

	/**
	 * Align in rectangle by base.
	 * 
	 * @method align
	 * @param {String} base - align base: 'left', 'right', 'center', 'top', 'bottom', 'vert'.
	 * @param {Rectangle} rect - align rectangle.
	 */
	p.align = function(base, rect) {
		Path.prototype.align.call(this, base, rect);
	}

	/**
	 * Place into specified rectangle.
	 * 
	 * @method placeIntoRect
	 * @param {Rectangle} tR - the Rectangle.
	 */
	p.placeIntoRect = function(tR) {
		Path.prototype.placeIntoRect.call(this, tR);
	}  

	/**
	 * Place around specified Point.
	 * 
	 * @method placeAroundPoint
	 * @param {Point} pt - center point.
	 * @param {Number} dist - distance from center to sides.
	 */
	p.placeAroundPoint = function(pt, dist) {
		Path.prototype.placeAroundPoint.call(this, pt, dist);
	}

	/**
	 * Clone object group.
	 * 
	 * @method clone
	 * 
	 * @returns {ObjGroup} a cloned group.
	 */
	p.clone = function() {
		var objs = this.objects.data, tmpArr = [];
	    for (var i = 0, l = objs.length; i < l; i++) tmpArr.push(objs[i]);
	    return new ObjGroup(this.id, tmpArr);
	}

	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @returns {String} a string representation of this object.
	 */
	p.toString = function() {
	    return "[ObjGroup(id:" + this.id + ")]";
	}
	
	//set up for global use
	window.ObjGroup = ObjGroup;
}() );
