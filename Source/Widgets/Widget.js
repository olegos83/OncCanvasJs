/**
 * @file Base DOM widget class.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Base widget class. All other widgets must be inherited from it.
 * 
 * Widget is a wrapper to DOM element, it can interract with other widgets
 * and implements basic DOM manipulations.
 * 
 * CSS is used to stylish the widget - all css classes are defined
 * in 'webbyjs.css' file with '_w_' prefix.
 * 
 * @class Widget
 * @extends WObject
 * 
 * @memberof WebbyJs
 */
WebbyJs.Class({
	/**
	 * Class name.
	 */
	name: 'Widget',
	
	/**
	 * @constructor
	 * 
	 * @param {String} tag - native DOM element tag.
	 */
	construct: function Widget(tag) {
		/**
		 * Parent widget or DOM element.
		 * 
		 * @memberof Widget
		 * @type {Widget|Element}
		 */
		this.parent = null;
		
		/**
		 * Native DOM element.
		 * 
		 * @memberof Widget
		 * @type {Element}
		 */
		this.element = null;
		
		//initialize widget
		this.element = document.createElement(tag || 'div');
		this.element.className = '_w_widget';
	},
	
	/**
	 * Static members.
	 */
	statics: {
		/**
		 * Widget metrics div.
		 * 
		 * @memberof Widget
		 * @type {Element}
		 * 
		 * @private
		 */
		_metrics: null
	},
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Append this widget to another widget or DOM element.
		 * 
		 * @method appendTo
		 * @memberof Widget.prototype
		 * 
		 * @param {Widget|Element} w - parent widget.
		 * 
		 * @returns {Widget} current instance for chaining.
		 */
		appendTo: function(w) {
			if (w.element) { this.parent = w; w = w.element; } else this.parent = w;
			w.appendChild(this.element);
			
			return this;
		},
		
		/**
		 * Append child widget to this widget.
		 * 
		 * @method append
		 * @memberof Widget.prototype
		 * 
		 * @param {Widget} w - child widget.
		 * 
		 * @returns {Widget} current instance for chaining.
		 */
		append: function(w) {
			w.parent = this;
			this.element.appendChild(w.element);
			
			return this;
		},
		
		/**
		 * Insert this widget to DOM before another widget.
		 * 
		 * @method insertBefore
		 * @memberof Widget.prototype
		 * 
		 * @param {Widget} w - near widget.
		 * 
		 * @returns {Widget} current instance for chaining.
		 */
		insertBefore: function(w) {
			var parent = this.parent = w.parent;
			
			if (parent.element) parent = parent.element;
			parent.insertBefore(this.element, w.element);
			
			return this;
		},
		
		/**
		 * Insert this widget to DOM after another widget.
		 * 
		 * @method insertAfter
		 * @memberof Widget.prototype
		 * 
		 * @param {Widget} w - near widget.
		 * 
		 * @returns {Widget} current instance for chaining.
		 */
		insertAfter: function(w) {
			var parent = this.parent = w.parent, next = w.element.nextSibling;
			
			if (parent.element) parent = parent.element;
			if (next) parent.insertBefore(this.element, next); else parent.appendChild(this.element);
			
			return this;
		},
		
		/**
		 * Remove this widget from DOM.
		 * 
		 * @method remove
		 * @memberof Widget.prototype
		 * 
		 * @returns {Widget} current instance for chaining.
		 */
		remove: function() {
			var parent = this.parent;
			
			if (parent.element) parent = parent.element;
			parent.removeChild(this.element);
			
			this.parent = null;
			return this;
		},
		
		/**
		 * Get/Set CSS rules for widget. Manipulations allways apply to element.style, but
		 * if widget is inserted to DOM - computed style is returned, if not - element.style.
		 * 
		 * @method css
		 * @memberof Widget.prototype
		 * 
		 * @param {Object|String} css - css object as { style: value, ... } or property name.
		 * @param {String} val - css property value if style is set by name.
		 * 
		 * @returns {Widget|Object|String} current instance for chaining or css reference(value).
		 */
		css: function(css, val) {
			if (!css) {
				return (document.body.contains(this.element) ? getComputedStyle(this.element, '') : this.element.style);
			}
			
			if (typeof css == 'string') {
				if (val == null) {
					return (document.body.contains(this.element) ? getComputedStyle(this.element, '')[css] : this.element.style[css]);
				}
				
				this.element.style[css] = val;
			} else {
				var style = this.element.style;
				for (var p in css) style[p] = css[p];
			}
			
			return this;
		},
		
		/**
		 * Add CSS class to widget.
		 * 
		 * @method addClass
		 * @memberof Widget.prototype
		 * 
		 * @param {String} name - class name.
		 * 
		 * @returns {Widget} current instance for chaining.
		 */
		addClass: function(name) {
			if (this.element.className.indexOf(name) == -1) this.element.className += ' ' + name;
			return this;
		},
		
		/**
		 * Remove CSS class from widget.
		 * 
		 * @method removeClass
		 * @memberof Widget.prototype
		 * 
		 * @param {String} name - class name.
		 * 
		 * @returns {Widget} current instance for chaining.
		 */
		removeClass: function(name) {
			this.element.className = this.element.className.replace(name, '');
			return this;
		},
		
		/**
		 * Check CSS class existance for widget.
		 * 
		 * @method hasClass
		 * @memberof Widget.prototype
		 * 
		 * @param {String} name - class name.
		 * 
		 * @returns {Boolean} true if widget has class or false otherwise.
		 */
		hasClass: function(name) {
			return (this.element.className.indexOf(name) != -1);
		},
		
		/**
		 * Show widget - make it visible.
		 * 
		 * @method show
		 * @memberof Widget.prototype
		 * 
		 * @returns {Widget} current instance for chaining.
		 */
		show: function() {
			return this.removeClass('_w_hidden').addClass('_w_visible');
		},
		
		/**
		 * Hide widget - make it invisible.
		 * 
		 * @method hide
		 * @memberof Widget.prototype
		 * 
		 * @returns {Widget} current instance for chaining.
		 */
		hide: function() {
			return this.removeClass('_w_visible').addClass('_w_hidden');
		},
		
		/**
		 * Get/Set html inside widget.
		 * 
		 * @method html
		 * @memberof Widget.prototype
		 * 
		 * @param {String} html - html string.
		 * 
		 * @returns {Widget|String} current instance for chaining or html content, if called without arguments.
		 */
		html: function(html) {
			if (html == null) return this.element.innerHTML;
			
			this.element.innerHTML = html;
			return this;
		},
		
		/**
		 * Get/Set text inside widget.
		 * 
		 * @method text
		 * @memberof Widget.prototype
		 * 
		 * @param {String} txt - text string.
		 * 
		 * @returns {Widget|String} current instance for chaining or text content, if called without arguments.
		 */
		text: function(txt) {
			if (txt == null) return this.element.textContent;
			
			this.element.textContent = txt;
			return this;
		},
		
		/**
		 * Get/Set widget position in pixels inside parent element.
		 * 
		 * @method pos
		 * @memberof Widget.prototype
		 * 
		 * @param {Number} left - left coord.
		 * @param {Number} top - top coord.
		 * @param {String} type - positioning type, 'relative' or 'absolute'.
		 * 
		 * @returns {Widget|Object} current instance for chaining or position inside parent widget as { x: x, y: y }, when called without arguments.
		 */
		pos: function(left, top, type) {
			if (top == null) return { left: this.element.offsetLeft, top: this.element.offsetTop };
			
			var style = this.element.style;
			
			if (type == 'absolute' || type == 'relative') style.position = type;
			style.left = left + 'px'; style.top = top + 'px';
			
			return this;
		},
		
		/**
		 * Get/Set top widget coord in pixels inside parent element.
		 * 
		 * @method top
		 * @memberof Widget.prototype
		 * 
		 * @param {Number} top - top coord.
		 * 
		 * @returns {Widget|Number} current instance for chaining or top coord inside parent widget, when called without arguments.
		 */
		top: function(top) {
			if (top == null) return this.element.offsetTop;
			
			this.element.style.top = top + 'px';
			return this;
		},
		
		/**
		 * Get/Set left widget coord in pixels inside parent element.
		 * 
		 * @method left
		 * @memberof Widget.prototype
		 * 
		 * @param {Number} left - left coord.
		 * 
		 * @returns {Widget|Number} current instance for chaining or left coord inside parent widget, when called without arguments.
		 */
		left: function(left) {
			if (left == null) return this.element.offsetLeft;
			
			this.element.style.left = left + 'px';
			return this;
		},
		
		/**
		 * Get/Set outer widget size in pixels.
		 * 
		 * @method size
		 * @memberof Widget.prototype
		 * 
		 * @param {Number} w - width.
		 * @param {Number} h - height.
		 * 
		 * @returns {Widget|Object} current instance for chaining or widget size as { width: width, height: height }, when called without arguments.
		 */
		size: function(w, h) {
			var el = this.element, inDom = document.body.contains(el);
			if (!inDom) _w_Widget._metrics.appendChild(el);
			
			if (h == null) {
				if (!inDom) _w_Widget._metrics.removeChild(el);
				return { width: el.offsetWidth, height: el.offsetHeight };
			}
			
			var css = getComputedStyle(el, '');
			
			el.style.width = w - (el.offsetWidth - parseInt(css.width)) + 'px';
			el.style.height = h - (el.offsetHeight - parseInt(css.height)) + 'px';
			
			if (!inDom) _w_Widget._metrics.removeChild(el);
			return this;
		},
		
		/**
		 * Get/Set outer widget width in pixels.
		 * 
		 * @method width
		 * @memberof Widget.prototype
		 * 
		 * @param {Number} w - width.
		 * 
		 * @returns {Widget|Number} current instance for chaining or width, when called without arguments.
		 */
		width: function(w) {
			var el = this.element, inDom = document.body.contains(el);
			if (!inDom) _w_Widget._metrics.appendChild(el);
			
			if (w == null) {
				if (!inDom) _w_Widget._metrics.removeChild(el);
				return el.offsetWidth;
			}
			
			el.style.width = w - (el.offsetWidth - parseInt(getComputedStyle(el, '').width)) + 'px';
			
			if (!inDom) _w_Widget._metrics.removeChild(el);
			return this;
		},
		
		/**
		 * Get/Set outer widget height in pixels.
		 * 
		 * @method height
		 * @memberof Widget.prototype
		 * 
		 * @param {Number} h - height.
		 * 
		 * @returns {Widget|Number} current instance for chaining or height, when called without arguments.
		 */
		height: function(h) {
			var el = this.element, inDom = document.body.contains(el);
			if (!inDom) _w_Widget._metrics.appendChild(el);
			
			if (h == null) {
				if (!inDom) _w_Widget._metrics.removeChild(el);
				return el.offsetHeight;
			}
			
			el.style.height = h - (el.offsetHeight - parseInt(getComputedStyle(el, '').height)) + 'px';
			
			if (!inDom) _w_Widget._metrics.removeChild(el);
			return this;
		},
		
		/**
		 * Add DOM event handler to widget.
		 * 
		 * @method addEvent
		 * @memberof Widget.prototype
		 * 
		 * @param {String} type - event type.
		 * @param {Function} handler - event handler.
		 * 
		 * @returns {Widget} current instance for chaining.
		 */
		addEvent: function(type, handler) {
			this.element.addEventListener(type, handler, false);
			return this;
		},
		
		/**
		 * Remove DOM event handler from widget.
		 * 
		 * @method removeEvent
		 * @memberof Widget.prototype
		 * 
		 * @param {String} type - event type.
		 * @param {Function} handler - event handler.
		 * 
		 * @returns {Widget} current instance for chaining.
		 */
		removeEvent: function(type, handler) {
			this.element.removeEventListener(type, handler, false);
			return this;
		}
	}
});

/**
 * Initialize widget metrics div.
 */
WebbyJs.invoke(function() {
	function _addHD() {
        var _metrics = document.createElement('div');
        
        _metrics.style.position = 'absolute';
        _metrics.style.top = _metrics.style.left = '0';
        _metrics.style.visibility = 'hidden';
        
        document.removeEventListener("DOMContentLoaded", _addHD, false);
        document.body.appendChild(_metrics);
        
        WebbyJs.Widget._metrics = _metrics;
	}
	
	document.addEventListener("DOMContentLoaded", _addHD, false);
});
