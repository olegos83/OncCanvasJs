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
 * PopUp by OlegoS, 19 May 2013
 *
 * Draggable popup window.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	//drag & drop handlers
	var sx = 0, sy = 0, popup = null;
	
	function startDrag(e) {
		sx = e.pageX; sy = e.pageY; popup = e.currentTarget._popup_;
		$(document).bind('mousemove', drag).bind('mouseup', stopDrag);
	}
	
	function drag(e) {
		popup.move(e.pageX - sx, e.pageY - sy);
		sx = e.pageX; sy = e.pageY;
	}
	
	function stopDrag(e) {
		$(document).unbind('mousemove', drag).unbind('mouseup', stopDrag);
	}
	
	//close button handlers
	function preventDrag(e) { e.stopPropagation(); }
	function closePopup(e) { e.currentTarget._popup_.close(); }
	
	
//CONSTRUCTOR
	/**
	 * Draggable popup window.
	 *
	 * @class PopUp
	 * @super DomWidget
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {Number} x - x position.
	 * @param {Number} y - y position.
	 * @param {Number} width - initial width.
	 * @param {Number} height - initial height.
	 **/
	var PopUp = function(x, y, width, height) {
		/**
	     * X position.
	     * 
	     * @property x
	     * @type Number
	     **/
	    this.x = 0;
	    
	    /**
	     * Y position.
	     * 
	     * @property y
	     * @type Number
	     **/
	    this.y = 0;
	    
	    /**
	     * Width.
	     * 
	     * @property width
	     * @type Number
	     **/
	    this.width = 0;
	    
	    /**
	     * Height.
	     * 
	     * @property height
	     * @type Number
	     **/
	    this.height = 0;
	    
	    /**
	     * Close handler.
	     * 
	     * @property onClose
	     * @type Function
	     **/
	    this.onClose = null;
		
		/**
	     * Inner HTML structure.
	     * 
	     * @property html
	     * @type Object
	     **/
	    this.html = { container: $("<div class='popup_wnd'></div>")[0] };
		
		//craate popup elements
		var html = this.html;
		
		html.titleBar = $("<div class='popup_title'></div>").appendTo(html.container)[0];
		html.titleTxt = $("<div>Window title</div>").appendTo(html.titleBar)[0];
		html.closeBtn = $("<div class='popup_closer icon-remove'></div>").appendTo(html.titleBar)[0];
		html.content = $("<div class='ed_popup_content'></div>").appendTo(html.container)[0];
		
		//update popup size and position
		this.pos(x, y).size(width, height).open();
		
		//setup drag & drop and close events
		html.closeBtn._popup_ = html.titleBar._popup_ = this;
		
		$(html.titleBar).mousedown(startDrag);
		$(html.closeBtn).mousedown(preventDrag).click(closePopup);
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = PopUp.prototype;
	
	/**
	 * Append html element to popup.
	 * 
	 * @method append
	 * @param {Object} el - html element.
	 * 
	 * @return {PopUp} this for chaining.
	 **/
	p.append = function(el) {
		if (el.html && el.html.container) el = el.html.container;
		$(this.html.content).append(el);
		return this;
	}
	
	/**
	 * Append html element to popup.
	 * 
	 * @method append
	 * @param {String} txt - title text.
	 * 
	 * @return {PopUp} this for chaining.
	 **/
	p.setTitle = function(txt) {
		$(this.html.titleTxt).text(txt);
		return this;
	}
	
	/**
	 * Open popup.
	 * 
	 * @method open
	 * 
	 * @return {PopUp} this for chaining.
	 **/
	p.open = function() {
		$(this.html.container).appendTo($('body')[0]);
		return this;
	}
	
	/**
	 * Close popup.
	 * 
	 * @method close
	 * 
	 * @return {PopUp} this for chaining.
	 **/
	p.close = function() {
		if (this.onClose) this.onClose();
		$(this.html.container).detach();
		return this;
	}
	
	/**
	 * Set popup size.
	 * 
	 * @method size
	 * @param {Number} width - width.
	 * @param {Number} height - height.
	 * 
	 * @return {PopUp} this for chaining.
	 **/
	p.size = function(width, height) {
		if (width != null) {
			this.width = width;
			$(this.html.container).css({ width: width });
			
			$(this.html.titleBar).css({ width: width - 45 });
			$(this.html.content).css({ width: width });
			
			$(this.html.closeBtn).css({ left: width - 33 });
		}
		
		if (height != null) {
			this.height = height;
			$(this.html.container).css({ height: height + 54 });
			$(this.html.content).css({ height: height });
		}
		
		return this;
	}
	
	/**
	 * Set popup position.
	 * 
	 * @method pos
	 * @param {Number} x - x position.
	 * @param {Number} y - y position.
	 * 
	 * @return {PopUp} this for chaining.
	 **/
	p.pos = function(x, y) {
		this.x = x; this.y = y;
		$(this.html.container).css({ top: y, left: x });
		return this;
	}
	
	/**
	 * Move popup by deltas.
	 * 
	 * @method move
	 * @param {Number} dx - x delta.
	 * @param {Number} dy - y delta.
	 * 
	 * @return {PopUp} this for chaining.
	 **/
	p.move = function(dx, dy) {
		this.pos(this.x + dx, this.y + dy);
		return this;
	}
	
	/**
	 * Return a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[PopUp]";
	}
	
	//set up for global use
	window.PopUp = PopUp;
}() );
