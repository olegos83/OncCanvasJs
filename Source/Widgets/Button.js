/**
 * @file The implementation of WebbyJs class creation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Base class for all WebbyJs created classes.
 * All created classes are inherited from it.
 * 
 * @class BaseWebbyJsClass
 * @memberof WebbyJs
 */
WebbyJs.createClass('BaseWebbyJsClass', null,
	/**
	 * @constructs BaseWebbyJsClass
	 */
	function() {
		/**
		 * All WebbyJs members, which can be globalized.
		 * 
		 * @memberof BaseWebbyJsClass
		 * @type {Array}
		 * 
		 * @private
		 */
		_globals: [];
	},
	
	/**
	 * Prototype description.
	 */
	{
		/**
		 * Invoke method with 'this' reference to current instance.
		 * 
		 * @method invoke
		 * @memberof BaseWebbyJsClass.prototype
		 * 
		 * @param {Function} method - method to invoke.
		 * @param {Array} args - method arguments.
		 * 
		 * @returns {BaseWebbyJsClass} current instance for chaining.
		 */
		invoke: function(method, args) {
			method.apply(this, args);
			return this;
		}
	}
);


/*
 * Button by OlegoS, 07 Jun 2013
 *
 * Button widget.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * Button widget.
	 *
	 * @class Button
	 * @super DomWidget
	 * @author OlegoS
	 *
	 * @constructor
	 **/
	var Button = function() {
		//initialize base class
		DomWidget.call(this);
		
		//init html
		this.addClass('dw_button').size(80, 28);
	}
	
	//extend from DomWidget
	inheritProto(Button, DomWidget);
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Button.prototype;
	
	/**
	 * Get/Set combo label.
	 * 
	 * @method label
	 * @param {String} label - new label.
	 * 
	 * @return {Object} this for chaining or label if no arguments.
	 **/
	p.label = function(label) {
		if (arguments.length == 0) return $(this.html.content).text();
		
		$(this.html.content).text(label);
		return this;
	}
	
	/**
	 * Inner set height method.
	 * 
	 * @method _setHeight
	 * @private
	 * @param {Number} height - height.
	 **/
	p._setHeight = function(height) {
		$(this.html.content).css({ lineHeight: height + 'px' });
	}
	
	/**
	 * Return a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[Button]";
	}
	
	//set up for global use
	window.Button = Button;
}() );
