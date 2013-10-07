/*
 * Globals by OlegoS, 09 Apr 2013
 *
 * Global code, used in canvas library.
 */


/**
 * Browser detection.
 **/
var _BROWSER_ = 'unknown';

( function() {
	var nav = navigator.userAgent.toLowerCase();
	
	if (nav.indexOf('firefox') != -1) _BROWSER_ = 'firefox';
	else if (nav.indexOf('opera') != -1) _BROWSER_ = 'opera';
	else if (nav.indexOf('chrome') != -1) _BROWSER_ = 'chrome';
	else if (nav.indexOf('msie') != -1) _BROWSER_ = 'ie';
}() );


/**
 * Options for globalCompositeOperation.
 **/
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
 **/
var LineCap = {
    BUTT: 'butt',
    ROUND: 'round',
    SQUARE: 'square'
};

/**
 * Options for lineJoin.
 **/
var LineJoin = {
    BEVEL: 'bevel',
    ROUND: 'round',
    MITER: 'miter'
};

/**
 * Options for textAlign.
 **/
var TextAlign = {
    START: 'start',
    END: 'end',
    LEFT: 'left',
    RIGHT: 'right',
    CENTER: 'center'
};

/**
 * Options for textBaseline.
 **/
var TextBaseline = {
    TOP: 'top',
    HANGING: 'hanging',
    MIDDLE: 'middle',
    ALPHABETIC: 'alphabetic',
    IDEOGRAPHIC: 'ideographic',
    BOTTOM: 'bottom'
};

/**
 * Id generator - to naive for now.
 */
var _uniqNumId_ = 0;

function getUniqId() {
	return _uniqNumId_++;
}

/**
 * Prototype inheritance global method. Child's prototype is inherited from parent's.
 * 
 * @method inheritProto
 * @param {Object} child - child class.
 * @param {Object} parent - parent class.
 **/
function inheritProto(child, parent) {
	function F() {}
	F.prototype = parent.prototype;
	
	child.prototype = new F();
	child.prototype.constructor = child;
}


/**
 * CrossBrowser request animation frame implementation.
 * 
 * @method requestFrame
 * @param {Function} callback - function to call on frame.
 **/
var requestFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
				   window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
				   function(callback) { window.setTimeout(callback, 17); };


/**
 * CanvasRenderingContext2D extension with methods to simplify drawing.
 * All methods have a prefix 'oc_' to preserve native prototype garbaging.
 **/
if (CanvasRenderingContext2D) { ( function() {
	var p = CanvasRenderingContext2D.prototype;
	
	/**
	 * Reset transformation matrix to identity.
	 * 
	 * @method oc_resetTransform
	 **/
    p.oc_resetTransform = function() {
    	this.setTransform(1, 0, 0, 1, 0, 0);
    }
    
    /**
	 * Clear all pixels.
	 * 
	 * @method oc_clear
	 **/
    p.oc_clear = function() {
    	var cv = this.canvas;
    	
    	this.setTransform(1, 0, 0, 1, 0, 0);
    	this.clearRect(0, 0, cv.width, cv.height);
    }
    
    /**
	 * Set transformation matrix.
	 * 
	 * @method oc_setTransform
	 * @param {Matrix} m - matrix.
	 **/
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
	 **/
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
	 **/
    p.oc_addPath = function(path) {
    	var pt = path.points.data, l = pt.length - 1, p = pt[0];
		if (l <= 0) return;
		
	    this.moveTo(p.x, p.y);
	    for (var i = 0; i < l; i++) { p = pt[i + 1]; this.oc_segmentTo(p, pt[i].next, p.prev); }
	    
	    if (path.closed) { this.oc_segmentTo(pt[0], pt[l].next, pt[0].prev); }
    }
}() ); } else alert('HTML5 drawing capabilities are not supported.');
/*
 * EventListener by OlegoS, 09 Apr 2013
 *
 * Event manager for objects and data driven structures.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * EventListener is used to manage events for objects and data. User can define his own events.
	 *
	 * @class EventListener
	 * @author OlegoS
	 *
	 * @constructor
	 **/
	var EventListener = function() {
		/**
		 * Events container. All events are stored in arrays of functions.
		 * 
		 * @property _events
		 * @type Object
		 * 
		 * @private
		 **/
		this._events = {};
	}
	
	
//STATIC
	/**
	 * Mouse event types.
	 **/
	var MouseEvent = {
	    CLICK: 'click',
	    DBLCLICK: 'dblclick',
	    DOWN: 'mousedown',
	    MOVE: 'mousemove',
	    UP: 'mouseup',
	    OVER: 'mouseover',
	    OUT: 'mouseout',
	    DRAGSTART: 'dragstart',
	    DRAG: 'drag',
	    DRAGEND: 'dragend'
	};
	
	/**
	 * Keyboard event types.
	 **/
	var KeyEvent = {
	    KEYDOWN: 'keydown',
	    KEYUP: 'keyup'
	};
	
//PROTOTYPE
	//get prototype reference
	var p = EventListener.prototype;
	
	/**
	 * Add event listener for specified event type.
	 * 
	 * @method addEventListener
	 * @param {String} eventType - type of event.
	 * @param {Function} listener - event handler.
	 **/
	p.addEventListener = function(eventType, listener) {
		if (!listener) return;
		var events = this._events[eventType];
		
		if (!events) this._events[eventType] = [listener]; else {
			for (var i = 0, l = events.length; i < l; i++) if (events[i] == listener) return;
			events.push(listener);
		}
	}

	/**
	 * Remove event listener for specified event type.
	 * 
	 * @method removeEventListener
	 * @param {String} eventType - type of event.
	 * @param {Function} listener - event handler.
	 **/
	p.removeEventListener = function(eventType, listener) {
	    var events = this._events[eventType]; if (!events) return;
	    
	    if (!listener) this._events[eventType] = []; else {
	    	for (var i = 0, l = events.length; i < l; i++) if (events[i] == listener) { events.splice(i, 1); return; }
	    }
	}

	/**
	 * Call listeners for specified event type.
	 * 
	 * @method processEvent
	 * @param {Object} e - event object.
	 **/
	p.processEvent = function(e) {
	    var events = this._events[e.type];
	    if (events) for (var i = 0, l = events.length; i < l; i++) events[i].call(this, e);
	}
	
	//set up for global use
	window.MouseEvent = MouseEvent;
	window.KeyEvent = KeyEvent;
	window.EventListener = EventListener;
}() );
/*
 * DataProvider by OlegoS, 09 Apr 2013
 *
 * A wrapper for array to manage data collections.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * DataProvider is designed to work with data collections.
	 * Support of events are imlemented via EventListener inheritance.
	 * 
	 * Any class may be inherited from DataProvider to support data events.
	 * Class instances, inherited from DataProvider have 'data' property, which must not be overriden.
	 * 
	 * Event support can slow down items iteration, so you can directly use 'data' property
	 * to get more iteration speed, but in that case, events must be processed manually. 
	 * 
	 * @class DataProvider
	 * @super EventListener
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {Array} data - initial data array. By default it is empty.
	 **/
	var DataProvider = function(data) {
		//initialize base class
		EventListener.call(this);
		
	    /**
	     * Data array.
	     * 
	     * @property data
	     * @type Array
	     **/
	    this.data = (data == null ? [] : data);
	}
	
	//extend from EventListener
	inheritProto(DataProvider, EventListener);
	
	
//STATIC
	/**
	 * Data event types.
	 **/
	var DataEvent = {
	    ADD: 'add',
	    REMOVE: 'remove',
	    CLEAR: 'clear',
	    CHANGE: 'change'
	};
	
//PROTOTYPE
	//get prototype reference
	var p = DataProvider.prototype;
	
	/**
	 * Add item to the end of data.
	 * 
	 * @method add
	 * @param {Object} item - item.
	 **/
	p.add = function(item) {
		this.data.push(item);
		this.processEvent({ item: item, type: DataEvent.ADD });
	}

	/**
	 * Add item to data at specified index.
	 * 
	 * @method addAt
	 * @param {Object} item - item.
	 * @param {Number} index - index.
	 **/
	p.addAt = function(item, index) {
	    this.data.splice(index, 0, item);
	    this.processEvent({ item: item, index: index, type: DataEvent.ADD });
	}

	/**
	 * Remove item from data.
	 * 
	 * @method remove
	 * @param {Object} item - item.
	 **/
	p.remove = function(item) {
		var data = this.data, l = data.length, i;
		
		for (i = 0; i < l; i++) if (data[i] == item) {
			data.splice(i, 1);
			this.processEvent({ item: item, type: DataEvent.REMOVE });
			break;
		}
	}

	/**
	 * Remove item from data at specified index.
	 * 
	 * @method removeAt
	 * @param {Number} index - index.
	 **/
	p.removeAt = function(index) {
		var evt = { item: this.data[index], index: index, type: DataEvent.REMOVE };
		
	    this.data.splice(index, 1);
	    this.processEvent(evt);
	}

	/**
	 * Remove all data.
	 * 
	 * @method clear
	 **/
	p.clear = function() {
		var evt = { data: this.data, type: DataEvent.CLEAR };
		
	    this.data = [];
	    this.processEvent(evt);
	}

	/**
	 * Get item at specified index.
	 * 
	 * @method itemAt
	 * @param {Number} index - index.
	 * 
	 * @return {Object} found item.
	 **/
	p.itemAt = function(index) {
	    return this.data[index];
	}

	/**
	 * Get item index.
	 * 
	 * @method indexOf
	 * @param {Object} item - item.
	 * 
	 * @return {Number} item index or -1, if no item found.
	 **/
	p.indexOf = function(item) {
		var data = this.data, l = data.length, i;
		
	    for (i = 0; i < l; i++) if (data[i] == item) return i;
	    return -1;
	}

	/**
	 * Set item index.
	 * 
	 * @method setItemIndex
	 * @param {Object} item - item.
	 * @param {Number} index - index.
	 **/
	p.setItemIndex = function(item, index) {
		var data = this.data, l = data.length, i;
	    
		for (i = 0; i < l; i++) if (data[i] == item) {
			data.splice(i, 1);
		    data.splice(index, 0, item);
		    
		    this.processEvent({ item: item, oldIndex: i, newIndex: index, type: DataEvent.CHANGE });
		    break;
	    }
	}

	/**
	 * Get number of items in data.
	 * 
	 * @method length
	 * 
	 * @return {Number} number of items.
	 **/
	p.length = function() {
		return this.data.length;
	}

	/**
	 * Invoke method for all items.
	 * 
	 * @method each
	 * @param {Function} method - method.
	 * @param {Array} parameters - parameters.
	 **/
	p.each = function(method, parameters) {
		var data = this.data, l = data.length, i;
		for (i = 0; i < l; i++) method.apply(data[i], parameters);
	}

	/**
	 * Clone data provider. Event handlers are not cloned.
	 * 
	 * @method clone
	 * 
	 * @return {DataProvider} a cloned DataProvider.
	 **/
	p.clone = function() {
	    var data = this.data, l = data.length, tmpArr = [], i;
	    
	    for (i = 0; i < l; i++) tmpArr.push(data[i]);
	    return new DataProvider(tmpArr);
	}

	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[DataProvider(" + this.data + ")]";
	}
	
	//set up for global use
	window.DataEvent = DataEvent;
	window.DataProvider = DataProvider;
}() );
/*
 * DB by OlegoS, 26 Jun 2013
 *
 * Database and php scripts manager.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	
	
//STATIC
	/**
	 * DB class can call server php script.
	 * It has default handlers for data workout - they simply log data to console.
	 * 
	 * @class DB
	 * @author OlegoS
	 *
	 * @static
	 **/
	var DB = {
		/**
	     * Server host name.
	     * 
	     * @property host
	     * @type String
	     **/
		host: 'http://33rv.com/',
		
		/**
		 * Call external php script.
		 * 
		 * @method callScript
		 * @param {String} path - path to script(relative to host).
		 * @param {Object} params - script call params.
		 * @param {Function} success - success handler.
		 * @param {Function} error - error handler.
		 **/
		callScript: function(path, params, success, error) {
			//set defaults
			if (!success) success = function(data) { console.log(data); }
			if (!error) error = function(jqXHR, textStatus, errorThrown) { console.log(jqXHR, textStatus, errorThrown); }
			
			//perform query
			$.ajax({ type: "POST", url: DB.host + path, data: params, success: success, error: error });
		}
	};
	
	
