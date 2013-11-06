/**
 * @file Matrix implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Matrix is a 2d array, used in geometry calculations.
 * 
 * @class Matrix
 * @extends WObject
 * 
 * @memberof WebbyJs
 */
WebbyJs.Class({
	/**
	 * Class name.
	 */
	name: 'Matrix',
	
	/**
	 * @constructor
	 */
	construct: function Matrix() {
		this[0] = [1, 0, 0];
	    this[1] = [0, 1, 0];
	    this[2] = [0, 0, 1];
	},
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Set this matrix as identity matrix.
		 * 
		 * @method reset
		 * @memberof Matrix.prototype
		 * 
		 * @returns {Matrix} current instance for chaining.
		 */
		reset: function() {
			var m0 = this[0], m1 = this[1], m2 = this[2];
			
			m0[0] = m1[1] = m2[2] = 1;
			m0[1] = m0[2] = m1[0] = m1[2] = m2[0] = m2[1] = 0;
			
			return this;
		},
		
		/**
		 * Set translation in matrix by tx and ty coords.
		 * 
		 * @method setTranslation
		 * @memberof Matrix.prototype
		 * 
		 * @param {Number} tx - x translation.
		 * @param {Number} ty - y translation.
		 * 
		 * @returns {Matrix} current instance for chaining.
		 */
		setTranslation: function(tx, ty) {
			this[2][0] = tx; this[2][1] = ty;
			return this;
		},
		
		/**
		 * Set rotation in matrix by angle.
		 * 
		 * @method setRotation
		 * @memberof Matrix.prototype
		 * 
		 * @param {Number} angle - rotation angle in radians.
		 * 
		 * @returns {Matrix} current instance for chaining.
		 */
		setRotation: function(angle) {
			var sinAngle = Math.sin(angle);
			
			this[0][0] = this[1][1] = Math.cos(angle);
			this[0][1] = sinAngle; this[1][0] = -sinAngle;
			
			return this;
		},
		
		/**
		 * Set scale in matrix by scX and scY koefs.
		 * 
		 * @method setScale
		 * @memberof Matrix.prototype
		 * 
		 * @param {Number} scX - x scale.
		 * @param {Number} scY - y scale.
		 * 
		 * @returns {Matrix} current instance for chaining.
		 */
		setScale: function(scX, scY) {
			this[0][0] = scX; this[1][1] = scY;
			return this;
		},
		
		/**
		 * Set skew in matrix by skX and skY koefs.
		 * 
		 * @method setSkew
		 * @memberof Matrix.prototype
		 * 
		 * @param {Number} skX - x skew.
		 * @param {Number} skY - y skew.
		 * 
		 * @returns {Matrix} current instance for chaining.
		 */
		setSkew: function(skX, skY) {
			this[0][1] = Math.tan(skX); this[1][0] = Math.tan(skY);
			return this;
		},
		
		/**
		 * Translate matrix by tx and ty coords.
		 * 
		 * @method translate
		 * @memberof Matrix.prototype
		 * 
		 * @param {Number} tx - x translation.
		 * @param {Number} ty - y translation.
		 * 
		 * @returns {Matrix} current instance for chaining.
		 */
		translate: function(tx, ty) {
		    this.multiply(WebbyJs.Geom._tm.setTranslation(tx, ty));
		    return this;
		},
		
		/**
		 * Rotate matrix by angle around pivot.
		 * 
		 * @method rotate
		 * @memberof Matrix.prototype
		 * 
		 * @param {Number} angle - rotation angle in radians.
		 * @param {Point} pivot - pivot to rotate around.
		 * 
		 * @returns {Matrix} current instance for chaining.
		 */
		rotate: function(angle, pivot) {
			var px = pivot.x, py = pivot.y, tm = WebbyJs.Geom._tm;
		    
			this.multiply(tm.setTranslation(-px, -py)).
	    		 multiply(WebbyJs.Geom._rm.setRotation(angle)).
	    		 multiply(tm.setTranslation(px, py));
		    
		    return this;
		},
		
		/**
		 * Scale matrix from pivot by scX and scY koefs.
		 * 
		 * @method scale
		 * @memberof Matrix.prototype
		 * 
		 * @param {Number} scX - x scale.
		 * @param {Number} scY - y scale.
		 * @param {Point} pivot - pivot to scale from.
		 * 
		 * @returns {Matrix} current instance for chaining.
		 */
		scale: function(scX, scY, pivot) {
			var px = pivot.x, py = pivot.y, tm = WebbyJs.Geom._tm;
		    
		    this.multiply(tm.setTranslation(-px, -py)).
		    	 multiply(WebbyJs.Geom._sm.setScale(scX, scY)).
		    	 multiply(tm.setTranslation(px, py));
		    
		    return this;
		},
		
		/**
		 * Multiply this matrix by another.
		 * 
		 * @method multiply
		 * @memberof Matrix.prototype
		 * 
		 * @param {Matrix} m - another matrix.
		 * 
		 * @returns {Matrix} current instance for chaining.
		 */
		multiply: function(m) {
		    var val, i, j, v, temp = [[], [], []];
		    
		    for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) temp[i][j] = this[i][j];
		    
			for (i = 0; i < 3; i++){
		        for (j = 0; j < 3; j++) {
		            val = 0;
		            for (v = 0; v < 3; v++) val += temp[i][v] * m[v][j];
		            this[i][j] = val;
			    }
			}
			
			return this;
		},
		
		/**
		 * Get Matrix determinant.
		 * 
		 * @method det
		 * @memberof Matrix.prototype
		 * 
		 * @returns {Number} determinant.
		 */
		det: function() {
			var m0 = this[0], m1 = this[1], m2 = this[2],
				m10 = m1[0], m11 = m1[1], m12 = m1[2], m20 = m2[0], m21 = m2[1], m22 = m2[2];
			
		    return m0[0] * (m11 * m22 - m21 * m12) - m0[1] * (m10 * m22 - m20 * m12) + m0[2] * (m10 * m21 - m20 * m11);
		},
		
		/**
		 * Get inverted Matrix.
		 * 
		 * @method inverted
		 * @memberof Matrix.prototype
		 * 
		 * @returns {Matrix} an inverted Matrix.
		 */
		inverted: function() {
			var m = new Matrix(), m0 = m[0], m1 = m[1], m2 = m[2], det = this.det(),
			
				t0 = this[0], t00 = t0[0], t01 = t0[1], t02 = t0[2],
				t1 = this[1], t10 = t1[0], t11 = t1[1], t12 = t1[2],
				t2 = this[2], t20 = t2[0], t21 = t2[1], t22 = t2[2];
			
		    m0[0] =   t11 * t22 - t12 * t21  / det; m0[1] = -(t01 * t22 - t21 * t02) / det; m0[2] =   t01 * t12 - t11 * t02  / det;
		    m1[0] = -(t10 * t22 - t12 * t20) / det; m1[1] =   t00 * t22 - t20 * t02  / det; m1[2] = -(t00 * t12 - t10 * t02) / det;
		    m2[0] =   t10 * t21 - t20 * t11  / det; m2[1] = -(t00 * t21 - t20 * t01) / det; m2[2] =   t00 * t11 - t01 * t10  / det;
		    
		    return m;
		},
		
		/**
		 * Clone this Matrix.
		 * 
		 * @method clone
		 * @memberof Matrix.prototype
		 * 
		 * @returns {Matrix} a cloned Matrix.
		 */
		clone: function() {
			var m = new WebbyJs.Matrix(), i, j, mi, ti;
			
			for (i = 0; i < 3; i++) {
				mi = m[i]; ti = this[i];
				for (j = 0; j < 3; j++) mi[j] = ti[j];
			}
			
			return m;
		},
		
		/**
		 * Get/Set matrix svg value.
		 * 
		 * @method svg
		 * @memberof Matrix.prototype
		 * 
		 * @param {String} val - svg matrix notation as 'matrix(m00 m01 m10 m11 m20 m21)'.
		 * 
		 * @returns {String|Matrix} matrix svg string or current instance for chaining.
		 */
		svg: function(val) {
			var m0 = this[0], m1 = this[1], m2 = this[2];
			
			if (!val) {
				return 'matrix(' + m0[0].toFixed(3) + ' ' + m0[1].toFixed(3) + ' ' + m1[0].toFixed(3) + ' '
								 + m1[1].toFixed(3) + ' ' + m2[0].toFixed(3) + ' ' + m2[1].toFixed(3) + ')';
			}
			
			val = val.replace('matrix(', '').replace(')', '').split(' ');
			
			m0[0] = Number(val[0]); m0[1] = Number(val[1]); m0[2] = 0;
			m1[0] = Number(val[2]); m1[1] = Number(val[3]); m1[2] = 0;
			m2[0] = Number(val[4]); m2[1] = Number(val[5]); m2[2] = 1;
			
			return this;
		},
		
		/**
		 * Return a string representation of this object.
		 * 
		 * @method toString
		 * @memberof Matrix.prototype
		 * 
		 * @returns {String} a string representation of this object.
		 */
		toString: function() {
			var m0 = this[0], m1 = this[1], m2 = this[2];
			
		    return "[WebbyJs.Matrix([ [" + m0[0] + ", " + m0[1] + ", " + m0[2] + "], " +
		    						 "[" + m1[0] + ", " + m1[1] + ", " + m1[2] + "], " +
		    						 "[" + m2[0] + ", " + m2[1] + ", " + m2[2] + "] ])]";
		}
	}
});
