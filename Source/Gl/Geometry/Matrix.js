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
			return 'matrix(' + m0[0] + ' ' + m0[1] + ' ' + m1[0] + ' ' + m1[1] + ' ' + m2[0] + ' ' + m2[1] + ')';
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