//PROTOTYPE
	//set up for global use
	window.DB = DB;
}() );
/*
 * Matrix by OlegoS, 09 Apr 2013
 *
 * Matrix implementation.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * Matrix inside is a 2d array. Used in geometry calculations.
	 *
	 * @class Matrix
	 * @author OlegoS
	 *
	 * @constructor
	 **/
	var Matrix = function() {
		this[0] = [1, 0, 0];
	    this[1] = [0, 1, 0];
	    this[2] = [0, 0, 1];
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Matrix.prototype, _t = new Matrix(), _s = new Matrix(), _r = new Matrix();
	
	/**
	 * Set this matrix as identity matrix.
	 * 
	 * @method reset
	 **/
	p.reset = function() {
		var m0 = this[0], m1 = this[1], m2 = this[2];
		
		m0[0] = m1[1] = m2[2] = 1;
		m0[1] = m0[2] = m1[0] = m1[2] = m2[0] = m2[1] = 0;
	}
	
	/**
	 * Set translation in matrix by tx and ty coords.
	 * 
	 * @method setTranslation
	 * @param {Number} tx - x translation.
	 * @param {Number} ty - y translation.
	 **/
	p.setTranslation = function(tx, ty) {
		this[2][0] = tx; this[2][1] = ty;
	}
	
	/**
	 * Set rotation in matrix by angle.
	 * 
	 * @method setRotation
	 * @param {Number} angle - rotation angle in radians.
	 **/
	p.setRotation = function(angle) {
		var sinAngle = Math.sin(angle);
		
		this[0][0] = this[1][1] = Math.cos(angle);
		this[0][1] = sinAngle; this[1][0] = -sinAngle;
	}
	
	/**
	 * Set scale in matrix by scX and scY koefs.
	 * 
	 * @method setScale
	 * @param {Number} scX - x scale.
	 * @param {Number} scY - y scale.
	 **/
	p.setScale = function(scX, scY) {
		this[0][0] = scX; this[1][1] = scY;
	}
	
	/**
	 * Set skew in matrix by skX and skY koefs.
	 * 
	 * @method setSkew
	 * @param {Number} skX - x skew.
	 * @param {Number} skY - y skew.
	 **/
	p.setSkew = function(skX, skY) {
		this[0][1] = Math.tan(skX); this[1][0] = Math.tan(skY);
	}
	
	/**
	 * Translate matrix by tx and ty coords.
	 * 
	 * @method translate
	 * @param {Number} tx - x translation.
	 * @param {Number} ty - y translation.
	 **/
	p.translate = function(tx, ty) {
		_t.setTranslation(tx, ty);
	    this.multiply(_t);
	}
	
	/**
	 * Rotate matrix by angle around pivot.
	 * 
	 * @method rotate
	 * @param {Number} angle - rotation angle in radians.
	 * @param {Point} pivot - pivot to rotate around.
	 **/
	p.rotate = function(angle, pivot) {
		var px = pivot.x, py = pivot.y;
	    
		_t.setTranslation(-px, -py);
	    this.multiply(_t);
	    
	    _r.setRotation(angle);
	    this.multiply(_r);
	    
	    _t.setTranslation(px, py);
	    this.multiply(_t);
	}
	
	/**
	 * Scale matrix from pivot by scX and scY koefs.
	 * 
	 * @method scale
	 * @param {Number} scX - x scale.
	 * @param {Number} scY - y scale.
	 * @param {Point} pivot - pivot to scale from.
	 **/
	p.scale = function(scX, scY, pivot) {
		var px = pivot.x, py = pivot.y;
	    
	    _t.setTranslation(-px, -py);
	    this.multiply(_t);
	    
	    _s.setScale(scX, scY);
	    this.multiply(_s);
	    
	    _t.setTranslation(px, py);
	    this.multiply(_t);
	}
	
	/**
	 * Multiply this matrix by another.
	 * 
	 * @method multiply
	 * @param {Matrix} m - another matrix.
	 **/
	p.multiply = function(m) {
	    var val, i, j, v, temp = [[], [], []];
	    for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) temp[i][j] = this[i][j];
	    
		for (i = 0; i < 3; i++){
	        for (j = 0; j < 3; j++) {
	            val = 0;
	            for (v = 0; v < 3; v++) val += temp[i][v] * m[v][j];
	            this[i][j] = val;
		    }
		}
	}
	
	/**
	 * Get Matrix determinant.
	 * 
	 * @method det
	 * 
	 * @return {Number} determinant.
	 **/
	p.det = function() {
		var m0 = this[0], m1 = this[1], m2 = this[2],
			m10 = m1[0], m11 = m1[1], m12 = m1[2], m20 = m2[0], m21 = m2[1], m22 = m2[2];
		
	    return m0[0] * (m11 * m22 - m21 * m12) - m0[1] * (m10 * m22 - m20 * m12) + m0[2] * (m10 * m21 - m20 * m11);
	}
	
	/**
	 * Get inverted Matrix.
	 * 
	 * @method inverted
	 * 
	 * @return {Matrix} an inverted Matrix.
	 **/
	p.inverted = function() {
		var m = new Matrix(), m0 = m[0], m1 = m[1], m2 = m[2], det = this.det(),
		
			t0 = this[0], t00 = t0[0], t01 = t0[1], t02 = t0[2],
			t1 = this[1], t10 = t1[0], t11 = t1[1], t12 = t1[2],
			t2 = this[2], t20 = t2[0], t21 = t2[1], t22 = t2[2];
		
	    m0[0] =   t11 * t22 - t12 * t21  / det; m0[1] = -(t01 * t22 - t21 * t02) / det; m0[2] =   t01 * t12 - t11 * t02  / det;
	    m1[0] = -(t10 * t22 - t12 * t20) / det; m1[1] =   t00 * t22 - t20 * t02  / det; m1[2] = -(t00 * t12 - t10 * t02) / det;
	    m2[0] =   t10 * t21 - t20 * t11  / det; m2[1] = -(t00 * t21 - t20 * t01) / det; m2[2] =   t00 * t11 - t01 * t10  / det;
	    
	    return m;
	}
	
	/**
	 * Clone this Matrix.
	 * 
	 * @method clone
	 * 
	 * @return {Matrix} a cloned Matrix.
	 **/
	p.clone = function() {
		var m = new Matrix(), i, j, mi, ti;
		
		for (i = 0; i < 3; i++) {
			mi = m[i]; ti = this[i];
			for (j = 0; j < 3; j++) mi[j] = ti[j];
		}
		
		return m;
	}
	
	/**
	 * Get/Set matrix svg value.
	 * 
	 * @method svg
	 * @param {String} val - svg matrix notation as 'matrix(m00 m01 m10 m11 m20 m21)'.
	 * 
	 * @return {String} matrix svg string, when called without arguments.
	 **/
	p.svg = function(val) {
		var m0 = this[0], m1 = this[1], m2 = this[2];
		
		if (!val) {
			return 'matrix(' + m0[0].toFixed(3) + ' ' + m0[1].toFixed(3) + ' ' + m1[0].toFixed(3) + ' '
							 + m1[1].toFixed(3) + ' ' + m2[0].toFixed(3) + ' ' + m2[1].toFixed(3) + ')';
		} else {
			val = val.replace('matrix(', '').replace(')', '').split(' ');
		}
		
		m0[0] = Number(val[0]); m0[1] = Number(val[1]); m0[2] = 0;
		m1[0] = Number(val[2]); m1[1] = Number(val[3]); m1[2] = 0;
		m2[0] = Number(val[4]); m2[1] = Number(val[5]); m2[2] = 1;
	}
	
	/**
	 * Return a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
		var m0 = this[0], m1 = this[1], m2 = this[2];
		
	    return "[Matrix ([ [" + m0[0] + ", " + m0[1] + ", " + m0[2] + "], " +
	    				  "[" + m1[0] + ", " + m1[1] + ", " + m1[2] + "], " +
	    				  "[" + m2[0] + ", " + m2[1] + ", " + m2[2] + "] ])";
	}
	
	//set up for global use
	window.Matrix = Matrix;
}() );
/*
 * Point by OlegoS, 09 Apr 2013
 *
 * Point implementation in 2D coordinate system.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * Point is used in all geometry calculations and shapes.
	 *
	 * @class Point
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {Number} x - X position. Default is 0.
	 * @param {Number} y - Y position. Default is 0.
	 **/
	var Point = function(x, y) {
		/**
		 * X position.
		 * 
		 * @property x
		 * @type Number
		 **/
		this.x = x || 0;

	    /**
	     * Y position.
	     * 
	     * @property y
	     * @type Number
	     **/
	    this.y = y || 0;
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Point.prototype;
	
	/**
	 * Set Point coords equal to specified point.
	 * 
	 * @method set
	 * @param {Point} to - destination point.
	 **/
	p.set = function(to) {
	    this.x = to.x; this.y = to.y;
	}

	/**
	 * Move Point by x/y deltas.
	 * 
	 * @method move
	 * @param {Number} dx - X delta.
	 * @param {Number} dy - Y delta.
	 **/
	p.move = function(dx, dy) {
	    this.x += dx; this.y += dy;
	}

	/**
	 * Move Point by distance in specified direction.
	 * 
	 * @method moveDir
	 * @param {Number} dist - distance to move.
	 * @param {Number} angle - direction (in radians).
	 **/
	p.moveDir = function(dist, angle) {
	    this.x += dist * Math.sin(angle);
	    this.y += dist * Math.cos(angle);
	}

	/**
	 * Transform Point by matrix
	 * 
	 * @method matrixTransform
	 * @param {Matrix} m
	 **/
	p.matrixTransform = function(m) {
		var x = this.x, y = this.y;
		
		this.x = x * m[0][0] + y * m[1][0] + m[2][0];
		this.y = x * m[0][1] + y * m[1][1] + m[2][1];
	}

	/**
	 * Rotate Point around pivot by specified angle.
	 * 
	 * @method rotate
	 * @param {Number} angle - rotation angle (in radians).
	 * @param {Point} pivot - pivot to rotate around.
	 **/
	p.rotate = function(angle, pivot) {
		var sina = Math.sin(angle), cosa = Math.cos(angle),
			px = pivot.x, py = pivot.y,
			x = this.x - px, y = this.y - py;
	    
	    this.x = x * cosa - y * sina + px;
	    this.y = x * sina + y * cosa + py;
	}

	/**
	 * Scale Point from pivot by specified scX/scY koefs.
	 * 
	 * @method scale
	 * @param {Number} scX - x scale koef.
	 * @param {Number} scY - y scale koef.
	 * @param {Point} pivot - pivot to scale from.
	 **/
	p.scale = function(scX, scY, pivot) {
	    var dx = this.x - pivot.x, dy = this.y - pivot.y;
	    this.x += scX * dx - dx; this.y += scY * dy - dy;
	}
	
	/**
	 * Return distance to the specified Point.
	 * 
	 * @method distTo
	 * @param {Point} to - Point to calculate distance to.
	 * 
	 * @return {Number} distance in pixels.
	 **/
	p.distTo = function(to) {
	    var dx = to.x - this.x, dy = to.y - this.y;
	    return Math.sqrt(dx * dx + dy * dy);
	}
	
	/**
	 * Return angle to the specified Point.
	 * 
	 * @method angleTo
	 * @param {Point} to - Point to calculate angle to.
	 * 
	 * @return {Number} angle in radians.
	 **/
	p.angleTo = function(to) {
	    return Math.atan2(this.y - to.y, this.x - to.x);
	}

	/**
	 * Clone this Point.
	 * 
	 * @method clone
	 * 
	 * @return {Point} a cloned Point.
	 **/
	p.clone = function() {
	    return new Point(this.x, this.y);
	}

	/**
	 * Return a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[Point(" + this.x + ", " + this.y + ")]";
	}
	
	//set up for global use
	window.Point = Point;
}() );
/*
 * Rectangle by OlegoS, 09 Apr 2013
 *
 * Rectangle implementation in 2D coordinate system.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * Rectangle is very important in geometry and rendering calculations.
	 * Has two points: from - up left point, to - bottom right point.
	 *
	 * @class Rectangle
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {Point} from - up left point. Default is Point(0, 0).
	 * @param {Point} to - bottom right point. Default is Point(0, 0).
	 **/
	var Rectangle = function(from, to) {
	    /**
	     * Up left point of rectangle.
	     * 
	     * @property from
	     * @type Point
	     **/
		this.from = (from == null ? new Point() : from);

	    /**
	     * Bottom right point of rectangle.
	     * 
	     * @property to
	     * @type Point
	     **/
		this.to = (to == null ? new Point() : to);
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Rectangle.prototype;
	
	/**
	 * Returns top right point of this Rectangle.
	 * 
	 * @method topRight
	 * 
	 * @return {Point} top right point of this Rectangle.
	 **/
	p.topRight = function() {
	    return new Point(this.to.x, this.from.y);
	}

	/**
	 * Returns bottom left right point of this Rectangle.
	 * 
	 * @method botLeft
	 * 
	 * @return {Point} bottom left point of this Rectangle.
	 **/
	p.botLeft = function() {
	    return new Point(this.from.x, this.to.y);
	}

	/**
	 * Returns width of this Rectangle.
	 * 
	 * @method getWidth
	 * 
	 * @return {Number} width of this Rectangle.
	 **/
	p.getWidth = function() {
	    return this.to.x - this.from.x;
	}

	/**
	 * Returns height of this Rectangle.
	 * 
	 * @method getHeight
	 * 
	 * @return {Number} height of this Rectangle.
	 **/
	p.getHeight = function() {
	    return this.to.y - this.from.y;
	}

	/**
	 * Returns a center point of this Rectangle.
	 * 
	 * @method getCenter
	 * 
	 * @return {Point} a center point of this Rectangle.
	 **/
	p.getCenter = function() {
	    return new Point((this.from.x + this.to.x) / 2, (this.from.y + this.to.y) / 2);
	}

	/**
	 * Place rectangle around specified Point.
	 * 
	 * @method placeAroundPoint
	 * @param {Point} pt - Center point of the Rectangle.
	 * @param {Number} dist - distance from center to sides.
	 **/
	p.placeAroundPoint = function(pt, dist) {
		var px = pt.x, py = pt.y, from = this.from, to = this.to;
		
		from.x = px - dist; from.y = py - dist;
		to.x = px + dist; to.y = py + dist;
	}

	/**
	 * Set rectangle equal to specified rectangle.
	 * 
	 * @method set
	 * @param {Rectangle} rect - the Rectangle.
	 **/
	p.set = function(rect) {
		this.from.set(rect.from); this.to.set(rect.to);
	}

	/**
	 * Set 'from' point up left to 'to' point.
	 * 
	 * @method normalize
	 **/
	p.normalize = function() {
		var a, from = this.from, to = this.to;
		
		if (from.x > to.x) { a = from.x; from.x = to.x; to.x = a; }
		if (from.y > to.y) { a = from.y; from.y = to.y; to.y = a; }
	}

	/**
	 * Returns true if point is inside this Rectangle.
	 * 
	 * @method hasPoint
	 * @param {Point} pt - point to test.
	 * 
	 * @return {Boolean} true if point is inside this Rectangle.
	 **/
	p.hasPoint = function(pt) {
	    return ( (this.from.x <= pt.x) && (pt.x <= this.to.x) && (this.from.y <= pt.y) && (pt.y <= this.to.y) );
	}

	/**
	 * Check intersection between two rectangles.
	 * 
	 * @method intersect
	 * @param {Rectangle} r - rectangle to test.
	 * 
	 * @return {Boolean} true if rectangles intersect or false otherwise.
	 **/
	p.intersect = function(r) {
	    var w = (Math.abs(this.getWidth()) + Math.abs(r.getWidth())) / 2,
	    	h = (Math.abs(this.getHeight()) + Math.abs(r.getHeight())) / 2,
	    	c1 = this.getCenter(), c2 = r.getCenter(),
	    	dx = c1.x - c2.x, dy = c1.y - c2.y;
	    
	    return ( (Math.abs(dx) <= w) && (Math.abs(dy) <= h) );
	}

	/**
	 * Clone this Rectangle.
	 * 
	 * @method clone
	 * 
	 * @return {Rectangle} a cloned Rectangle.
	 **/
	p.clone = function() {
	    return new Rectangle(this.from.clone(), this.to.clone());
	}

	/**
	 * Convert this Rectangle to Path.
	 * 
	 * @method toPath
	 * 
	 * @return {Path} result Path.
	 **/
	p.toPath = function() {
	    return new Path([this.from.clone(), this.topRight(), this.to.clone(), this.botLeft()], true);
	}

	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[Rectangle(from:" + this.from.toString() + ", to:" + this.to.toString() + ")]";
	}
	
	//set up for global use
	window.Rectangle = Rectangle;
}() );
/*
 * Path by OlegoS, 09 Apr 2013
 *
 * Path implementation in 2D coordinate system.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * Path can describe line, polyline and polygon and can have linear, quadratic curve and bezier segments.
	 * Has an array of points. Can be base class for other shapes.
	 * 
	 * Any of path points can be extended with dynamic properties. For example: p.prev and p.next describe
	 * control points for curved segments and p.mv, if true, then point only is for moveTo without drawing.
	 *
	 * @class Path
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {Array} points - points array. Default is empty array.
	 * @param {Boolean} closed - closed flag. Default is false.
	 **/
	var Path = function(points, closed) {
	//public properties:
		/**
	     * Closed flag.
	     * 
	     * @property closed
	     * @type Boolean
	     **/
	    this.closed = closed;
		
	    /**
	     * Points data provider.
	     * 
	     * @property points
	     * @type DataProvider
	     **/
	    this.points = new DataProvider(points);
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Path.prototype;
	
	/**
	 * Move Path points by x/y deltas.
	 * 
	 * @method move
	 * @param {Number} dx - X delta.
	 * @param {Number} dy - Y delta.
	 **/
	p.move = function(dx, dy) {
	    var pt = this.points.data, l = pt.length, p = null;
	    
	    for (var i = 0; i < l; i++) {
	    	p = pt[i];
	    	p.move(dx, dy);
	    	
	    	if (p.prev) p.prev.move(dx, dy);
	    	if (p.next) p.next.move(dx, dy);
	    }
	}
	
	/**
	 * Move Path points by distance in specified direction.
	 * 
	 * @method moveDir
	 * @param {Number} dist - distance to move.
	 * @param {Number} angle - direction (in radians).
	 **/
	p.moveDir = function(dist, angle) {
	    var pt = this.points.data, l = pt.length, p = null;
	    
	    for (var i = 0; i < l; i++) {
	    	p = pt[i];
	    	p.moveDir(dist, angle);
	    	
			if (p.prev) p.prev.moveDir(dist, angle);
			if (p.next) p.next.moveDir(dist, angle);
	    }
	}
	
	/**
	 * Rotate Path points around pivot by specified angle.
	 * 
	 * @method rotate
	 * @param {Number} angle - rotation angle (in radians).
	 * @param {Point} pivot - pivot to rotate around.
	 **/
	p.rotate = function(angle, pivot) {
	    var pt = this.points.data, l = pt.length, p = null;
	    
	    for (var i = 0; i < l; i++) {
	    	p = pt[i];
	    	p.rotate(angle, pivot);
	    	
	    	if (p.prev) p.prev.rotate(angle, pivot);
	    	if (p.next) p.next.rotate(angle, pivot);
	    }
	}
	
	/**
	 * Scale Path points from pivot by specified scX/scY koefs.
	 * 
	 * @method scale
	 * @param {Number} scX - x scale koef.
	 * @param {Number} scY - y scale koef.
	 * @param {Point} pivot - pivot to scale from.
	 **/
	p.scale = function(scX, scY, pivot) {
	    var pt = this.points.data, l = pt.length, p = null;
	    
	    for (var i = 0; i < l; i++) {
	    	p = pt[i];
	    	p.scale(scX, scY, pivot);
	    	
	   		if (p.prev) p.prev.scale(scX, scY, pivot);
	   		if (p.next) p.next.scale(scX, scY, pivot);
	    }
	}
	
	/**
	 * Apply matrix transformation to Path points.
	 * 
	 * @method matrixTransform
	 * @param {Matrix} m - a transformation matrix.
	 **/
	p.matrixTransform = function(m) {
	    var pt = this.points.data, l = pt.length, p = null;
	    
	    for (var i = 0; i < l; i++) {
	    	p = pt[i];
	    	p.matrixTransform(m);
	    	
	   		if (p.prev) p.prev.matrixTransform(m);
	   		if (p.next) p.next.matrixTransform(m);
	    }
	}
	
	/**
	 * Returns a bounding rectangle of this Path.
	 * 
	 * @method getBoundRect
	 * 
	 * @return {Rectangle} a bounding rectangle.
	 **/
	p.getBoundRect = function() {
	    //init vars
	    var pt = this.points.data, l = pt.length;
	    if (l == 0) return null;
	    
	    //set min and max to first point
	    var p = pt[0], x = p.x, y = p.y, minX = x, minY = y, maxX = x, maxY = y;
	    
	    //find min and max points
	    for (var i = 0; i < l; i++) {
	    	//check min/max in main points
	    	p = pt[i]; x = p.x; y = p.y;
	    	
	        if (x < minX) minX = x; if (y < minY) minY = y;
	        if (x > maxX) maxX = x; if (y > maxY) maxY = y;
	        
	        //check control points
	        var endi = i + 1; if (endi >= l) endi = 0;
	        var cp1 = p.next, cp2 = pt[endi].prev;
	        
	        if (cp1 || cp2) {
	        	//init temporary points
	        	var xx = [], yy = [], ep = pt[endi];
	        	
	        	//check curve type
	        	if (cp1 && cp2) {
	        		//bezier curve rect correction
	        		var cpx1 = cp1.x, cpy1 = cp1.y,
	        			cpx2 = cp2.x, cpy2 = cp2.y;
	        		
	        		var mx1 = (x + cpx1) / 2, my1 = (y + cpy1) / 2,
	        			mx3 = (cpx1 + cpx2) / 2, my3 = (cpy1 + cpy2) / 2,
	        			mx2 = (mx1 + mx3) / 2, my2 = (my1 + my3) / 2,
	        			mx5 = (cpx2 + ep.x) / 2, my5 = (cpy2 + ep.y) / 2,
	        			mx4 = (mx3 + mx5) / 2, my4 = (my3 + my5) / 2;
	        		
	        		xx.push(mx1, mx2, mx4, mx5);
	        		yy.push(my1, my2, my4, my5);
	        	} else {
	        		//quadratic curve rect correction
	        		var cp = cp1 || cp2, cpx = cp.x, cpy = cp.y;
	        		
	        		xx.push((x + cpx) / 2, (cpx + ep.x) / 2);
	        		yy.push((y + cpy) / 2, (cpy + ep.y) / 2);
	        	}
	        	
	        	//check min/max in temporary points
	        	for (var j = 0, ll = xx.length; j < ll; j++) {
	        		x = xx[j]; y = yy[j];
	                if (x < minX) minX = x; if (y < minY) minY = y;
	                if (x > maxX) maxX = x; if (y > maxY) maxY = y;
	        	}
	        }
	    }
	    
	    //return rectangle
	    return new Rectangle(new Point(minX, minY), new Point(maxX, maxY));
	}
	
	/**
	 * Returns a center point of this Path.
	 * 
	 * @method getCenter
	 * 
	 * @return {Point} a center point.
	 **/
	p.getCenter = function() {
	    if (this.points.data.length > 0) return this.getBoundRect().getCenter(); else return null;
	}
	
	/**
	 * Align Path by base in bounds of specified rectangle.
	 * 
	 * @method align
	 * @param {String} base - align base: 'left', 'right', 'center', 'top', 'bottom', 'vert'.
	 * @param {Rectangle} rect - align rectangle.
	 **/
	p.align = function(base, rect) {
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
	
	    //move object
	    this.move(dx, dy);
	}
	
	/**
	 * Mirror Path acording to orientation.
	 * 
	 * @method mirror
	 * @param {String} orientation - 'horiz' - horizontal, 'vert' - vertical.
	 **/
	p.mirror = function(orientation) {
	    switch(orientation) {
	        case 'horiz':
	            this.scale(-1, 1, this.getCenter());
	        break;

	        case 'vert':
	            this.scale(1, -1, this.getCenter());
	        break;
	    }
	}
	
	/**
	 * Place Path around specified Point.
	 * 
	 * @method placeAroundPoint
	 * @param {Point} pt - center point.
	 * @param {Number} dist - distance from center to sides.
	 **/
	p.placeAroundPoint = function(pt, dist) {
	    var r = new Rectangle();
	    r.placeAroundPoint(pt, dist);
	    this.placeIntoRect(r);
	}
	
	/**
	 * Place Path into specified rectangle.
	 * 
	 * @method placeIntoRect
	 * @param {Rectangle} tR - the Rectangle.
	 **/
	p.placeIntoRect = function(tR) {
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
	}
	
	/**
	 * Clone this Path.
	 * 
	 * @method clone
	 * 
	 * @return {Path} a cloned Path.
	 **/
	p.clone = function() {
		//init vars
	    var pt = this.points.data, l = pt.length, tmpArr = [], p = null, p2 = null;;
		
	    //clone points
	    for (var i = 0; i < l; i++) {
	    	p = pt[i]; p2 = p.clone();
	    	
	    	if (p.mv) p2.mv = p.mv;
	    	if (p.prev) p2.prev = p.prev.clone();
	    	if (p.next) p2.next = p.next.clone();
	    	
	    	tmpArr.push(p2);
	    }
	    
	    //return cloned path
	    return new Path(tmpArr, this.closed);
	}
	
	/**
	 * Create ellipse in this Path.
	 * 
	 * @method ellipse
	 * @param {Point} c - center.
	 * @param {Number} r1 - radius 1.
	 * @param {Number} r2 - radius 2.
	 **/
	p.ellipse = function(c, r1, r2) {
		this.points.clear(); this.closed = true;
		
		//init vars
		var pt = this.points.data, x = c.x, y = c.y, qr1 = r1 / 2, qr2 = r2 / 2;
		pt.push(new Point(x, y - r1), new Point(x + r2, y), new Point(x, y + r1), new Point(x - r2, y));
		
		//setup curve
		pt[0].prev = new Point(x - qr2, y - r1); pt[0].next = new Point(x + qr2, y - r1);
		pt[1].prev = new Point(x + r2, y - qr1); pt[1].next = new Point(x + r2, y + qr1);
		pt[2].prev = new Point(x + qr2, y + r1); pt[2].next = new Point(x - qr2, y + r1);
		pt[3].prev = new Point(x - r2, y + qr1); pt[3].next = new Point(x - r2, y - qr1);
	}
	
	/**
	 * Create star in this Path.
	 * 
	 * @method star
	 * @param {Point} c - center.
	 * @param {Number} r1 - radius 1.
	 * @param {Number} r2 - radius 2.
	 * @param {Number} num_v - number of vertices.
	 * @param {Number} ofs - angle offset.
	 **/
	p.star = function(c, r1, r2, num_v, ofs) {
		this.points.clear(); this.closed = true;
		
		//init vars
		num_v *= 2;
		var alfa = 0, step = 2 * Math.PI / num_v, r = 0, ang = 0;
		
		//setup path
		for (var i = 0; i < num_v; i++) {
			if (r == r1) { r = r2; ang = alfa + ofs; } else { r = r1; ang = alfa; }
			this.points.add(new Point(c.x + r * Math.sin(ang), c.y + r * Math.cos(ang)));
			alfa += step;
		}
	}
	
	/**
	 * Get/Set Path svg value.
	 * 
	 * @method svg
	 * @param {String} d - svg path notation from 'd' attribute.
	 * 
	 * @return {String} path as svg 'd' string, when called without arguments.
	 **/
	p.svg = function(d) {
		//init vars
		var points = this.points.data, i = 0, pt;
		
		//return path as svg 'd' string
		if (!d) {
			var l = points.length, str = '', cp;
			if (l == 0) return str; else { pt = points[0]; str = 'M' + pt.x.toFixed(3) + ',' + pt.y.toFixed(3); }
			
			for (i = 1; i < l; i++) {
				pt = points[i];
				
				//move point
				if (pt.mv) {
					str += ' M' + pt.x.toFixed(3) + ',' + pt.y.toFixed(3);
					
				//drawing point
				} else {
					cp = points[i - 1].next || pt.prev;
					
					//curve
					if (cp) {
						//quadratic
						if (cp == pt.prev) {
							str += ' Q' + cp.x.toFixed(3) + ',' + cp.y.toFixed(3) +
									' ' + pt.x.toFixed(3) + ',' + pt.y.toFixed(3);
							
						//cubic bezier
						} else {
							str += ' C' + cp.x.toFixed(3) + ',' + cp.y.toFixed(3) +
									' ' + pt.prev.x.toFixed(3) + ',' + pt.prev.y.toFixed(3) +
									' ' + pt.x.toFixed(3) + ',' + pt.y.toFixed(3);
						}
						
					//line
					} else str += ' L' + pt.x.toFixed(3) + ',' + pt.y.toFixed(3);
				}
			}
			
			//close and return
			if (this.closed) str += 'Z';
			return str;
			
		//or apply regexp, copied from canvg to prepare 'd' string for parsing
		} else {
			//get rid of all commas
			d = d.replace(/,/gm,' ');
			
			//separate commands from commands
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2');
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2');
			
			//separate commands from points
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm,'$1 $2');
			d = d.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2');
			
			//separate digits when no comma
			d = d.replace(/([0-9])([+\-])/gm,'$1 $2');
			d = d.replace(/(\.[0-9]*)(\.)/gm,'$1 $2');
			
			//shorthand elliptical arc path syntax
			d = d.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm,'$1 $3 $4 ');
			
			//compress multiple spaces and trim
			d = d.replace(/[\s\r\t\n]+/gm, ' ');
			d = d.replace(/^\s+|\s+$/g, '');
			
			//split tokens
			d = d.split(' ');
		}
		
		//parse svg path 'd' string
		var cmd, prevCmd, last = d.length - 1, startX = 0, startY = 0, curX = 0, curY = 0, cpX = 0, cpY = 0;
		points.length = 0; this.closed = false;
		
		//process path commands
		while (i <= last) {
			//check command
			cmd = d[i++];
			
			//'m' and 'M'
			if (cmd == 'M') {
				curX = parseFloat(d[i++]); curY = parseFloat(d[i++]);
				if (!prevCmd) { startX = curX; startY = curY; }
				
				pt = new Point(curX, curY); pt.mv = true;
				points.push(pt);
				
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
					curX = parseFloat(d[i++]); curY = parseFloat(d[i++]);
					pt = new Point(curX, curY); points.push(pt);
				}
			} else if (cmd == 'm') {
				curX += parseFloat(d[i++]); curY += parseFloat(d[i++]);
				if (!prevCmd) { startX = curX; startY = curY; }
				
				pt = new Point(curX, curY); pt.mv = true;
				points.push(pt);
				
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
					curX += parseFloat(d[i++]); curY += parseFloat(d[i++]);
					pt = new Point(curX, curY); points.push(pt);
				}
				
			//'l' and 'L'
			} else if (cmd == 'L') {
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
					curX = parseFloat(d[i++]); curY = parseFloat(d[i++]);
					pt = new Point(curX, curY); points.push(pt);
				}
			} else if (cmd == 'l') {
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
					curX += parseFloat(d[i++]); curY += parseFloat(d[i++]);
					pt = new Point(curX, curY); points.push(pt);
				}
				
			//'h' and 'H'
			} else if (cmd == 'H') {
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
					curX = parseFloat(d[i++]);
					pt = new Point(curX, curY); points.push(pt);
				}
			} else if (cmd == 'h') {
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
					curX += parseFloat(d[i++]);
					pt = new Point(curX, curY); points.push(pt);
				}
				
			//'v' and 'V'
			} else if (cmd == 'V') {
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
					curY = parseFloat(d[i++]);
					pt = new Point(curX, curY); points.push(pt);
				}
			} else if (cmd == 'v') {
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
					curY += parseFloat(d[i++]);
					pt = new Point(curX, curY); points.push(pt);
				}
				
			//'c' and 'C'
			} else if (cmd == 'C') {
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
					pt.next = new Point(parseFloat(d[i++]), parseFloat(d[i++]));
					
					cpX = parseFloat(d[i++]); cpY = parseFloat(d[i++]);
					curX = parseFloat(d[i++]); curY = parseFloat(d[i++]);
					
					pt = new Point(curX, curY); pt.prev = new Point(cpX, cpY);
					points.push(pt);
				}
			} else if (cmd == 'c') {
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
					pt.next = new Point(curX + parseFloat(d[i++]), curY + parseFloat(d[i++]));
					
					cpX = curX + parseFloat(d[i++]); cpY = curY + parseFloat(d[i++]);
					curX += parseFloat(d[i++]); curY += parseFloat(d[i++]);
					
					pt = new Point(curX, curY); pt.prev = new Point(cpX, cpY);
					points.push(pt);
				}
				
			//'s' and 'S'
			} else if (cmd == 'S') {
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
					if (prevCmd == 'C' || prevCmd == 'c' || prevCmd == 'S' || prevCmd == 's') {
						pt.next = new Point(2 * curX - cpX, 2 * curY - cpY);
					} else {
						pt.next = new Point(curX, curY);
					}
					
					cpX = parseFloat(d[i++]); cpY = parseFloat(d[i++]);
					curX = parseFloat(d[i++]); curY = parseFloat(d[i++]);
					
					pt = new Point(curX, curY); pt.prev = new Point(cpX, cpY);
					points.push(pt);
				}
			} else if (cmd == 's') {
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
					if (prevCmd == 'C' || prevCmd == 'c' || prevCmd == 'S' || prevCmd == 's') {
						pt.next = new Point(2 * curX - cpX, 2 * curY - cpY);
					} else {
						pt.next = new Point(curX, curY);
					}
					
					cpX = curX + parseFloat(d[i++]); cpY = curY + parseFloat(d[i++]);
					curX += parseFloat(d[i++]); curY += parseFloat(d[i++]);
					
					pt = new Point(curX, curY); pt.prev = new Point(cpX, cpY);
					points.push(pt);
				}
				
			//'q' and 'Q'
			} else if (cmd == 'Q') {
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
					cpX = parseFloat(d[i++]); cpY = parseFloat(d[i++]);
					curX = parseFloat(d[i++]); curY = parseFloat(d[i++]);
					
					pt = new Point(curX, curY); pt.prev = new Point(cpX, cpY);
					points.push(pt);
				}
			} else if (cmd == 'q') {
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
					cpX = curX + parseFloat(d[i++]); cpY = curY + parseFloat(d[i++]);
					curX += parseFloat(d[i++]); curY += parseFloat(d[i++]);
					
					pt = new Point(curX, curY); pt.prev = new Point(cpX, cpY);
					points.push(pt);
				}
				
			//'t' and 'T'
			} else if (cmd == 'T') {
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
					if (prevCmd == 'Q' || prevCmd == 'q' || prevCmd == 'T' || prevCmd == 't') {
						cpX = 2 * curX - cpX; cpY = 2 * curY - cpY;
					} else {
						cpX = curX; cpY = curY;
					}
					
					curX = parseFloat(d[i++]); curY = parseFloat(d[i++]);
					pt = new Point(curX, curY); pt.prev = new Point(cpX, cpY);
					points.push(pt);
				}
			} else if (cmd == 't') {
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
					if (prevCmd == 'Q' || prevCmd == 'q' || prevCmd == 'T' || prevCmd == 't') {
						cpX = 2 * curX - cpX; cpY = 2 * curY - cpY;
					} else {
						cpX = curX; cpY = curY;
					}
					
					curX += parseFloat(d[i++]); curY += parseFloat(d[i++]);
					pt = new Point(curX, curY); pt.prev = new Point(cpX, cpY);
					points.push(pt);
				}
				
			//'a' and 'A'
			} else if (cmd == 'A') {
				//need to implement
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) i += 7;
			} else if (cmd == 'a') {
				while (i <= last && d[i].match(/^[A-Za-z]$/) == null) i += 7;
				
			//'z' and 'Z'
			} else if (cmd == 'Z' || cmd == 'z') {
				curX = startX; curY = startY;
			}
			
			//set previous cmd
			prevCmd = cmd;
		}
	}
	
	/**
	 * Add Path to graphics context, where it may be rendered or used anyway else.
	 * Context must be method-compatible with CanvasRenderingContext2D.
	 * 
	 * @method toContext
	 * @param {CanvasRenderingContext2D} ctx - context.
	 **/
	p.toContext = function(ctx) {
		
	}
	
	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[Path(" + this.points.data + ")]";
	}
	
	//set up for global use
	window.Path = Path;
}() );
/*
 * Font by OlegoS, 20 Jul 2013
 *
 * Font contains all converted ttf info. Used by FontManager and Text.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * Font is used to render vector text on canvas.
	 * It is registered by FontsManager.
	 *
	 * @class Font
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {Object} fnt - source font object.
	 **/
	var Font = function(fnt) {
		/**
		 * Family name.
		 * 
		 * @property family
		 * @type String
		 **/
		this.family = fnt.original_font_information.font_family_name.toLowerCase();
		
		/**
		 * Full name.
		 * 
		 * @property fullName
		 * @type String
		 **/
		this.fullName = fnt.original_font_information.full_font_name.toLowerCase();
		
		/**
		 * Postscript name.
		 * 
		 * @property postscriptName
		 * @type String
		 **/
		this.postscriptName = fnt.original_font_information.postscript_name.toLowerCase();
		
		/**
		 * Weight, bold|bolder|lighter|normal.
		 * 
		 * @property weight
		 * @type String
		 **/
		this.weight = fnt.cssFontWeight.toLowerCase();
		
		/**
		 * Style, normal|italic|oblique.
		 * 
		 * @property style
		 * @type String
		 **/
		this.style = fnt.cssFontStyle.toLowerCase();
		
		/**
		 * Ascender.
		 * 
		 * @property ascender
		 * @type Number
		 **/
		this.ascender = Number(fnt.ascender);
		
		/**
		 * Descender.
		 * 
		 * @property descender
		 * @type Number
		 **/
		this.descender = Number(fnt.descender);
		
		/**
		 * Underline position.
		 * 
		 * @property ascender
		 * @type Number
		 **/
		this.underlinePosition = Number(fnt.underlinePosition);
		
		/**
		 * Underline thickness.
		 * 
		 * @property underlineThickness
		 * @type Number
		 **/
		this.underlineThickness = Number(fnt.underlineThickness);
		
		/**
		 * Line height.
		 * 
		 * @property lineHeight
		 * @type Number
		 **/
		this.lineHeight = Number(fnt.lineHeight);
		
		/**
		 * Resolution.
		 * 
		 * @property resolution
		 * @type Number
		 **/
		this.resolution = Number(fnt.resolution);
		
		/**
		 * Raw glyphs info.
		 * Each glyph is an object - { ha: x offset, o: "path as String" }.
		 * 
		 * @property rawGlyphsInfo
		 * @type Object
		 **/
		this.rawGlyphsInfo = fnt.glyphs;
		
		/**
		 * Unpacked usable glyphs. Used for Text rendering.
		 * Each glyph is an object - { ha: x offset, path: path as Path }.
		 * 
		 * @property glyphs
		 * @type Object
		 **/
		this.glyphs = {};
		
		/**
		 * 'S' glyph height.
		 * 
		 * @property sHeight
		 * @type Number
		 **/
		this.sHeight = this.getGlyph('S').path.getBoundRect().getHeight();
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Font.prototype;
	
	/**
	 * Unpack raw glyph to usable.
	 * 
	 * @method _unpackGlyph
	 * @param {String} ch - character.
	 **/
	p.unpackGlyph = function(ch) {
		//check glyph info and set empty path if none
		var glyphInfo = this.rawGlyphsInfo[ch];
		
		if (!glyphInfo) {
			this.glyphs[ch] = { ha: 0, path: null };
			return;
		}
		
		//process outline
		var path = new Path(), ol = glyphInfo.o, points, cmd, p;
		
		if (ol) {
			//process path commands
			ol = ol.split(' '); points = path.points.data;
			
			for (var i = 0, l = ol.length; i < l;) {
				//get command
				cmd = ol[i++];
				
				//move
				if (cmd == 'm') {
					p = new Point(Number(ol[i++]), Number(ol[i++])); p.mv = true;
					points.push(p);
					
				//straight line
				} else if (cmd == 'l') {
					points.push(new Point(Number(ol[i++]), Number(ol[i++])));
					
				//quadratic curve
				} else if (cmd == 'q') {
					p = new Point(Number(ol[i++]), Number(ol[i++]));
					p.prev = new Point(Number(ol[i++]), Number(ol[i++]));
					points.push(p);
					
				//bezier curve
				} else if (cmd == 'b') {
					p = new Point(Number(ol[i++]), Number(ol[i++]));
					points[points.length - 1].next = new Point(Number(ol[i++]), Number(ol[i++]));
					p.prev = new Point(Number(ol[i++]), Number(ol[i++]));
					points.push(p);
				}
			}
		}
	
		//set up glyph
		this.glyphs[ch] = { ha: glyphInfo.ha, path: path };
	}
	
	/**
	 * Get unpacked usable glyph.
	 * 
	 * @method getGlyph
	 * @param {String} ch - character.
	 * 
	 * @return {Object} unpacked glyph as { ha: x offset, path: path as Path }.
	 **/
	p.getGlyph = function(ch) {
		if (!this.glyphs[ch]) this.unpackGlyph(ch);
		return this.glyphs[ch];
	}

	/**
	 * Return a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[Font(" + this.fullName + ")]";
	}
	
	//set up for global use
	window.Font = Font;
}() );
/*
 * FontsManager by OlegoS, 10 Apr 2013
 *
 * A vector font manager based on typefacejs rendering method.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	
	
//STATIC
	/**
	 * FontsManager can load and render fonts as vector data stored as object in a javascript file,
	 * which can be created with a font converter from ttf font file.
	 * 
	 * FontsManager has a configuration, stored in 'fonts_config.js' file, which contains a relationship
	 * between font files and styles. It is used for dynamic font load on demand.
	 * 
	 * If there is no requested font, it is substituted by 'Verdana', which must be added (bold and italic too)
	 * in any case to work properly.
	 * 
	 * Converter is a perl script, stored in Converter directory - it can be used as command line tool
	 * or uploaded to server and used online as cgi script.
	 * 
	 * @class FontsManager
	 * @author OlegoS
	 *
	 * @static
	 **/
	var FontsManager = {
		/**
	     * Font filenames stored by font family_weight_style as key.
	     * 
	     * @property fileByStyle
	     * @type Object
	     **/
	    fileByStyle: {},
	    
		/**
	     * Font data stored by font family_weight_style as key.
	     * 
	     * @property fontByStyle
	     * @type Object
	     **/
	    fontByStyle: {},
	    
	    /**
	     * Font styles stored by Font.postscriptName as key.
	     * Styles are stored as objects like { fontFamily: 'family', fontWeight: 'weight', fontStyle: 'style' }.
	     * 
	     * @property styleByPostscript
	     * @type Object
	     **/
	    styleByPostscript: {},
		
	    /**
		 * Load external font or config file.
		 * 
		 * @method load
		 * @param {String} src - path to font file.
		 **/
	    load: function(src) {
	    	var ajax = ( XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP') );
			
			ajax.open('GET', src, false);
			ajax.send(null);
			
		    eval(ajax.responseText);
		},
		
		/**
		 * Set up configuration for font files and styles.
		 * 
		 * @method setConfig
		 * @param {Array} cfg - config info.
		 **/
		setConfig: function(cfg) {
			for (var i = 0, l = cfg.length, f, s; i < l; i++) {
				f = cfg[i]; s = { fontFamily: f.family, fontWeight: f.weight, fontStyle: f.style };
				
				this.styleByPostscript[f.postscript] = s;
				this.fileByStyle[ this.getStyleKey(s) ] = f.file;
			}
		},
		
		/**
		 * Used by font file after loading.
		 * 
		 * @method addFont
		 * @param {Object} fnt - font data.
		 **/
		addFont: function(fnt) {
			var font = new Font(fnt);
			this.fontByStyle[font.family + '_' + font.weight + '_' + font.style] = font;
			
			this.styleByPostscript[font.postscriptName] = {
				fontFamily: font.family, fontWeight: font.weight, fontStyle: font.style
			};
		},
		
		/**
		 * Get style key to access fonts by style.
		 * 
		 * @method getStyleKey
		 * @param {Object} style - font style.
		 * 
		 * @return {String} font key.
		 **/
		getStyleKey: function(style) {
			return style.fontFamily.toLowerCase() + '_' + style.fontWeight.toLowerCase() + '_' + style.fontStyle.toLowerCase();
		},
		
		/**
		 * Get working path to font file by style info.
		 * 
		 * @method getFileByStyle
		 * @param {Object} style - font style.
		 * 
		 * @return {String} font filename.
		 **/
		getFileByStyle: function(style) {
			var file = this.fileByStyle[ this.getStyleKey(style) ];
			if (file) return Main.baseDir + 'fonts/' + file; else return '';
		},
		
		/**
		 * Get font by style.
		 * 
		 * @method getFontByStyle
		 * @param {Object} style - font style.
		 * 
		 * @return {Font} font reference.
		 **/
		getFontByStyle: function(style) {
			var font = this.fontByStyle[ this.getStyleKey(style) ];
			
			if (!font) {
				var file = this.getFileByStyle(style);
				
				if (file == '') {
					style = { fontFamily: 'verdana', fontWeight: style.fontWeight, fontStyle: style.fontStyle };
					file = this.getFileByStyle(style);
				}
				
				this.load(file);
				font = this.fontByStyle[ this.getStyleKey(style) ];
			}
			
			return font;
		}
	};
	
	
//PROTOTYPE
	//configure
	FontsManager.setConfig([
	    { family: 'verdana', weight: 'normal', style: 'normal', postscript: 'verdana', file: 'verdana.js' },
	    { family: 'verdana', weight: 'normal', style: 'italic', postscript: 'verdana-italic', file: 'verdana italic.js' },
	    { family: 'verdana', weight: 'bold', style: 'normal', postscript: 'verdana-bold', file: 'verdana bold.js' },
	    { family: 'verdana', weight: 'bold', style: 'italic', postscript: 'verdana-bolditalic', file: 'verdana bold italic.js' },
	    
		{ family: 'arial black', weight: 'normal', style: 'normal', postscript: 'arial-black', file: 'arial black.js' },
		{ family: 'bembo bq', weight: 'normal', style: 'normal', postscript: 'bembobq-bold', file: 'bembo monotype bold.js' },
		{ family: 'arialmt', weight: 'normal', style: 'normal', postscript: 'arialmt', file: 'arialmt.js' },
		{ family: 'bembo mt semibold', weight: 'normal', style: 'normal', postscript: 'bembomt-semibold', file: 'bembo mt semibold.js' },
		{ family: 'oswald', weight: 'normal', style: 'normal', postscript: 'oswald-regular', file: 'oswald regular.js' },
		{ family: 'arial narrow', weight: 'bold', style: 'italic', postscript: 'arialnarrow-bolditalic', file: 'arial narrow bold italic.js' },
		{ family: 'calibri', weight: 'bold', style: 'italic', postscript: 'calibri-bolditalic', file: 'calibri bold italic.js' },
		{ family: 'arial narrow', weight: 'bold', style: 'normal', postscript: 'arialnarrow-bold', file: 'arial narrow bold.js' },
		{ family: 'calibri', weight: 'bold', style: 'normal', postscript: 'calibri-bold', file: 'calibri bold.js' },
		{ family: 'trebuchet ms', weight: 'normal', style: 'normal', postscript: 'trebuchetms', file: 'trebuchet ms.js' },
		{ family: 'arial narrow', weight: 'normal', style: 'italic', postscript: 'arialnarrow-italic', file: 'arial narrow italic.js' },
		{ family: 'calibri', weight: 'normal', style: 'italic', postscript: 'calibri-italic', file: 'calibri italic.js' },
		{ family: 'arial narrow', weight: 'normal', style: 'normal', postscript: 'arialnarrow', file: 'arial narrow.js' },
		{ family: 'calibri', weight: 'normal', style: 'normal', postscript: 'calibri', file: 'calibri.js' },
		{ family: 'arno pro', weight: 'bold', style: 'normal', postscript: 'arnopro-bold', file: 'arnopro-bold.js' },
		{ family: 'calibri light', weight: 'normal', style: 'italic', postscript: 'calibri-lightitalic', file: 'calibri light italic.js' },
		{ family: 'bembo', weight: 'bold', style: 'normal', postscript: 'bembo-bold', file: 'bembo bold.js' },
		{ family: 'calibri light', weight: 'normal', style: 'normal', postscript: 'calibri-light', file: 'calibri light.js' },
		{ family: 'bembo', weight: 'normal', style: 'italic', postscript: 'bembo-italic', file: 'bembo italic.js' },
		{ family: 'copper penny dtp', weight: 'normal', style: 'normal', postscript: 'copperpennydtpnormal', file: 'copper penny dtp normal.js' },
		{ family: 'impact mt', weight: 'normal', style: 'normal', postscript: 'impactmt', file: 'impact mt.js' }
	]);
	
	//set up for global use
	window.FontsManager = FontsManager;
}() );
/*
 * Color by OlegoS, 4 Apr 2013
 * 
 * Color implementation for automatic calculation RGB, CMYK and HSV values and simple conversion between them.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	//hexByName and nameByHex tables
	var hexByName = {
        aliceblue: 'f0f8ff', antiquewhite: 'faebd7', aqua: '00ffff', aquamarine: '7fffd4', azure: 'f0ffff', beige: 'f5f5dc', bisque: 'ffe4c4', black: '000000',
        blanchedalmond: 'ffebcd', blue: '0000ff', blueviolet: '8a2be2', brown: 'a52a2a', burlywood: 'deb887', cadetblue: '5f9ea0', chartreuse: '7fff00',
        chocolate: 'd2691e', coral: 'ff7f50', cornflowerblue: '6495ed', cornsilk: 'fff8dc', crimson: 'dc143c', cyan: '00ffff', darkblue: '00008b', darkcyan: '008b8b',
        darkgoldenrod: 'b8860b', darkgray: 'a9a9a9', darkgreen: '006400', darkkhaki: 'bdb76b', darkmagenta: '8b008b', darkolivegreen: '556b2f', darkorange: 'ff8c00',
        darkorchid: '9932cc', darkred: '8b0000', darksalmon: 'e9967a', darkseagreen: '8fbc8f', darkslateblue: '483d8b', darkslategray: '2f4f4f', darkturquoise: '00ced1',
        darkviolet: '9400d3', deeppink: 'ff1493', deepskyblue: '00bfff', dimgray: '696969', dodgerblue: '1e90ff', feldspar: 'd19275', firebrick: 'b22222', floralwhite: 'fffaf0',
        forestgreen: '228b22', fuchsia: 'ff00ff', gainsboro: 'dcdcdc', ghostwhite: 'f8f8ff', gold: 'ffd700', goldenrod: 'daa520', gray: '808080', green: '008000',
        greenyellow: 'adff2f', honeydew: 'f0fff0', hotpink: 'ff69b4', indianred : 'cd5c5c', indigo : '4b0082', ivory: 'fffff0', khaki: 'f0e68c', lavender: 'e6e6fa',
        lavenderblush: 'fff0f5', lawngreen: '7cfc00', lemonchiffon: 'fffacd', lightblue: 'add8e6', lightcoral: 'f08080', lightcyan: 'e0ffff', lightgoldenrodyellow: 'fafad2',
        lightgrey: 'd3d3d3', lightgreen: '90ee90', lightpink: 'ffb6c1', lightsalmon: 'ffa07a', lightseagreen: '20b2aa', lightskyblue: '87cefa', lightslateblue: '8470ff',
        lightslategray: '778899', lightsteelblue: 'b0c4de', lightyellow: 'ffffe0', lime: '00ff00', limegreen: '32cd32', linen: 'faf0e6', magenta: 'ff00ff', maroon: '800000',
        mediumaquamarine: '66cdaa', mediumblue: '0000cd', mediumorchid: 'ba55d3', mediumpurple: '9370d8', mediumseagreen: '3cb371', mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a', mediumturquoise: '48d1cc', mediumvioletred: 'c71585', midnightblue: '191970', mintcream: 'f5fffa', mistyrose: 'ffe4e1', moccasin: 'ffe4b5',
        navajowhite: 'ffdead', navy: '000080', oldlace: 'fdf5e6', olive: '808000', olivedrab: '6b8e23', orange: 'ffa500', orangered: 'ff4500', orchid: 'da70d6',
        palegoldenrod: 'eee8aa', palegreen: '98fb98', paleturquoise: 'afeeee', palevioletred: 'd87093', papayawhip: 'ffefd5', peachpuff: 'ffdab9', peru: 'cd853f', pink: 'ffc0cb',
        plum: 'dda0dd', powderblue: 'b0e0e6', purple: '800080', red: 'ff0000', rosybrown: 'bc8f8f', royalblue: '4169e1', saddlebrown: '8b4513', salmon: 'fa8072',
        sandybrown: 'f4a460', seagreen: '2e8b57', seashell: 'fff5ee', sienna: 'a0522d', silver: 'c0c0c0', skyblue: '87ceeb', slateblue: '6a5acd', slategray: '708090',
        snow: 'fffafa', springgreen: '00ff7f', steelblue: '4682b4', tan: 'd2b48c', teal: '008080', thistle: 'd8bfd8', tomato: 'ff6347', turquoise: '40e0d0', violet: 'ee82ee',
        violetred: 'd02090', wheat: 'f5deb3', white: 'ffffff', whitesmoke: 'f5f5f5', yellow: 'ffff00', yellowgreen: '9acd32'
	}, nameByHex = {};
	
	for (var key in hexByName) nameByHex[hexByName[key]] = key;
	
	
//CONSTRUCTOR
	/**
	 * Color may be initialized from RGB, HSV, CMYK or CSS color string.
	 * Supports standart colors by names. Default color is '#000000'.
	 * 
	 * @class Color
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {Object} val - initial color.
	 **/
	var Color = function(val) {
		/**
	     * Init RGB values for internal calculations. Stored as values between 0 and 1.
	     * 
	     * @property _rgb
	     * @type Object
	     * 
	     * @private
	     **/
		this._rgb = { r: 0, g: 0, b: 0 };
		
		//init color
		if (val) {
			if (val.r != null) this.rgb(val);
			else if (val.h != null) this.hsv(val);
			else if (val.c != null) this.cmyk(val);
			
			else if (val.substr) {
				if (val.substr(0, 3).toLowerCase() == 'rgb') this.rgb(val);
				else if (val.substr(0, 1) == '#') this.hex(val);
				else this.name(val);
			}
		}
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Color.prototype;
	
	/**
	 * SET color from number.
	 * 
	 * @method num
	 * @param {Number} n - number value.
	 * 
	 * @return {Object} this for chaining.
	 **/
	p.num = function(n) {
		var rgb = this._rgb, hex = n.toString(16), l = 6 - hex.length;
		
		if (l > 0) {
			for (var i = 0, a = ''; i < l; i++) a += '0';
			hex = a + hex;
		}
		
		rgb.r = parseInt(hex.substr(0, 2), 16) / 255;
		rgb.g = parseInt(hex.substr(2, 2), 16) / 255;
		rgb.b = parseInt(hex.substr(4, 2), 16) / 255;
		
		return this;
	}
	
	/**
	 * GET/SET color from name.
	 * 
	 * @method name
	 * @param {String} name - color name.
	 * 
	 * @return {Object} this for chaining or if no args - color name or 'black'.
	 **/
	p.name = function(name) {
		if (!name) return nameByHex[this.hex().substr(1)] || 'black';
		
		var rgb = this._rgb, hex = hexByName[name] || '000000';
		rgb.r = parseInt(hex.substr(0, 2), 16) / 255;
		rgb.g = parseInt(hex.substr(2, 2), 16) / 255;
		rgb.b = parseInt(hex.substr(4, 2), 16) / 255;
		
		return this;
	}
	
	/**
	 * GET/SET color from hex string.
	 * 
	 * @method hex
	 * @param {String} hex - '#rrggbb' or '#rgb'.
	 * 
	 * @return {Object} this for chaining or if no args - hex as '#rrggbb'.
	 **/
	p.hex = function(hex) {
		var rgb = this._rgb, r, g, b;
		
		if (!hex)  {
			rgb = this.rgb();
			
			r = rgb.r.toString(16), g = rgb.g.toString(16), b = rgb.b.toString(16);
			if (r.length == 1) r = '0' + r;
			if (g.length == 1) g = '0' + g;
			if (b.length == 1) b = '0' + b;
			  
			return ('#' + r + g + b);
		}
		
		if (hex.substr(0, 1) == '#') hex = hex.substr(1);
		
		if (hex.length == 6) {
			rgb.r = parseInt(hex.substr(0, 2), 16) / 255;
			rgb.g = parseInt(hex.substr(2, 2), 16) / 255;
			rgb.b = parseInt(hex.substr(4, 2), 16) / 255;
		} else if (hex.length == 3) {
			r = hex.substr(0, 1), g = hex.substr(1, 1), b = hex.substr(2, 1);
			rgb.r = parseInt(r + r, 16) / 255;
			rgb.g = parseInt(g + g, 16) / 255;
			rgb.b = parseInt(b + b, 16) / 255;
		} else {
			rgb.r = rgb.g = rgb.b = 0;
		}
		    
		return this;
	}
	
	/**
	 * GET/SET color from rgb.
	 * 
	 * @method rgb
	 * @param {Object} rgb - { r: red, g: green, b: blue } or 'rgb(r, g, b)'.
	 * 
	 * @return {Object} this for chaining or if no args - rgb as { r: red, g: green, b: blue }.
	 **/
	p.rgb = function(rgb) {
		var _rgb = this._rgb;
		if (!rgb) return { r: Math.round(_rgb.r * 255), g: Math.round(_rgb.g * 255), b: Math.round(_rgb.b * 255) };
		
		if (rgb.substr && rgb.substr(0, 3).toLowerCase() == 'rgb') {
			var tmp = rgb.split('(')[1].split(',');
			_rgb.r = parseInt(tmp[0]) / 255;
			_rgb.g = parseInt(tmp[1]) / 255;
			_rgb.b = parseInt(tmp[2]) / 255;
		} else if (rgb.r != null) {
			_rgb.r = rgb.r / 255;
			_rgb.g = rgb.g / 255;
			_rgb.b = rgb.b / 255;
		} else {
			_rgb.r = _rgb.g = _rgb.b = 0;
		}
		
		return this;
	}

	/**
     * Get color as rgba string.
     * 
     * @method rgba
     * @param {Number} alpha - alpha value.
     * 
     * @return {String} color as 'rgba(r, g, b, a)' or 'rgb(r, g, b)' if no alpha.
     **/
	p.rgba = function(alpha) {
        var rgb = this.rgb();
        
        if (alpha == null) {
        	return  'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
        } else {
        	return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
        }
    }
	
	/**
	 * GET/SET color from hsv.
	 * 
	 * @method hsv
	 * @param {Object} hsv - { h: hue, s: saturation, v: value }.
	 * 
	 * @return {Object} this for chaining or if no args - hsv as { h: hue, s: saturation, v: value }.
	 **/
	p.hsv = function(hsv) {
		var rgb = this._rgb, s = 0, v;
		
		if (!hsv) {
			var h = 0, min = Math.min(Math.min(rgb.r, rgb.g), rgb.b); v = Math.max(Math.max(rgb.r, rgb.g), rgb.b);
			
			if (v != 0) s = 1 - min / v;
			if (v == min) return { h: h, s: s, v: v };
			
			var d = v - min;
			if (v == rgb.r) h = (rgb.g - rgb.b) / d; else if (v == rgb.g) h = 2 + ((rgb.b - rgb.r) / d); else h = 4 + ((rgb.r - rgb.g) / d);
			  
			h = h * 60;
			if (h < 0) h += 360;
			
			return { h: Math.round(h), s: s, v: v };
		}
		
		v = hsv.v; s = hsv.s;
		if (v == 0 || s == 0) { rgb.r = rgb.g = rgb.b = v; return this; }
		
		var tHue = hsv.h / 60, i = Math.floor(tHue), f = tHue - i,
			p = v * (1 - s), q = v * (1 - s * f), t = v * (1 - s * (1 - f));
		
		switch(i) {
			 case 0: rgb.r = v; rgb.g = t; rgb.b = p; break;
			 case 1: rgb.r = q; rgb.g = v; rgb.b = p; break;
			 case 2: rgb.r = p; rgb.g = v; rgb.b = t; break;
			 case 3: rgb.r = p; rgb.g = q; rgb.b = v; break;
			 case 4: rgb.r = t; rgb.g = p; rgb.b = v; break;
			default: rgb.r = v; rgb.g = p; rgb.b = q; break;
		}
		
		return this;
	}
	
	/**
	 * GET/SET color from cmyk values.
	 * 
	 * @method cmyk
	 * @param {Object} cmyk - { c: cyan, m: magenta, y: yellow, k: key }.
	 * 
	 * @return {Object} this for chaining or if no args - cmyk as { c: cyan, m: magenta, y: yellow, k: key }.
	 **/
	p.cmyk = function(cmyk) {
		var rgb = this._rgb, c, m, y, k, d;
		
		if (!cmyk) {
			c = 1 - rgb.r; m = 1 - rgb.g; y = 1 - rgb.b; k = Math.min(c, m, y, 1);
			
			if (k == 1) {
				c = m = y = 0;
			} else {
				d = 1 - k; c = (c - k) / d; m = (m - k) / d; y = (y - k) / d;
			}
			
			return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
		}
		
		c = cmyk.c / 100; m = cmyk.m / 100; y = cmyk.y / 100; k = cmyk.k / 100;
		d = 1 - k; rgb.r = (1 - c) * d; rgb.g = (1 - m) * d; rgb.b = (1 - y) * d;
		
		return this;
	}
	
	/**
     * Get string representation of this object.
     * 
     * @method toString
     * 
     * @return {String} object as string.
     **/
	p.toString = function() {
        return "[Color(" + this.hex() + ")]";
    }
	
	//set up for global use
	window.Color = Color;
}() );
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
/*
 * Stage by OlegoS, 10 Apr 2013
 *
 * Stage is a Layer container, which manages layers and their canvases.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	//implement draggable objects
	var obj, dragged, sx, sy, s_drag = MouseEvent.DRAGSTART, do_drag = MouseEvent.DRAG, e_drag = MouseEvent.DRAGEND;
	
	function dragStart(e) {
    	sx = e.x; sy = e.y;
        obj = e.target;
        e.propagation = false;
    }

    function dragGo(mx, my) {
        if (obj) {
        	if ( !dragged && (mx != sx || my != sy) ) {
            	dragged = true;
            	obj.processEvent({ x: sx, y: sy, target: obj, type: s_drag });
            }
            
            var dx = mx - sx, dy = my - sy;
            sx = mx; sy = my;

            obj.move(dx, dy); obj.layer.redraw();
            obj.processEvent({ x: mx, y: my, dx: dx, dy: dy, target: obj, type: do_drag });
        }
    }

    function dragEnd(mx, my) {
        if (obj) {
        	obj.processEvent({ x: mx, y: my, target: obj, type: e_drag });
            obj = dragged = null;
        }
    }
	
	//layer management handlers
	function onLayerAdd(e) {
		var item = e.item;
		
		if (item.stage) item.stage.remove(item);
		item.stage = this;
		
		var cv = item.canvas, cvs = cv.style, cvd = this.canvasDiv; 
		
		cv.width = cvd.clientWidth; cv.height = cvd.clientHeight;
		cvs.position = 'absolute'; cvs.top = cvs.left = '0';
		
		var i = e.index, next = null;
		
		if (i == null) cvd.appendChild(cv); else {
			i = this.data[i];
			if (i) next = i.canvas;
			if (next) cvd.insertBefore(cv, next); else cvd.appendChild(cv);
		}
	}
	
	function onLayerRemove(e) {
		e.item.stage = null;
		this.canvasDiv.removeChild(e.item.canvas);
	}
	
	function onClear(e) {
		this.canvasDiv.innerHTML = '';
	}
	
	function onChange(e) {
		var next = this.data[e.newIndex + 1];
		if (next) this.canvasDiv.insertBefore(e.item.canvas, next.canvas); else this.canvasDiv.appendChild(e.item.canvas);
	}
	
	
//CONSTRUCTOR
	/**
	 * Stage can contain many layers and it processes events in them by
	 * catching event on a special div element. Inherited from DataProvider, so it is data driven.
	 * 
	 * You must assign Stage to any html element, configured as you need.
	 * All layer's canvases will be added to it and they will have same size and position.
	 * 
	 * @class Stage
	 * @super DataProvider
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {String} id - stage id.
	 * @param {Element} parent - DOM element to assign Stage.
	 **/
	var Stage = function(id, parent) {
		//initialize base class
		DataProvider.call(this);
		
		/**
	     * Stage id.
	     * 
	     * @property id
 	     * @type String
	     **/
	    this.id = (id == null ? '' : id);
		
		/**
	     * DOM element, Stage attached to.
	     * 
	     * @property parent
	     * @type Element
	     **/
	    this.parent = null;
	    
	    /**
	     * Canvases container div element.
	     * 
	     * @property canvasDiv
	     * @type Element
	     **/
	    this.canvasDiv = document.createElement('div');
	    
	    /**
	     * Event processing div element.
	     * 
	     * @property eventDiv
	     * @type Element
	     **/
	    this.eventDiv = document.createElement('div');
	    
	    //start events processing
	    var self = this, ed = self.eventDiv, cvd = self.canvasDiv, m_move = MouseEvent.MOVE, m_up = MouseEvent.UP, m_out = MouseEvent.OUT;
	    
	    var handler = function(e) {
	    	//init vars
	    	var layers = self.data, lim = null, e_type = e.type, mx = e.pageX - ed._ox, my = e.pageY - ed._oy,
	    		evt = { x: mx, y: my, target: null, type: e_type, propagation: true };
	    	
	    	//process draggable
	    	if (e_type == m_move) { dragGo(mx, my); lim = 1; }
	    	if (e_type == m_up || e_type == m_out) dragEnd(mx, my);
	    	
	    	//process event across layers
	    	for (var j = layers.length - 1; j >= 0; j--) {
	    		var objs = layers[j].getObjectsUnderPoint({ x: mx, y: my }, lim);

	        	for (var i = 0, l = objs.length; i < l; i++) {
	        		evt.target = objs[i];
	        		objs[i].processEvent(evt);
	        		if (!evt.propagation) break;
	            }
	        	
	        	if ( (lim && l > 0) || !evt.propagation ) break;
	    	}
	    	
	    	//process event for stage
	    	if (evt.propagation) { evt.target = self; self.processEvent(evt); }
	    }
	    
	    //setup main event handler for layer inner events
	    var evtDiv = (_BROWSER_ == 'ie' ? cvd : ed),
	    	evtTypes = [MouseEvent.DOWN, MouseEvent.MOVE, MouseEvent.UP, MouseEvent.CLICK, MouseEvent.DBLCLICK];
	    
	    for (var i = 0; i < evtTypes.length; i++) evtDiv.addEventListener(evtTypes[i], handler);
	    
	    //init stage
	    this.addEventListener(DataEvent.ADD, onLayerAdd);
	    this.addEventListener(DataEvent.REMOVE, onLayerRemove);
	    
	    this.addEventListener(DataEvent.CLEAR, onClear);
	    this.addEventListener(DataEvent.CHANGE, onChange);
	    
	    if (parent) this.attach(parent);
	}

	//extend from DataProvider
	inheritProto(Stage, DataProvider);
	
	
