/**
 * @file Basic event implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Event class - base for all WebbyJs event classes.
 *
 * @class Event
 * @extends WObject
 *
 * @memberof w
 */
w.create({
	/**
	 * @constructor
	 *
	 * @param {String} type - event type.
	 * @param {Object} target - event target.
	 */
	construct: function Event(type, target) {
		/**
		 * Event type.
		 *
		 * @memberof Event
		 * @type {String}
		 */
		this.type = type;

		/**
		 * Event target.
		 *
		 * @memberof Event
		 * @type {Object}
		 */
		this.target = target;

		/**
		 * Event propagation.
		 *
		 * @memberof Event
		 * @type {Boolean}
		 */
		this.propagation = true;
	},

	/**
	 * Static members.
	 */
	statics: {
		/**
		 * Event type definitions.
		 *
		 * @memberof Event
		 * @type {String}
		 */
		CHANGE: 'change',
		READY: 'ready'
	},

	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Stop event propagation.
		 *
		 * @method stopPropagation
		 * @memberof Event.prototype
		 *
		 * @returns {Event} current instance for chaining.
		 */
		stopPropagation: function() {
			this.propagation = false;
			return this;
		}
	}
});
