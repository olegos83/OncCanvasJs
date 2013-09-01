/*
 * Widget by OlegoS, 15 Jul 2013
 *
 * Base widget class.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	//add hidden div to calculate widget metrics
	var _metrics;
	
	function _addHD() {
		document.removeEventListener("DOMContentLoaded", _addHD, false);
		
		_metrics = document.createElement('div');
		_metrics.style.position = 'absolute';
		_metrics.style.top = _metrics.style.left = '0';
		_metrics.style.visibility = 'hidden';
		
		document.body.appendChild(_metrics);
	}
	
	document.addEventListener("DOMContentLoaded", _addHD, false);
	
	
//CONSTRUCTOR
	/**
	 * Base widget class. All widgets must be inherited from it.
	 * 
	 * All HTML structure is stored in 'html' object property and can be extended in realtime
	 * by html elements or widgets. By default, it has only 'container' and 'content' elements,
	 * which refer to the same 'div' element.
	 * 
	 * All DOM manipulations affect html.container and child elements are added to html.content.
	 * Child element can be either html element or another widget.
	 * 
	 * CSS schemes are highly recomended to be used for visual theming. Default CSS prefix is 'owl_'.
	 *
	 * @class Widget
	 * @author OlegoS
	 *
	 * @constructor
	 **/
	var Widget = function() {
		/**
		 * Metrics calculation element.
		 * 
		 * @property _metrics
		 * @type Object
		 * 
		 * @private
		 **/
		this._metrics = _metrics;
		
		/**
		 * Parent widget or html element reference.
		 * 
		 * @property parent
		 * @type Widget
		 **/
		this.parent = null;
		
		/**
	     * Inner HTML structure. Can contain other widgets too.
	     * Must have container and content, which are the same by default.
	     * 
	     * @property html
	     * @type Object
	     **/
	    this.html = { container: document.createElement('div') };
	    
	    //initialize html structure
	    var html = this.html;
		html.content = html.container;
		
		html.container.className = 'owl_widget';
		html.container._widget_ = this;
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Widget.prototype;
	
	/**
	 * Append this widget to another widget or html element.
	 * 
	 * @method appendTo
	 * @param {Widget} w - parent widget.
	 * 
	 * @return {Widget} this for chaining.
	 **/
	p.appendTo = function(w) {
		this.parent = w;
		
		if (w.html) w = w.html.content;
		w.appendChild(this.html.container);
		
		return this;
	}
	
	/**
	 * Append child widget or html element to this widget.
	 * 
	 * @method append
	 * @param {Widget} w - child widget.
	 * 
	 * @return {Widget} this for chaining.
	 **/
	p.append = function(w) {
		if (w.html) {
			w.parent = this;
			w = w.html.container;
		}
		
		this.html.content.appendChild(w);
		return this;
	}
	
	/**
	 * Insert this widget to DOM before another widget or html element.
	 * 
	 * @method insertBefore
	 * @param {Widget} w - near widget.
	 * 
	 * @return {Widget} this for chaining.
	 **/
	p.insertBefore = function(w) {
		var next;
		
		if (w.html) {
			next = w.html.container;
			w = w.parent;
		} else {
			next = w;
			w = w.parentNode;
		}
		
		if (w) {
			this.parent = w;
			if (w.html) w = w.html.content;
			w.insertBefore(this.html.container, next);
		}
		
		return this;
	}
	
	/**
	 * Insert this widget to DOM after another widget or html element.
	 * 
	 * @method insertAfter
	 * @param {Widget} w - near widget.
	 * 
	 * @return {Widget} this for chaining.
	 **/
	p.insertAfter = function(w) {
		var next;
		
		if (w.html) {
			next = w.html.container.nextSibling;
			w = w.parent;
		} else {
			next = w.nextSibling;
			w = w.parentNode;
		}
		
		if (w) {
			this.parent = w;
			if (w.html) w = w.html.content;
			if (next) w.insertBefore(this.html.container, next); else w.appendChild(this.html.container);
		}
		
		return this;
	}
	
	/**
	 * Remove this widget with all its children from DOM.
	 * 
	 * @method remove
	 * 
	 * @return {Widget} this for chaining.
	 **/
	p.remove = function() {
		var w = this.parent;
		
		if (w) {
			var container = this.html.container;
			
			if (w.html) w = w.html.content;
			w.removeChild(container);
			
			this.parent = null;
		}
		
		return this;
	}
	
	/**
	 * Get/Set widget's DOM properties.
	 * 
	 * @method prop
	 * @param {Object} prop - properties object, { prop: value, ... }.
	 * 
	 * @return {Object} this for chaining or container reference, when called without arguments.
	 **/
	p.prop = function(prop) {
		if (!prop) return this.html.container;
		
		var container = this.html.container, p;
		for (p in prop) container[p] = prop[p];
		
		return this;
	}
	
	/**
	 * Get/Set CSS rules for widget. Manipulations allways apply to html.container.style, but
	 * if widget is inserted to DOM - computed style is returned, if not - html.container.style.
	 * 
	 * @method css
	 * @param {Object} css - css object, { style: value, ... }.
	 * 
	 * @return {Object} this for chaining or css reference, when called without arguments.
	 **/
	p.css = function(css) {
		if (!css) return (this.parent == null ? this.html.container.style : getComputedStyle(this.html.container, ''));
		
		var style = this.html.container.style, p;
		for (p in css) style[p] = css[p];
		
		return this;
	}
	
	/**
	 * Add CSS class to widget.
	 * 
	 * @method addClass
	 * @param {String} name - class name.
	 * 
	 * @return {Widget} this for chaining.
	 **/
	p.addClass = function(name) {
		var container = this.html.container;

		if (container.className.indexOf(name) == -1) container.className += ' ' + name;
		return this;
	}
	
	/**
	 * Remove CSS class from widget.
	 * 
	 * @method removeClass
	 * @param {String} name - class name.
	 * 
	 * @return {Widget} this for chaining.
	 **/
	p.removeClass = function(name) {
		var container = this.html.container;
		
		container.className = container.className.replace(name, "");
		return this;
	}
	
	/**
	 * Check CSS class existance for widget.
	 * 
	 * @method hasClass
	 * @param {String} name - class name.
	 * 
	 * @return {Boolean} true if widget has class or false otherwise.
	 **/
	p.hasClass = function(name) {
		return (this.html.container.className.indexOf(name) != -1);
	}
	
	/**
	 * Show widget - make it visible.
	 * 
	 * @method show
	 * 
	 * @return {Widget} this for chaining.
	 **/
	p.show = function() {
		return this.removeClass('owl_hidden').addClass('owl_visible');
	}
	
	/**
	 * Hide widget - make it invisible.
	 * 
	 * @method hide
	 * 
	 * @return {Widget} this for chaining.
	 **/
	p.hide = function() {
		return this.removeClass('owl_visible').addClass('owl_hidden');
	}
	
	/**
	 * Get/Set html inside widget.
	 * 
	 * @method innerHtml
	 * @param {String} html - html string.
	 * 
	 * @return {Object} this for chaining or html content, if called without arguments.
	 **/
	p.innerHtml = function(html) {
		if (arguments.length == 0) return this.html.content.innerHTML;
		
		this.html.content.innerHTML = html;
		return this;
	}
	
	/**
	 * Get/Set text inside widget.
	 * 
	 * @method text
	 * @param {String} txt - text string.
	 * 
	 * @return {Object} this for chaining or text content, if called without arguments.
	 **/
	p.text = function(txt) {
		if (arguments.length == 0) return this.html.content.textContent;
		
		this.html.content.textContent = txt;
		return this;
	}
	
	/**
	 * Get/Set widget position in pixels inside parent element.
	 * 
	 * @method pos
	 * @param {Number} x - left coord.
	 * @param {Number} y - top coord.
	 * @param {String} type - positioning type, 'relative' or 'absolute'.
	 * 
	 * @return {Object} this for chaining or position inside parent widget as { x: x, y: y }, when called without arguments.
	 **/
	p.pos = function(x, y, type) {
		if (arguments.length < 2) return { x: this.html.container.offsetLeft, y: this.html.container.offsetTop };
		
		var style = this.html.container.style;
		
		if (type == 'absolute' || type == 'relative') style.position = type;
		style.left = x + 'px'; style.top = y + 'px';
		
		return this;
	}
	
	/**
	 * Get/Set x widget coord in pixels inside parent element.
	 * 
	 * @method x
	 * @param {Number} x - left coord.
	 * 
	 * @return {Object} this for chaining or current x coord inside parent widget, when called without arguments.
	 **/
	p.x = function(x) {
		if (arguments.length == 0) return this.html.container.offsetLeft;
		
		this.html.container.style.left = x + 'px';
		return this;
	}
	
	/**
	 * Get/Set y widget coord in pixels inside parent element.
	 * 
	 * @method y
	 * @param {Number} y - top coord.
	 * 
	 * @return {Object} this for chaining or current y coord inside parent widget, when called without arguments.
	 **/
	p.y = function(y) {
		if (arguments.length == 0) return this.html.container.offsetTop;
		
		this.html.container.style.top = y + 'px';
		return this;
	}
	
	/**
	 * Get/Set widget size in pixels. This size is a full outer dimensions of the widget.
	 * Correct size is returned only if widget exists in DOM.
	 * 
	 * @method size
	 * @param {Number} w - width.
	 * @param {Number} h - height.
	 * 
	 * @return {Object} this for chaining or widget size as { width: width, height: height }, when called without arguments.
	 **/
	p.size = function(w, h) {
		var ctr = this.html.container;
		if (arguments.length < 2) return { width: ctr.offsetWidth, height: ctr.offsetHeight };
		
		var css;
		
		if ( document.body.contains(ctr) ) {
			css = getComputedStyle(ctr, '');
			ctr.style.width = w - (ctr.offsetWidth - parseInt(css.width)) + 'px';
			ctr.style.height = h - (ctr.offsetHeight - parseInt(css.height)) + 'px';
		} else {
			this._metrics.appendChild(ctr);
			
			css = getComputedStyle(ctr, '');
			ctr.style.width = w - (ctr.offsetWidth - parseInt(css.width)) + 'px';
			ctr.style.height = h - (ctr.offsetHeight - parseInt(css.height)) + 'px';
			
			this._metrics.removeChild(ctr);
		}
		
		return this;
	}
	
	/**
	 * Get/Set outer widget width in pixels.
	 * Correct width is returned only if widget exists in DOM.
	 * 
	 * @method width
	 * @param {Number} w - width.
	 * 
	 * @return {Object} this for chaining or current width, when called without arguments.
	 **/
	p.width = function(w) {
		if (arguments.length == 0) return this.html.container.offsetWidth;
		
		var ctr = this.html.container;
		
		if ( document.body.contains(ctr) ) {
			ctr.style.width = w - (ctr.offsetWidth - parseInt(getComputedStyle(ctr, '').width)) + 'px';
		} else {
			this._metrics.appendChild(ctr);
			ctr.style.width = w - (ctr.offsetWidth - parseInt(getComputedStyle(ctr, '').width)) + 'px';
			this._metrics.removeChild(ctr);
		}
		
		return this;
	}
	
	/**
	 * Get/Set outer widget height in pixels.
	 * Correct height is returned only if widget exists in DOM.
	 * 
	 * @method height
	 * @param {Number} h - height.
	 * 
	 * @return {Object} this for chaining or current height, when called without arguments.
	 **/
	p.height = function(h) {
		if (arguments.length == 0) return this.html.container.offsetHeight;
		
		var ctr = this.html.container;
		
		if ( document.body.contains(ctr) ) {
			ctr.style.height = h - (ctr.offsetHeight - parseInt(getComputedStyle(ctr, '').height)) + 'px';
		} else {
			this._metrics.appendChild(ctr);
			ctr.style.height = h - (ctr.offsetHeight - parseInt(getComputedStyle(ctr, '').height)) + 'px';
			this._metrics.removeChild(ctr);
		}
		
		return this;
	}
	
	/**
	 * Add DOM event handler to widget.
	 * Event is added to html.container. Use its _widget_ property to access widget.
	 * 
	 * @method addEvent
	 * @param {String} type - event type.
	 * @param {Function} handler - event handler.
	 * 
	 * @return {Widget} this for chaining.
	 **/
	p.addEvent = function(type, handler) {
		this.html.container.addEventListener(type, handler, false);
		return this;
	}
	
	/**
	 * Remove DOM event handler from widget.html.container.
	 * 
	 * @method removeEvent
	 * @param {String} type - event type.
	 * @param {Function} handler - event handler.
	 * 
	 * @return {Widget} this for chaining.
	 **/
	p.removeEvent = function(type, handler) {
		this.html.container.removeEventListener(type, handler, false);
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
	    return "[Widget]";
	}
	
	//set up for global use
	window.Widget = Widget;
}() );
