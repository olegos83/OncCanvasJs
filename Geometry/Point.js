/*
* Point by OlegoS. Jan 4, 2012
*
* Copyright (c) 2012 OlegoS
*
* See license information in readme file.
*/

/**
* OncCanvasJs is a framework to work with html5 canvas. It can be used to write
* games or any other web-applications, which use canvas graphics.
* @module OncCanvasJs
**/


/**
* Point implementation in 2D coordinate system.
* Used in all geometry calculations and shapes.
*
* @class Point
* @author OlegoS
*
* @constructor
* @param {Number} x - X position. Default is 0.
* @param {Number} y - Y position. Default is 0.
**/
var Point = function(x, y) {
//public properties:
	/**
	 * X position.
	 * @property x
	 * @type Number
	 **/
	this.x = (x == null ? 0 : x);

    /**
     * Y position.
     * @property y
     * @type Number
     **/
    this.y = (y == null ? 0 : y);
}


//public methods:
	/**
	 * Set Point coords equal to specified point.
	 * @method set
	 * @param {Point} to - destination point.
	 **/
	Point.prototype.set = function(to) {
	    this.x = to.x;
	    this.y = to.y;
	}

    /**
     * Move Point by x/y deltas.
     * @method move
     * @param {Number} dx - X delta.
     * @param {Number} dy - Y delta.
     **/
    Point.prototype.move = function(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    /**
     * Move Point by distance in specified direction.
     * @method moveDir
     * @param {Number} dist - distance to move.
     * @param {Number} angle - direction (in radians).
     **/
    Point.prototype.moveDir = function(dist, angle) {
        this.x += dist * Math.sin(angle);
        this.y += dist * Math.cos(angle);
    }
    
    /**
     * Transform Point by matrix
     * @method matrixTransform
     * @param {Matrix} m
     **/
    Point.prototype.matrixTransform = function(m) {
		var x = this.x * m[0][0] + this.y * m[1][0] + m[2][0];
		var y = this.x * m[0][1] + this.y * m[1][1] + m[2][1];
        this.x = x; this.y = y;
    }

    /**
     * Rotate Point around pivot by specified angle.
     * @method rotate
     * @param {Number} angle - rotation angle (in radians).
     * @param {Point} pivot - pivot to rotate around.
     **/
    Point.prototype.rotate = function(angle, pivot) {
        this.move(-pivot.x, -pivot.y);
        
        var sina = Math.sin(angle); var cosa = Math.cos(angle);
        var x = this.x * cosa - this.y * sina;
        var y = this.x * sina + this.y * cosa;
        
        this.x = x; this.y = y;
        this.move(pivot.x, pivot.y);
    }

    /**
     * Scale Point from pivot by specified scX/scY koefs.
     * @method scale
     * @param {Number} scX - x scale koef.
     * @param {Number} scY - y scale koef.
     * @param {Point} pivot - pivot to scale from.
     **/
    Point.prototype.scale = function(scX, scY, pivot) {
        var d = this.deltaTo(pivot);
        this.move(scX * d.dx - d.dx, scY * d.dy - d.dy);
    }

    /**
     * Return x/y deltas to the specified Point.
     * @method deltaTo
     * @param {Point} to - Point to calculate deltas to.
     * @return {Object} delta object - {dx:deltaX, dy:deltaY}.
     **/
    Point.prototype.deltaTo = function(to) {
        return {dx:this.x - to.x, dy:this.y - to.y};
    }

    /**
     * Return distance to the specified Point.
     * @method distTo
     * @param {Point} to - Point to calculate distance to.
     * @return {Number} distance in pixels.
     **/
    Point.prototype.distTo = function(to) {
        var d = to.deltaTo(this);
        return Math.sqrt(d.dx * d.dx + d.dy * d.dy);
    }

    /**
     * Return angle to the specified Point.
     * @method angleTo
     * @param {Point} to - Point to calculate angle to.
     * @return {Number} angle in radians.
     **/
    Point.prototype.angleTo = function(to) {
        var d = this.deltaTo(to);
        return Math.atan2(d.dy, d.dx);
    }
    
    /**
     * Test if point is left to another point.
     * @method isLeftTo
     * @param {Point} to - Point to test.
     * @return {Boolean} true if point positioned left to target.
     **/
    Point.prototype.isLeftTo = function(to) {
        return (this.x < to.x);
    }
    
    /**
     * Test if point is right to another point.
     * @method isRightTo
     * @param {Point} to - Point to test.
     * @return {Boolean} true if point positioned right to target.
     **/
    Point.prototype.isRightTo = function(to) {
        return (this.x > to.x);
    }
    
    /**
     * Test if point is up to another point.
     * @method isUpTo
     * @param {Point} to - Point to test.
     * @return {Boolean} true if point positioned up to target.
     **/
    Point.prototype.isUpTo = function(to) {
        return (this.y < to.y);
    }
    
    /**
     * Test if point is down to another point.
     * @method isDownTo
     * @param {Point} to - Point to test.
     * @return {Boolean} true if point positioned down to target.
     **/
    Point.prototype.isDownTo = function(to) {
        return (this.y > to.y);
    }
    
    /**
     * Test if point is equal to another point.
     * @method isEqualTo
     * @param {Point} to - Point to test.
     * @return {Boolean} true if point is equal to target.
     **/
    Point.prototype.isEqualTo = function(to) {
        return ( (this.x == to.x) && (this.y == to.y) );
    }
    
    /**
     * Test if point is in bounds and if out - place it into.
     * @method checkBounds
     * @param {Point} from - bounds from.
     * @param {Point} to - bounds to test.
     **/
    Point.prototype.checkBounds = function(from, to) {
    	if (this.x < from.x) this.x = from.x;
    	if (this.y < from.y) this.y = from.y;
    	
    	if (this.x > to.x) this.x = to.x;
    	if (this.y > to.y) this.y = to.y;
    }

    /**
     * Clone this Point.
     * @method clone
     * @return {Point} a cloned Point.
     **/
    Point.prototype.clone = function() {
        return new Point(this.x, this.y);
    }

    /**
     * Return a string representation of this object.
     * @method toString
     * @return {String} a string representation of this object.
     **/
    Point.prototype.toString = function() {
        return "[Point(x=" + this.x + ", y=" + this.y + ")]";
    }
