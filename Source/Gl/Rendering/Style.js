/**
 * @file Style for graphics objects implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Style determines rendering parameters for graphics object.
 * 
 * @class Style
 * @memberof WebbyJs
 */
WebbyJs.createClass({
	/**
	 * Class name.
	 */
	name: 'Style',
	
	/**
	 * @constructor
	 * 
	 * @param {Object} style - initial style.
	 */
	construct: function Style(style) {
		/**
	     * Stroke width in pixels.
	     * 
	     * @memberof Style
	     * @type {Number}
	     */
		this.strokeWidth = 1;
		
		/**
	     * Stroke color. If set as string - it must be CSS compatible.
	     * If null - stroke is not rendered.
	     * 
	     * @memberof Style
	     * @type {String|Color|Gradient|CanvasGradient}
	     */
		this.strokeColor = null;
		
		/**
	     * Fill color. If set as string - it must be CSS compatible.
	     * If null - fill is not rendered.
	     * 
	     * @memberof Style
	     * @type {String|Color|Gradient|CanvasGradient}
	     */
		this.fillColor = null;
		
		/**
	     * Opacity - a value from 0 to 1.
	     * 
	     * @memberof Style
	     * @type {Number}
	     */
		this.opacity = 1;
		
		/**
	     * Shadow color. If set as string - it must be CSS compatible.
	     * If null - shadow is not rendered.
	     * 
	     * @memberof Style
	     * @type {String|Color}
	     */
		this.shadowColor = null;
		
		/**
	     * Shadow blur. If 0 - no blur is rendered.
	     * 
	     * @memberof Style
	     * @type {Number}
	     */
		this.shadowBlur = 0;
		
		//init style
		if (style) this.set(style);
	},
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Set this style properties from any object. Non-style properties
		 * of source object are ignored.
		 * 
		 * All non-primitive properties are shared by reference with
		 * original style and primitives are copied.
		 * 
		 * @method set
		 * @memberof Style.prototype
		 * 
		 * @param {Object} style - initial style.
		 * 
		 * @returns {Style} current instance for chaining.
		 */
		set: function(style) {
			for (var p in style) if (this.hasOwnProperty(p)) this[p] = style[p];
		    return this;
		},
		
		/**
		 * Reset this style properties to their default values.
		 * 
		 * @method reset
		 * @memberof Style.prototype
		 * 
		 * @returns {Style} current instance for chaining.
		 */
		reset: function(style) {
			this.strokeWidth = 1;
			this.strokeColor = null;
			this.fillColor = null;
			
			this.opacity = 1;
			this.shadowColor = null;
			this.shadowBlur = 0;
			
			return this;
		},
		
		/**
		 * Apply this style to another style or object with style.
		 * 
		 * @method applyTo
		 * @memberof Style.prototype
		 * 
		 * @param {Object|Style} obj - style or object with style.
		 * 
		 * @returns {Style} current instance for chaining.
		 */
		applyTo: function(obj) {
			if (obj.style) obj = obj.style;
			if (obj instanceof WebbyJs.Style) obj.set(this);
		    return this;
		},
		
		/**
		 * Get/Set svg value for this object.
		 * 
		 * @method svg
		 * @memberof Style.prototype
		 * 
		 * @param {String} svg - svg data.
		 * 
		 * @returns {String|Style} svg output or current instance for chaining.
		 */
		svg: function(svg) {
			if (svg) return this;
			return '';
		},
		
		/**
		 * Add this object to graphics context, where it may be rendered or used anyway else.
		 * 
		 * @method toContext
		 * @memberof Style.prototype
		 * 
		 * @param {CanvasRenderingContext2D} ctx - context.
		 * 
		 * @returns {Style} current instance for chaining.
		 */
		toContext: function(ctx) {
			var stroke = this.strokeColor, fill = this.fillColor, shadow = this.shadowColor;
			
			if (stroke) {
				if (stroke instanceof WebbyJs.Color) stroke = stroke.hex();
				else if (stroke instanceof WebbyJs.Gradient) stroke = stroke.toCanvasGradient(ctx);
				
				ctx.strokeStyle = stroke;
				ctx.lineWidth = this.strokeWidth;
			}
	        
	        if (fill) {
	        	if (fill instanceof WebbyJs.Color) fill = fill.hex();
	        	else if (fill instanceof WebbyJs.Gradient) fill = fill.toCanvasGradient(ctx);
	        	
	        	ctx.fillStyle = fill;
	        }
	        
	        if (shadow) {
	        	ctx.shadowColor = (shadow instanceof WebbyJs.Color ? shadow.hex() : shadow);
	    		ctx.shadowBlur = this.shadowBlur;
	        }
	        
			ctx.globalAlpha = this.opacity;
			
			return this;
		},
		
		/**
		 * Clone this style. All non-primitive properties are shared
		 * by reference with original style and primitives are copied.
		 * 
		 * @method clone
		 * @memberof Style.prototype
		 * 
		 * @returns {Style} cloned style.
		 */
		clone: function() {
			return new WebbyJs.Style(this);
		}
	}
});
