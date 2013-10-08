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
