/*
* Matrix by OlegoS. Feb 10, 2012
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
* Matrix math implementation. Matrix inside is a 2d array.
* Used in geometry calculations.
*
* @class Matrix
* @author OlegoS
*
* @constructor
**/
var Matrix = function() {
    this.reset();
}


//public methods:
    /**
     * Set this matrix as identity matrix.
     * @method reset
     **/
    Matrix.prototype.reset = function() {
        this[0] = [1, 0, 0];
        this[1] = [0, 1, 0];
        this[2] = [0, 0, 1];
    }
    
    /**
     * Set rotation in matrix by angle.
     * @method setRotation
     * @param {Number} angle - rotation angle in radians.
     **/
    Matrix.prototype.setRotation = function(angle) {
        var sinAngle = Math.sin(angle);
        var cosAngle = Math.cos(angle);
        
        this[0] = [cosAngle,     sinAngle, 0];
        this[1] = [-sinAngle,    cosAngle, 0];
        this[2] = [0,            0,        1];
    }
    
    /**
     * Set scale in matrix by scX and scY koefs.
     * @method setScale
     * @param {Number} scX - x scale.
     * @param {Number} scY - y scale.
     **/
    Matrix.prototype.setScale = function(scX, scY) {
        this[0] = [scX, 0,   0];
        this[1] = [0,   scY, 0];
        this[2] = [0,   0,   1];
    }
    
    /**
     * Set skew in matrix by skX and skY koefs.
     * @method setSkew
     * @param {Number} skX - x skew.
     * @param {Number} skY - y skew.
     **/
    Matrix.prototype.setSkew = function(skX, skY) {
        this[0] = [1,             Math.tan(skX), 0];
        this[1] = [Math.tan(skY), 1,             0];
        this[2] = [0,             0,             1];
    }
    
    /**
     * Set translation in matrix by tx and ty coords.
     * @method setTranslation
     * @param {Number} tx - x translation.
     * @param {Number} ty - y translation.
     **/
    Matrix.prototype.setTranslation = function(tx, ty) {
        this[0] = [1,  0,  0];
        this[1] = [0,  1,  0];
        this[2] = [tx, ty, 1];
    }

    /**
     * Multiply this matrix by another.
     * @method multiply
     * @param {Matrix} m - another matrix.
     **/
    Matrix.prototype.multiply = function(m) {
        var val; var i; var j; var v; var temp = [[], [], []];
        for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) temp[i][j] = this[i][j];
        
		for (i = 0; i < 3; i++){
	        for (j = 0; j < 3; j++) {
	            val = 0;
	            for (v = 0; v < 3; v++) val += temp[i][v] * m[v][j];
	            this[i][j] = val;
		    }
		}
    }
