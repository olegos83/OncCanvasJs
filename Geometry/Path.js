/*
* Polygon by OlegoS. Jan 4, 2012
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
* Polygon class - Polygon implementation in 2D coordinate system.
* Has an array of points, which are connected from 0 to last and then closepathed.
*
* @class Polygon
* @author OlegoS
*
* @constructor
* @param {Array} pointsArr - points array. Default is empty array.
**/
var Polygon = function(pointsArr) {
//public properties:
    /**
     * Polygon points array.
     * @property pointsArr
     * @type Array
     **/
    this.pointsArr = (pointsArr == null ? new Array() : pointsArr);
}


//public methods:
    /**
     * Move Polygon by x/y deltas.
     * @method move
     * @param {Number} dx - X delta.
     * @param {Number} dy - Y delta.
     **/
    Polygon.prototype.move = function(dx, dy) {
        //get points array
        var pt = this.pointsArr;
        var l = pt.length;
        
        //process points
        for (var i = 0; i < l; i++) pt[i].move(dx, dy);
    }

    /**
     * Move Polygon by distance in specified direction.
     * @method moveDir
     * @param {Number} dist - distance to move.
     * @param {Number} angle - direction (in radians).
     **/
    Polygon.prototype.moveDir = function(dist, angle) {
        //get points array
        var pt = this.pointsArr;
        var l = pt.length;
        
        //process points
        for (var i = 0; i < l; i++) pt[i].moveDir(dist, angle);
    }

    /**
     * Rotate Polygon around pivot by specified angle.
     * @method rotate
     * @param {Number} angle - rotation angle (in radians).
     * @param {Point} pivot - pivot to rotate around.
     **/
    Polygon.prototype.rotate = function(angle, pivot) {
        //get points array
        var pt = this.pointsArr;
        var l = pt.length;
        
        //process points
        for (var i = 0; i < l; i++) pt[i].rotate(angle, pivot);
    }

    /**
     * Scale Polygon from pivot by specified scX/scY koefs.
     * @method scale
     * @param {Number} scX - x scale koef.
     * @param {Number} scY - y scale koef.
     * @param {Point} pivot - pivot to scale from.
     **/
    Polygon.prototype.scale = function(scX, scY, pivot) {
        //get points array
        var pt = this.pointsArr;
        var l = pt.length;
        
        //process points
        for (var i = 0; i < l; i++) pt[i].scale(scX, scY, pivot);
    }
    
    /**
     * Apply matrix transformation to Polygon.
     * @method matrixTransform
     * @param {Matrix} m - a transformation matrix.
     **/
    Polygon.prototype.matrixTransform = function(m) {
        //get points array
        var pt = this.pointsArr;
        var l = pt.length;
        
        //process points
        for (var i = 0; i < l; i++) pt[i].matrixTransform(m);
    }

    /**
     * Returns a bounding rectangle of this Polygon.
     * @method getBoundRect
     * @return {Rectangle} a bounding rectangle of this Polygon.
     **/
    Polygon.prototype.getBoundRect = function() {
        //get points array
        var pt = this.pointsArr;
        
        //set min and max to first point
        var minX = pt[0].x;var minY = pt[0].y;
        var maxX = pt[0].x;var maxY = pt[0].y;
        
        //find min and max points
        var l = pt.length;
        for (var i = 0; i < l; i++) {
            //check min
            if (pt[i].x < minX) minX = pt[i].x;
            if (pt[i].y < minY) minY = pt[i].y;
            
            //check max
            if (pt[i].x > maxX) maxX = pt[i].x;
            if (pt[i].y > maxY) maxY = pt[i].y;
        }
        
        //return rectangle
        return new Rectangle(new Point(minX, minY), new Point(maxX, maxY));
    }
    
    /**
     * Returns a center point of this Polygon.
     * @method getCenter
     * @return {Point} a center point of this Polygon.
     **/
    Polygon.prototype.getCenter = function() {
        return this.getBoundRect().getCenter();
    }
    
    /**
     * Returns a center point of this Polygon.
     * @method align
     * @param {String} base - align base: 'left', 'right', 'center', 'top', 'bottom', 'vert'.
     * @param {Rectangle} rect - align rectangle.
     **/
    Polygon.prototype.align = function(base, rect) {
        //init vars
        var rectWidth = rect.getWidth();
        var rectHeight = rect.getHeight();
        
        var r = this.getBoundRect();
        var c = r.getCenter();
        var rw = r.getWidth() / 2;
        var rh = r.getHeight() / 2;
        var dx = 0, dy = 0;

        //calculate deltas
        switch(base) {
            case 'left':
                dx = 0 - c.x + rw;
            break;

            case 'right':
                dx = rectWidth - c.x - rw;
            break;

            case 'center':
                dx = rectWidth / 2 - c.x;
            break;

            case 'top':
                dy = 0 - c.y + rh;
            break;

            case 'bottom':
                dy = rectHeight - c.y - rh;
            break;

            case 'vert':
                dy = rectHeight / 2 - c.y;
            break;
        }

        //align object
        this.move(dx, dy);
    }
    
    /**
     * Mirror Polygon acording to orientation.
     * @method mirror
     * @param {String} orientation - 'horiz' - horizontal, 'vert' - vertical.
     **/
    Polygon.prototype.mirror = function(orientation) {
        var c = this.getCenter();
        
        switch(orientation) {
            case 'horiz':
                this.scale(-1, 1, c);
            break;

            case 'vert':
                this.scale(1, -1, c);
            break;
        }
    }
    
    /**
     * Place Polygon around specified Point.
     * @method placeAroundPoint
     * @param {Point} pt - Center point of the Polygon.
     * @param {Number} dist - distance from center to sides.
     **/
    Polygon.prototype.placeAroundPoint = function(pt, dist) {
        var r = new Rectangle();
        r.placeAroundPoint(pt, dist);
        this.placeIntoRect(r);
    }
    
    /**
     * Place Polygon into specified rectangle.
     * @method placeIntoRect
     * @param {Rectangle} tR - the Rectangle.
     **/
    Polygon.prototype.placeIntoRect = function(tR) {
        //Mirror shape if needed
        if (tR.from.isRightTo(tR.to)) this.mirror('horiz');
        if (tR.from.isDownTo(tR.to)) this.mirror('vert');
        
        //move shape
        tR.normalize();
        var oR = this.getBoundRect();
        var d = tR.from.deltaTo(oR.from);
        this.move(d.dx, d.dy);
        
        //scale shape
        var w1 = tR.getWidth();if (w1 == 0) w1 = 1;
        var w2 = oR.getWidth();if (w2 == 0) w2 = 1;
        var sx = w1 / w2;
        
        var h1 = tR.getHeight();if (h1 == 0) h1 = 1;
        var h2 = oR.getHeight();if (h2 == 0) h2 = 1;
        var sy = h1 / h2;
        
        this.scale(sx, sy, tR.from);
    }

    /**
     * Returns a clone of this Polygon.
     * @method clone
     * @return {Polygon} a clone of this Polygon.
     **/
    Polygon.prototype.clone = function() {
        var tmpArr = new Array();

        var l = this.pointsArr.length;
        for (var i = 0; i < l; i++) tmpArr.push(this.pointsArr[i].clone());

        return new Polygon(tmpArr);
    }

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of this object.
     **/
    Polygon.prototype.toString = function() {
        return "[Polygon(numPoints:" + this.pointsArr.length + ")]";
    }
    