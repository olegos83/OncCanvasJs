/**
 * @file Mouse event implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Mouse event class.
 *
 * @class MouseEvent
 * @extends Event
 *
 * @memberof w
 */
w.create({
	/**
	 * @constructor
	 *
	 * @param {MouseEvent} native - native browser event reference.
	 * @param {Object} target - event target.
	 */
	construct: function MouseEvent(native, target) {
		//init superclass
		this.superclass.call(this, native.type, target);

		/**
		 * Native browser event reference.
		 *
		 * @memberof MouseEvent
		 * @type {MouseEvent}
		 */
		this.native = native;
	},

	/**
	 * Base class.
	 */
	base: w.Event,

	/**
	 * Static members.
	 */
	statics: {
		/**
		 * MouseEvent type definitions.
		 *
		 * @memberof MouseEvent
		 * @type {String}
		 */
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
	}
});
