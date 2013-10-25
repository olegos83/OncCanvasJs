/**
 * @file Style for graphics objects implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Rectangle is very important in geometry and rendering calculations.
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
	 * @param {Point} from - up left point. Default is Point(0, 0).
	 * @param {Point} to - bottom right point. Default is Point(0, 0).
	 */
	construct: function Style(from, to) {
		/**
	     * Up left point of rectangle.
	     * 
	     * @memberof Style
	     * @type {Point}
	     */
		this.from = from || new WebbyJs.Point();
	},
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Check intersection between this and target bounding rectangle.
		 * 
		 * @method intersectBounds
		 * @memberof Style.prototype
		 * 
		 * @param {Style} target - target to test.
		 * 
		 * @returns {Style} current instance for chaining.
		 */
		intersectBounds: function(target) {
		    return this;
		}
	}
});