//STATIC
	Stage.dragStart = dragStart;
	
	
//PROTOTYPE
	//get prototype reference
	var p = Stage.prototype;
	
	/**
	 * Attach Stage to DOM element.
	 * 
	 * @method attach
	 * @param {Element} parent - element.
	 **/
	p.attach = function(parent) {
		this.detach(); this.parent = parent;
		
		var layers = this.data, w = parent.clientWidth, h = parent.clientHeight,
			ed = this.eventDiv, cvd = this.canvasDiv, cvs, cv;
		
		cvs = cvd.style; cvs.position = 'absolute'; cvs.top = cvs.left = '0'; cvs.width = w + 'px'; cvs.height = h + 'px';
		parent.appendChild(cvd);
		
	    for (var i = 0, l = layers.length; i < l; i++) {
	    	cv = layers[i].canvas; cvs = cv.style;
	    	cv.width = w; cv.height = h; cvs.position = 'absolute'; cvs.top = cvs.left = '0';
	    }
	    
	    cvs = ed.style; cvs.position = 'absolute'; cvs.top = cvs.left = '0'; cvs.width = w + 'px'; cvs.height = h + 'px';
	    parent.appendChild(ed);
	    
	    var bb = ed.getBoundingClientRect(), body = document.body;
	    
	    ed._ox = Math.round(bb.left + window.pageXOffset - body.clientLeft);
	    ed._oy = Math.round(bb.top + window.pageYOffset - body.clientTop);
	}
	
	/**
	 * Detach Stage from DOM element.
	 * 
	 * @method detach
	 **/
	p.detach = function() {
	    if (this.parent) {
	    	this.parent.innerHTML = '';
		    this.parent = null;
	    }
	}
	
	/**
	 * Invalidate Stage parameters.
	 * 
	 * @method invalidate
	 **/
	p.invalidate = function() {
		var ed = this.eventDiv, bb = ed.getBoundingClientRect(), body = document.body;
		
	    ed._ox = Math.round(bb.left + window.pageXOffset - body.clientLeft);
	    ed._oy = Math.round(bb.top + window.pageYOffset - body.clientTop);
	}
	
	/**
	 * Clone this Stage.
	 * 
	 * @method clone
	 * 
	 * @return {Stage} a cloned Stage.
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
	    return "[Stage(" + this.data + ")]";
	}
	
	//set up for global use
	window.Stage = Stage;
}() );
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
/*
 * LayerObject by OlegoS, 10 Apr 2013
 *
 * LayerObject is an abstraction for object which can be added to Layer.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * LayerObject is a base to all graphic objects, but it can not be used itself.
	 * Inherited from EventListener to support events.
	 * 
	 * @class LayerObject
	 * @super EventListener
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {String} id - LayerObject id. Default is "".
	 **/
	var LayerObject = function(id) {
		//initialize base class
		EventListener.call(this);

	   /**
	    * LayerObject id.
	    * 
	    * @property id
	    * @type String
	    **/
	    this.id = (id == null ? '' : id);

	   /**
	    * Reference to parent layer.
	    * 
	    * @property layer
	    * @type Layer
	    **/
	    this.layer = null;

	   /**
	    * LayerObject visibility. Default is true.
	    * 
	    * @property visible
	    * @type Boolean
	    **/
	    this.visible = true;
	    
	    /**
	     * Transformation matrix.
	     * 
	     * @property matrix
	     * @type Matrix
	     **/
	    this.matrix = new Matrix();
	    
	    /**
	     * Object bounds shape. Mostly used for internal calculations in some cases.
	     * 
	     * @property bounds
	     * @type Path
	     **/
	    this.bounds = null;
	    
	    /**
	     * Object rendering style - color, stroke width, opacity, etc.
	     * More object specific styles can be added dynamically.
	     * 
	     * @property style
	     * @type Number
	     **/
	    this.style = { strokeWidth: 1, opacity: 1, strokeColor: '#000000', fillColor: '#ffffff', shadowColor: '', shadowBlur: 0 };
	}

	//extend from EventListener
	inheritProto(LayerObject, EventListener);
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = LayerObject.prototype;
	
	/**
	 * Make object draggable.
	 * 
	 * @method startDrag
	 **/
	p.startDrag = function() {
	    this.addEventListener(MouseEvent.DOWN, Stage.dragStart);
	}

	/**
	 * Stop object draggable ability.
	 * 
	 * @method stopDrag
	 **/
	p.stopDrag = function() {
	    this.removeEventListener(MouseEvent.DOWN, Stage.dragStart);
	}

	/**
	 * Set object style.
	 * 
	 * @method setStyle
	 * @param {Object} style - style to set.
	 **/
	p.setStyle = function(style) {
		for (var p in style) this.style[p] = style[p];
	}

	/**
	 * Clone object style.
	 * 
	 * @method cloneStyle
	 * 
	 * @return {Object} cloned object style.
	 **/
	p.cloneStyle = function() {
		var style = this.style, res = {};
		for (var p in style) res[p] = style[p];
		return res;
	}

	/**
	 * Get bounding rectangle of the object.
	 * 
	 * @method getBoundRect
	 * 
	 * @return {Rectangle} - bounding rectangle.
	 **/
	p.getBoundRect = function() {
	    var s = this.bounds.clone();
	    s.matrixTransform(this.matrix);
	    return s.getBoundRect();
	}

	/**
	 * Get object center point.
	 * 
	 * @method getCenter
	 * 
	 * @return {Point} - center point.
	 **/
	p.getCenter = function() {
	    return this.getBoundRect().getCenter();
	}

	/**
	 * Get object width.
	 * 
	 * @method getWidth
	 * 
	 * @return {Number} - width.
	 **/
	p.getWidth = function() {
	    return this.getBoundRect().getWidth();
	}

	/**
	 * Get object height.
	 * 
	 * @method getHeight
	 * 
	 * @return {Number} - height.
	 **/
	p.getHeight = function() {
	    return this.getBoundRect().getHeight();
	}

	/**
	 * Move object by x/y deltas.
	 * 
	 * @method move
	 * @param {Number} dx - X delta.
	 * @param {Number} dy - Y delta.
	 **/
	p.move = function(dx, dy) {
	    this.matrix.translate(dx, dy);
	    //this.dirty = true;
	}

	/**
	 * Scale object from pivot.
	 * 
	 * @method scale
	 * @param {Number} scX - x scale koef.
	 * @param {Number} scY - y scale koef.
	 * @param {Point} pivot - pivot to scale from.
	 **/
	p.scale = function(scX, scY, pivot) {
		this.matrix.scale(scX, scY, pivot);
	}

	/**
	 * Rotate object around pivot.
	 * 
	 * @method rotate
	 * @param {Number} angle - rotation angle (in radians).
	 * @param {Point} pivot - pivot to rotate around.
	 **/
	p.rotate = function(angle, pivot) {
	    this.matrix.rotate(angle, pivot);
	}

	/**
	 * Apply matrix transformation.
	 * 
	 * @method matrixTransform
	 * @param {Matrix} m - matrix.
	 **/
	p.matrixTransform = function(m) {
	    this.matrix.multiply(m);
	}

	/**
	 * Mirror object acording to orientation.
	 * 
	 * @method mirror
	 * @param {String} orientation - 'horiz' - horizontal, 'vert' - vertical.
	 **/
	p.mirror = function(orientation) {
		Path.prototype.mirror.call(this, orientation);
	}

	/**
	 * Align object in rectangle by base.
	 * 
	 * @method align
	 * @param {String} base - align base: 'left', 'right', 'center', 'top', 'bottom', 'vert'.
	 * @param {Rectangle} rect - align rectangle.
	 **/
	p.align = function(base, rect) {
		Path.prototype.align.call(this, base, rect);
	}

	/**
	 * Place object into specified rectangle.
	 * 
	 * @method placeIntoRect
	 * @param {Rectangle} tR - the Rectangle.
	 **/
	p.placeIntoRect = function(tR) {
		Path.prototype.placeIntoRect.call(this, tR);
	}  

	/**
	 * Place object around specified Point.
	 * 
	 * @method placeAroundPoint
	 * @param {Point} pt - center point.
	 * @param {Number} dist - distance from center to sides.
	 **/
	p.placeAroundPoint = function(pt, dist) {
		Path.prototype.placeAroundPoint.call(this, pt, dist);
	}

	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[LayerObject(id:" + this.id + ")]";
	}
	
	//set up for global use
	window.LayerObject = LayerObject;
}() );
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
	 **/
	var ObjGroup = function(id, objects) {
	   /**
	    * Group id.
	    * 
	    * @property id
	    * @type String
	    **/
		this.id = (id == null ? '' : id);
		
	   /**
	    * Objects data provider.
	    * 
	    * @property objects
	    * @type DataProvider
	    **/
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
	 * @return {Rectangle} - bounding rectangle.
	 **/
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
	 * @return {Point} - center point.
	 **/
	p.getCenter = function() {
	    return this.getBoundRect().getCenter();
	}

	/**
	 * Move by x/y deltas.
	 * 
	 * @method move
	 * @param {Number} dx - X delta.
	 * @param {Number} dy - Y delta.
	 **/
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
	 **/
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
	 **/
	p.rotate = function(angle, pivot) {
		var objs = this.objects.data;
		for (var i = 0, l = objs.length; i < l; i++) objs[i].rotate(angle, pivot);
	}

	/**
	 * Apply matrix transformation.
	 * 
	 * @method matrixTransform
	 * @param {Matrix} m - matrix.
	 **/
	p.matrixTransform = function(m) {
		var objs = this.objects.data;
		for (var i = 0, l = objs.length; i < l; i++) objs[i].matrixTransform(m);
	}

	/**
	 * Mirror according to orientation.
	 * 
	 * @method mirror
	 * @param {String} orientation - 'horiz' - horizontal, 'vert' - vertical.
	 **/
	p.mirror = function(orientation) {
		Path.prototype.mirror.call(this, orientation);
	}

	/**
	 * Align in rectangle by base.
	 * 
	 * @method align
	 * @param {String} base - align base: 'left', 'right', 'center', 'top', 'bottom', 'vert'.
	 * @param {Rectangle} rect - align rectangle.
	 **/
	p.align = function(base, rect) {
		Path.prototype.align.call(this, base, rect);
	}

	/**
	 * Place into specified rectangle.
	 * 
	 * @method placeIntoRect
	 * @param {Rectangle} tR - the Rectangle.
	 **/
	p.placeIntoRect = function(tR) {
		Path.prototype.placeIntoRect.call(this, tR);
	}  

	/**
	 * Place around specified Point.
	 * 
	 * @method placeAroundPoint
	 * @param {Point} pt - center point.
	 * @param {Number} dist - distance from center to sides.
	 **/
	p.placeAroundPoint = function(pt, dist) {
		Path.prototype.placeAroundPoint.call(this, pt, dist);
	}

	/**
	 * Clone object group.
	 * 
	 * @method clone
	 * 
	 * @return {ObjGroup} a cloned group.
	 **/
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
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[ObjGroup(id:" + this.id + ")]";
	}
	
	//set up for global use
	window.ObjGroup = ObjGroup;
}() );
/*
 * Shaper by OlegoS, 10 Apr 2013
 *
 * Shaper is an object for rendering shapes from geometry.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * Shaper contains array of shapes, which are rendered and processes events globally for all shapes in it.
	 * 
	 * @class Shaper
	 * @super LayerObject
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {String} id - Shaper id. Default is "".
	 * @param {Array} shapes - content of the Shaper. Can be array of shapes or one shape.
	 * @param {Object} style - rendering style.
	 **/
	var Shaper = function(id, shapes, style) {
		//initialize base class
		LayerObject.call(this, id);
		if (style) this.setStyle(style);
		
	   /**
	    * Shapes data provider.
	    * 
	    * @property shapes
	    * @type DataProvider
	    **/
		if (!shapes) shapes = [];
		if (shapes instanceof Array) this.shapes = new DataProvider(shapes); else this.shapes = new DataProvider([shapes]);
		
	   /**
		* Cached shapes data provider - for internal caching and optimizations.
		* 
		* @property cachedShapes
		* @type DataProvider
		**/
		this.cachedShapes = new DataProvider();
		
		//cache shapes
		this.cacheShapes();
	}

	//extend from LayerObject
	inheritProto(Shaper, LayerObject);
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Shaper.prototype;
	
	/**
	 * Cache shapes for optimization.
	 * 
	 * @method cacheBounds
	 **/
	p.cacheShapes = function() {
		this.cachedShapes.clear();
		
		var data = this.shapes.data, cached = this.cachedShapes.data;
		for (var i = 0, l = data.length; i < l; i++) cached.push(data[i].clone());
		
		this.bounds = this.getBoundRect();
		this.cachedShapes.each(Path.prototype.matrixTransform, [this.matrix]);
	}

	/**
	 * Get bounding rectangle.
	 * 
	 * @method getBoundRect
	 * 
	 * @return {Rectangle} - bounding rectangle.
	 **/
	p.getBoundRect = function() {
		var data = this.cachedShapes.data, tp = new Path(), tp_pt = tp.points.data;
		
		for (var i = 0, l = data.length; i < l; i++) {
			var r = data[i].getBoundRect();
			if (r) tp_pt.push(r.from, r.to);
		}
		
		return tp.getBoundRect();
	}

	/**
	 * Move object by x/y deltas.
	 * 
	 * @method move
	 * @param {Number} dx - X delta.
	 * @param {Number} dy - Y delta.
	 **/
	p.move = function(dx, dy) {
	    this.matrix.translate(dx, dy);
	    this.cachedShapes.each(Path.prototype.move, [dx, dy]);
	}

	/**
	 * Scale object from pivot.
	 * 
	 * @method scale
	 * @param {Number} scX - x scale koef.
	 * @param {Number} scY - y scale koef.
	 * @param {Point} pivot - pivot to scale from.
	 **/
	p.scale = function(scX, scY, pivot) {
		this.matrix.scale(scX, scY, pivot);
		this.cachedShapes.each(Path.prototype.scale, [scX, scY, pivot]);
	}

	/**
	 * Rotate object around pivot.
	 * 
	 * @method rotate
	 * @param {Number} angle - rotation angle (in radians).
	 * @param {Point} pivot - pivot to rotate around.
	 **/
	p.rotate = function(angle, pivot) {
	    this.matrix.rotate(angle, pivot);
	    this.cachedShapes.each(Path.prototype.rotate, [angle, pivot]);
	}

	/**
	 * Apply matrix transformation.
	 * 
	 * @method matrixTransform
	 * @param {Matrix} m - matrix.
	 **/
	p.matrixTransform = function(m) {
	    this.matrix.multiply(m);
	    this.cachedShapes.each(Path.prototype.matrixTransform, [m]);
	}

	/**
	 * Test if point is inside the Shaper.
	 * 
	 * @method hasPoint
	 * @param {Point} p - point to test.
	 * 
	 * @return {Boolean} - true if point is inside and false otherwise.
	 **/
	p.hasPoint = function(p) {
		if (!this.layer || !this.visible || this.shapes.length() == 0) return;
		var ctx = this.layer.ctx, data = this.cachedShapes.data;
	    
		ctx.oc_resetTransform();
		ctx.beginPath();
		for (var i = 0, l = data.length; i < l; i++) ctx.oc_addPath(data[i]);
		
		return ctx.isPointInPath(p.x, p.y);
	}

	/**
	 * Draw function. Is called by layer to draw this Shaper.
	 * 
	 * @method draw
	 **/
	p.draw = function() {
		//get style info
		var style = this.style, stroke = style.strokeColor, fill = style.fillColor;
		if (style.strokeWidth == 0) stroke = null;
		
		//test draw ability
		if (!stroke && !fill) return;
		if (!this.layer || !this.visible || this.shapes.length() == 0) return;
		
		//get layer and drawing info
	    var ctx = this.layer.ctx, data = this.cachedShapes.data, nogr = true;
	    if (fill instanceof Gradient) nogr = false;
	    
	    //setup global styles
	    ctx.globalAlpha = style.opacity;
	    
	    //if stroke and no gradient, add cached path data to layer
	    if (stroke || (fill && nogr)) {
	    	ctx.oc_resetTransform();
	    	ctx.beginPath();
	    	for (var i = 0, l = data.length; i < l; i++) ctx.oc_addPath(data[i]);
	    }
	    
	    //draw stroke
		if (stroke) {
			ctx.lineWidth = style.strokeWidth;
	        ctx.strokeStyle = stroke;
	        ctx.stroke();
		}
	    
	    //draw fill
	    if (fill) {
	    	//no gradient - fill cached path
	    	if (nogr) {
	    		ctx.fillStyle = fill;
		        ctx.fill();
	    	} else {
	    		//transform context, add original path and fill gradient
	    		data = this.shapes.data;
	    		
	    		ctx.save();
		        ctx.oc_setTransform(this.matrix);
		        
		        ctx.beginPath();
		        for (var i = 0, l = data.length; i < l; i++) ctx.oc_addPath(data[i]);
		        
		        var r = this.bounds, y = r.getCenter().y;
	        	ctx.fillStyle = fill.toCanvasGradient(ctx, new Point(r.from.x, y), new Point(r.to.x, y));
	        	
		        ctx.fill();
		        ctx.restore();
	    	}
	    }
	}

	/**
	 * Clone this Shaper.
	 * 
	 * @method clone
	 * 
	 * @return {Shaper} a cloned Shaper.
	 **/
	p.clone = function() {
		var pt = this.shapes.data, l = pt.length, tmpArr = [];
	    for (var i = 0; i < l; i++) tmpArr.push(pt[i].clone());
	    
	    var cloned = new Shaper('copy_' + this.id, tmpArr, this.style);
	    cloned.matrixTransform(this.matrix);
	    
	    return cloned;
	}
	
	/**
	 * Get svg code for this object.
	 * 
	 * @method svg
	 * 
	 * @return {String} svg code string.
	 **/
	p.svg = function() {
		var data = this.shapes.data, l = data.length, svg = '<g transform="' + this.matrix.svg() + '">\n',
			style = this.style, fill = style.fillColor, i;
		
		if (fill instanceof Gradient) {
			var type = fill.type(), stops = fill.getStopIndexes(), id = getUniqId();
			
			svg += '\t<' + type + 'Gradient id="gr' + id + '">\n';
			
			for (i = 0; i < stops.length; i++) {
				svg += '\t\t<stop stop-color="' + fill.getStopColor(stops[i]) + '" offset="' + stops[i] * 100 + '%" />\n';
			}
			
			svg += '\t</' + type + 'Gradient>\n';
			fill = 'url(#gr' + id + ')';
		}
		
		for (i = 0; i < l; i++) {
			var d = data[i].svg();
			
			if (d) svg += '\t<path stroke="' + style.strokeColor +
								  '" fill="' + fill +
						  '" stroke-width="' + style.strokeWidth +
						  	   '" opacity="' + style.opacity +
						  	   		 '" d="' + d + '" />\n';
		}
		
		return svg + '</g>';
	}
	
	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[Shaper(id:" + this.id + ")]";
	}
	
	//set up for global use
	window.Shaper = Shaper;
}() );
/*
 * Bitmap by OlegoS, 10 Apr 2013
 *
 * Bitmap implementation to work with pixels.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * Bitmap is an object which represents image.
	 * 
	 * @class Bitmap
	 * @super LayerObject
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {String} id - string id of the Bitmap. Default is "".
	 * @param {String} src - source of image.
	 * @param {Number} width - width.
	 * @param {Number} height - height.
	 * @param {Object} style - rendering style.
	 **/
	var Bitmap = function(id, src, width, height, style) {
		//initialize base class
		LayerObject.call(this, id);
		
		this.bounds = new Rectangle(new Point(), new Point(width, height)).toPath();
		if (style) this.setStyle(style);

	    /**
	     * Image in Bitmap.
	     * 
	     * @property image
	     * @type Image
	     **/
	    this.image = new Image();
	    
	    //init
	    var self = this, img = self.image;
	    
	    img.src = src;
	    img.width = width;
	    img.height = height;
	    img.onload = function() { if (self.layer) self.layer.redraw(); }
	}
	
	//extend from LayerObject
	inheritProto(Bitmap, LayerObject);
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Bitmap.prototype;
	
	/**
	 * Test if point is inside bitmap bounds.
	 * 
	 * @method hasPoint
	 * @param {Point} p - point to test.
	 * 
	 * @return {Boolean} - true if point is inside and false otherwise.
	 **/
	p.hasPoint = function(p) {
		if (this.layer && this.visible) {
			var ctx = this.layer.ctx;
		    
			ctx.oc_setTransform(this.matrix);
			ctx.beginPath();
			ctx.oc_addPath(this.bounds);
			
			return ctx.isPointInPath(p.x, p.y);
		}
	}
	
	/**
	 * Draw function. Is called by layer to draw this Bitmap.
	 * 
	 * @method draw
	 **/
	p.draw = function() {
	    if (this.layer && this.visible) {
	    	var ctx = this.layer.ctx, img = this.image, style = this.style;
		    
	    	if (style.shadowColor) {
	    		ctx.shadowColor = style.shadowColor;
	    		ctx.shadowBlur = style.shadowBlur;
	    	}
	    	
			ctx.globalAlpha = style.opacity;
		    ctx.oc_setTransform(this.matrix);
		    ctx.drawImage(img, 0, 0, img.width, img.height);
	    }
	}
	
	/**
	 * Clone this Bitmap.
	 * 
	 * @method clone
	 * 
	 * @return {Bitmap} a cloned Bitmap.
	 **/
	p.clone = function() {
	    var img = this.image, cloned = new Bitmap('copy_' + this.id, img.src, img.width, img.height, this.style);
	    cloned.matrixTransform(this.matrix);
	    return cloned;
	}
	
	/**
	 * Get svg code for this object.
	 * 
	 * @method svg
	 * 
	 * @return {String} svg code string.
	 **/
	p.svg = function() {
		var img = this.image;
		
		return '<image preserveAspectRatio="none" width="' + img.width + 'px" height="' + img.height + 'px" opacity="' +
				this.style.opacity + '" transform="' + this.matrix.svg() + '" xlink:href="' + img.src + '"></image>';
	}
	
	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[Bitmap(id:" + this.id + ")]";
	}
	
	//set up for global use
	window.Bitmap = Bitmap;
}() );
/*
 * Text by OlegoS, 10 Apr 2013
 *
 * Text object implementation - to render vector text on canvas.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	var defaultFontStyle = { fontFamily: 'Verdana', fontSize: '12px', fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' };
	
//CONSTRUCTOR
	/**
	 * Renders text as vector path on canvas. Fonts must be prepared to render text.
	 * Style is extended with new properties, like in example:
	 * 	fontFamily: "Verdana", //css font-face
	 * 	fontSize: "12px",      //css font-size
	 * 	fontWeight: "normal",  //normal|bold
	 * 	fontStyle: "normal",   //normal|italic
	 *  textAlign: "left"      //left|center|right
	 * 
	 * @class Text
	 * @super Shaper
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {String} id - object id. Default is "".
	 * @param {String} text - text value. Default is "".
	 * @param {Object} style - rendering style.
	 **/
	var Text = function(id, text, style) {
		//initialize base class
	    Shaper.call(this, id);
	    
	    //set style
	    this.setStyle(defaultFontStyle);
	    if (style) this.setStyle(style);
	    
	    /**
	     * Font reference.
	     * 
	     * @property font
	     * @type Font
	     **/
	    this.font = null;
	    
	    /**
	     * Text value.
	     * 
	     * @property text
	     * @type String
	     **/
	    this.text = '';
	    if (text) this.setText(text);
	}
	
	//extend from Shaper
	inheritProto(Text, Shaper);
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Text.prototype;
	
	/**
	 * Set text.
	 * 
	 * @method setText
	 * @param {Sting} text - text to set.
	 **/
	p.setText = function(text) {
		//init vars
		var style = this.style, font = this.font = FontsManager.getFontByStyle(style),
			chars = text.split(''), l = chars.length, ofsx = 0, ofsy = 0, grp = new ObjGroup(),
			pathArr = grp.objects.data, glyph, path, i, sHeight = font.sHeight,
			txtLine = new ObjGroup(), txtLineData = txtLine.objects.data, txtLinesArr = [txtLine];
			
		//process text
		for (i = 0; i < l; i++) {
			if (chars[i] == '\n') {
				txtLine = new ObjGroup();
				txtLineData = txtLine.objects.data;
				txtLinesArr.push(txtLine);
				
				ofsx = 0; ofsy -= sHeight + sHeight / 4;
				continue;
			}
			
			glyph = font.getGlyph(chars[i]); path = glyph.path;
			if (!path) continue;
			
			path = path.clone();
			path.move(ofsx, ofsy);
			
			txtLineData.push(path);
			pathArr.push(path);
			
			ofsx += glyph.ha;
		}
		
		//set font size
		var fsz = style.fontSize, k = (fsz.indexOf('px') != -1 ? 0.75 * parseInt(fsz) : parseInt(fsz)),
			sc = k / sHeight;
		
		grp.scale(sc, -sc, new Point());
		
		//set text align
		if (style.textAlign != 'left') {
			var r = grp.getBoundRect(); k = r.getWidth();
			
			if (style.textAlign == 'center') k = k / 2;
			r.from.x -= k; r.to.x -= k; l = txtLinesArr.length;
			
			for (i = 0; i < l; i++) txtLinesArr[i].align(style.textAlign, r);
		}
		
		//update shape
		this.text = text;
		this.shapes.data = grp.objects.data;
		this.cacheShapes();
	}

	/**
	 * Set font style. Updates text after font change.
	 * 
	 * @method setFont
	 * @param {Object} style - style.
	 **/
	p.setFont = function(style) {
		this.setStyle(style);
		this.setText(this.text);
	}

	/**
	 * Test if point is inside the Text bounds.
	 * 
	 * @method hasPoint
	 * @param {Point} p - point to test.
	 * 
	 * @return {Boolean} - true if point is inside and false otherwise.
	 **/
	p.hasPoint = function(p) {
		if (!this.layer || !this.visible || this.shapes.length() == 0) return;
		
		var ctx = this.layer.ctx, bounds = this.bounds.toPath();
		
		bounds.matrixTransform(this.matrix);
		ctx.oc_resetTransform();
		
		ctx.beginPath();
		ctx.oc_addPath(bounds);
		
		return ctx.isPointInPath(p.x, p.y);
	}

	/**
	 * Clone this Text.
	 * 
	 * @method clone
	 * 
	 * @return {Text} a cloned Text.
	 **/
	p.clone = function() {
		var cloned = new Text(this.id, this.text, this.style);
		cloned.matrixTransform(this.matrix);
		return cloned;
	}
	
	/**
	 * Get svg code for this object.
	 * 
	 * @method svg
	 * 
	 * @return {String} svg code string.
	 **/
	p.svg = function() {
		var data = this.shapes.data, l = data.length, style = this.style, fill = style.fillColor, i,
			
			fnt = 'fontFamily:' + style.fontFamily +
				   ',fontSize:' + style.fontSize +
				 ',fontWeight:' + style.fontWeight +
				  ',fontStyle:' + style.fontStyle +
				  ',textAlign:' + style.textAlign,
			
			svg = '<g txt-text="' + this.text + '" txt-style="' + fnt + '" transform="' + this.matrix.svg() + '">\n';
	
		if (fill instanceof Gradient) {
			var type = fill.type(), stops = fill.getStopIndexes(), id = getUniqId();
			
			svg += '\t<' + type + 'Gradient id="gr' + id + '">\n';
			
			for (i = 0; i < stops.length; i++) {
				svg += '\t\t<stop stop-color="' + fill.getStopColor(stops[i]) + '" offset="' + stops[i] * 100 + '%" />\n';
			}
			
			svg += '\t</' + type + 'Gradient>\n';
			fill = 'url(#gr' + id + ')';
		}
		
		for (i = 0; i < l; i++) {
			var d = data[i].svg();
			
			if (d) svg += '\t<path stroke="' + style.strokeColor +
								  '" fill="' + fill +
						  '" stroke-width="' + style.strokeWidth +
						  	   '" opacity="' + style.opacity +
						  	   		 '" d="' + d + '" />\n';
		}
		
		return svg + '</g>';
	}
	
	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[Text(id:" + this.id + ")]";
	}
	
	//set up for global use
	window.Text = Text;
}() );
/*
 * SvgParser by OlegoS, 10 Apr 2013
 *
 * Svg parser for loading and saving vector graphics in svg format.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	//trim string
	function trim(str) { return str.replace(/^\s+|\s+$/g, ''); }
	
	//compress spaces inside string
	function compressSpaces(str) { return str.replace(/[\s\r\t\n]+/gm, ' '); }
	
	//ajax request
	function ajax(url) {
		var ajax = ( XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP') );
		
		ajax.open('GET', url, false);
		ajax.send(null);
		
	    return ajax.responseText;
	}
	
	//parse xml
	function parseXml(xml) {
		var doc;
		
		if (DOMParser) {
			doc = new DOMParser().parseFromString(xml, 'text/xml');
		} else {
			xml = xml.replace(/<!DOCTYPE svg[^>]*>/, '');
			
			doc = new ActiveXObject('Microsoft.XMLDOM');
			doc.async = 'false';
			doc.loadXML(xml);
		}
		
		return doc;
	}
	
	
//CONSTRUCTOR
	/**
	 * SvgParser parses svg file and builds objects tree, which is compatible
	 * with Owl_JS graphics lib.
	 * 
	 * @class SvgParser
	 * @author OlegoS
	 **/
	var SvgParser = function() {
		/**
	     * Svg source as it was loaded.
	     * 
	     * @property source
	     * @type String
	     **/
	    this.source = '';
	    
	    /**
	     * Svg DOM tree.
	     * 
	     * @property dom
	     * @type Document
	     **/
	    this.dom = null;
	    
	    /**
	     * Svg version.
	     * 
	     * @property version
	     * @type String
	     **/
	    this.version = '';
	    
	    /**
	     * Svg id.
	     * 
	     * @property id
	     * @type String
	     **/
	    this.id = '';
	    
	    /**
	     * Svg width.
	     * 
	     * @property width
	     * @type Number
	     **/
	    this.width = 0;
	    
	    /**
	     * Svg height.
	     * 
	     * @property height
	     * @type Number
	     **/
	    this.height = 0;
		
		/**
	     * Layer objects, compatible with Owl_JS.
	     * 
	     * @property layerObjects
	     * @type Array
	     **/
	    this.layerObjects = [];
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = SvgParser.prototype;
	
	/**
	 * Load svg source from string.
	 * 
	 * @method loadSvgString
	 * @param {String} str - svg source string.
	 **/
	p.loadSvgString = function(str) {
		this.source = str;
		this.dom = parseXml(str);
	}
	
	/**
	 * Load svg source from url.
	 * 
	 * @method loadSvgUrl
	 * @param {String} url - svg source url.
	 **/
	p.loadSvgUrl = function(url) {
		this.source = ajax(url);
		this.dom = parseXml(this.source);
	}
	
	/**
	 * Convert svg DOM to layer objects.
	 * Result is accumulated in this.layerObjects array.
	 * 
	 * @method parseSvg
	 * @param {Element} el - starting element.
	 **/
	p.parseSvg = function(el) {
		//return if not element
		if (el.nodeType != 1) return;
		
		//init vars
		var tag = el.nodeName, attrs = el.attributes, childs = el.childNodes, i, l;
		
		//parse attributes and prepare object properties
		var x = 0, y = 0, width = 0, height = 0, r = 0,
			path = '', transform = '', style = { fillColor: null, strokeColor: null },
			p, v, tmp;
		
		for (i = 0, l = attrs.length; i < l; i++) {
			p = attrs[i].name; v = attrs[i].value;
			
			if (p == 'x' || p == 'cx' || p == 'x1') {
				x = Number(v);
				
			} else if (p == 'y' || p == 'cy' || p == 'y1') {
				y = Number(v);
				
			} else if (p == 'width' || p == 'x2') {
				width = Number(v);
				
			} else if (p == 'height' || p == 'y2') {
				height = Number(v);
				
			} else if (p == 'r') {
				r = Number(v);
				
			} else if (p == 'd') {
				path = v;
				
			} else if (p == 'points') {
				path = 'M' + v;
				
			} else if (p == 'transform') {
				transform = v;
				
			} else if (p == 'fill') {
				style.fillColor = ( v == 'none' ? null : v );
				
			} else if (p == 'stroke') {
				style.strokeColor = ( v == 'none' ? null : v );
				
			} else if (p == 'stroke-width') {
				style.strokeWidth = Number(v);
				
			} else if (p == 'opacity') {
				style.opacity = Number(v);
				
			} else if (p == 'font-family') {
				tmp = FontsManager.styleByPostscript[v.replace(/'/g, '').toLowerCase()];
				
				style.fontFamily = tmp.fontFamily;
				style.fontWeight = tmp.fontWeight;
				style.fontStyle = tmp.fontStyle;
				
			} else if (p == 'font-size') {
				style.fontSize = v + 'px';
			}
		}
		
		//check up svg tag and create layer object
		var shape, obj, m;
		
		if (tag == 'rect') {
			shape = new Rectangle(new Point(x, y), new Point(x + width, y + height)).toPath();
			obj = new Shaper('svg_rect', shape, style);
			
		} else if (tag == 'line') {
			shape = new Path([ new Point(x, y), new Point(width, height) ]);
			obj = new Shaper('svg_line', shape, style);
			
		} else if (tag == 'circle') {
			shape = new Path();
			shape.ellipse(new Point(x, y), r, r);
			obj = new Shaper('svg_circle', shape, style);
			
		} else if (tag == 'polygon' || tag == 'polyline' || tag == 'path') {
			if (tag == 'polygon') path += 'Z';
			
			shape = new Path();
			shape.svg(path);
			
			obj = new Shaper('svg_' + tag, shape, style);
			
		} else if (tag == 'text') {
			obj = new Text('svg_text', el.textContent, style);
		}
		
		//apply transform
		if (transform.indexOf('matrix') != -1) {
			m = new Matrix();
			m.svg(transform);
			obj.matrixTransform(m);
		}
		
		//save object
		if (obj) this.layerObjects.push(obj);
		
		//parse childNodes
		for (i = 0, l = childs.length; i < l; i++) this.parseSvg(childs[i]);
	}
	
	/**
	 * Return a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[SvgParser]";
	}
	
	//set up for global use
	window.SvgParser = SvgParser;
}() );
