/**
 * @file Base DOM widget class.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Base widget class. All other widgets must be inherited from it.
 * Widget is a wrapper to DOM element and it can interract with other widgets.
 * 
 * Widget can be created dynamically or wrap existing DOM element and
 * it implements basic DOM manipulations.
 * 
 * CSS is used to stylish the widget - all css classes are defined
 * in 'webbyjs.css' file. Default CSS classes prefix for WebbyJs widgets is '_w_'.
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
		 * Native DOM element.
		 * 
		 * @memberof Widget
		 * @type {Element}
		 */
		this.element = null;
		
		/**
		 * Parent widget.
		 * 
		 * @memberof Widget
		 * @type {Widget}
		 */
		this.parent = null;
		
		/**
		 * Top position inside parent widget.
		 * 
		 * @memberof Widget
		 * @type {Number}
		 * 
		 * @private
		 */
		this._top = 0;
		
		/**
		 * Left position inside parent widget.
		 * 
		 * @memberof Widget
		 * @type {Number}
		 * 
		 * @private
		 */
		this._left = 0;
		
		/**
		 * Widget full width, including padding and border.
		 * 
		 * @memberof Widget
		 * @type {Number}
		 * 
		 * @private
		 */
		this._width = 0;
		
		/**
		 * Widget full height, including padding and border.
		 * 
		 * @memberof Widget
		 * @type {Number}
		 * 
		 * @private
		 */
		this._height = 0;
		
		/**
		 * Widget CSS styles.
		 * 
		 * @memberof Widget
		 * @type {Object}
		 * 
		 * @private
		 */
		this._css = {};
		
		//initialize widget
		this.element = document.createElement(tag || 'div');
		this.element.className = '_w_widget';
	},
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Attach widget to existing DOM element.
		 * 
		 * @method attach
		 * @memberof Widget.prototype
		 * 
		 * @param {Element} el - DOM element reference.
		 * 
		 * @returns {Widget} current instance for chaining.
		 */
		attach: function(el) {
			return this;
		},
		
		/**
		 * Detach widget from DOM element.
		 * 
		 * @method detach
		 * @memberof Widget.prototype
		 * 
		 * @returns {Widget} current instance for chaining.
		 */
		detach: function() {
			return this;
		},
		
		/**
		 * Append this widget to another widget or html element.
		 * 
		 * @method appendTo
		 * @memberof Widget.prototype
		 * 
		 * @param {Widget} w - parent widget.
		 * 
		 * @returns {Widget} current instance for chaining.
		 **/
		appendTo: function(w) {
			this.parent = w;
			
			if (w.html) w = w.html.content;
			w.appendChild(this.html.container);
			
			return this;
		},
		
		/**
		 * Append child widget or html element to this widget.
		 * 
		 * @method append
		 * @memberof Widget.prototype
		 * 
		 * @param {Widget} w - child widget.
		 * 
		 * @returns {Widget} current instance for chaining.
		 **/
		append: function(w) {
			if (w.html) {
				w.parent = this;
				w = w.html.container;
			}
			
			this.html.content.appendChild(w);
			return this;
		},
		
		/**
		 * Insert this widget to DOM before another widget or html element.
		 * 
		 * @method insertBefore
		 * @memberof Widget.prototype
		 * 
		 * @param {Widget} w - near widget.
		 * 
		 * @returns {Widget} current instance for chaining.
		 **/
		insertBefore: function(w) {
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
		},
		
		/**
		 * Insert this widget to DOM after another widget or html element.
		 * 
		 * @method insertAfter
		 * @memberof Widget.prototype
		 * 
		 * @param {Widget} w - near widget.
		 * 
		 * @returns {Widget} current instance for chaining.
		 **/
		insertAfter: function(w) {
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
		},
		
		/**
		 * Remove this widget and its element from DOM.
		 * 
		 * @method remove
		 * @memberof Widget.prototype
		 * 
		 * @returns {Widget} current instance for chaining.
		 **/
		remove: function() {
			var w = this.parent;
			
			if (w) {
				var container = this.html.container;
				
				if (w.html) w = w.html.content;
				w.removeChild(container);
				
				this.parent = null;
			}
			
			return this;
		},
		
		/**
		 * Get/Set widget's DOM properties.
		 * 
		 * @method prop
		 * @memberof Widget.prototype
		 * 
		 * @param {Object} prop - properties object, { prop: value, ... }.
		 * 
		 * @returns {Widget} current instance for chaining.
		 * @return {Object} this for chaining or container reference, when called without arguments.
		 **/
		prop: function(prop) {
			if (!prop) return this.html.container;
			
			var container = this.html.container, p;
			for (p in prop) container[p] = prop[p];
			
			return this;
		},
		
		/**
		 * Get/Set CSS rules for widget. Manipulations allways apply to html.container.style, but
		 * if widget is inserted to DOM - computed style is returned, if not - html.container.style.
		 * 
		 * @method css
		 * @memberof Widget.prototype
		 * 
		 * @param {Object} css - css object, { style: value, ... }.
		 * 
		 * @returns {Widget} current instance for chaining.
		 * @return {Object} this for chaining or css reference, when called without arguments.
		 **/
		css: function(css) {
			if (!css) return (this.parent == null ? this.html.container.style : getComputedStyle(this.html.container, ''));
			
			var style = this.html.container.style, p;
			for (p in css) style[p] = css[p];
			
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
		 **/
		addClass: function(name) {
			var container = this.html.container;

			if (container.className.indexOf(name) == -1) container.className += ' ' + name;
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
		 **/
		removeClass: function(name) {
			var container = this.html.container;
			
			container.className = container.className.replace(name, "");
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
		 **/
		hasClass: function(name) {
			return (this.html.container.className.indexOf(name) != -1);
		},
		
		/**
		 * Show widget - make it visible.
		 * 
		 * @method show
		 * @memberof Widget.prototype
		 * 
		 * @returns {Widget} current instance for chaining.
		 **/
		show: function() {
			return this.removeClass('owl_hidden').addClass('owl_visible');
		},
		
		/**
		 * Hide widget - make it invisible.
		 * 
		 * @method hide
		 * @memberof Widget.prototype
		 * 
		 * @returns {Widget} current instance for chaining.
		 **/
		hide: function() {
			return this.removeClass('owl_visible').addClass('owl_hidden');
		},
		
		/**
		 * Get/Set html inside widget.
		 * 
		 * @method html
		 * @memberof Widget.prototype
		 * 
		 * @param {String} html - html string.
		 * 
		 * @returns {Widget} current instance for chaining.
		 * @return {Object} this for chaining or html content, if called without arguments.
		 **/
		html: function(html) {
			if (arguments.length == 0) return this.html.content.innerHTML;
			
			this.html.content.innerHTML = html;
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
		 * @returns {Widget} current instance for chaining.
		 * @return {Object} this for chaining or text content, if called without arguments.
		 **/
		text: function(txt) {
			if (arguments.length == 0) return this.html.content.textContent;
			
			this.html.content.textContent = txt;
			return this;
		},
		
		/**
		 * Get/Set widget position in pixels inside parent element.
		 * 
		 * @method pos
		 * @memberof Widget.prototype
		 * 
		 * @param {Number} x - left coord.
		 * @param {Number} y - top coord.
		 * @param {String} type - positioning type, 'relative' or 'absolute'.
		 * 
		 * @returns {Widget} current instance for chaining.
		 * @return {Object} this for chaining or position inside parent widget as { x: x, y: y }, when called without arguments.
		 **/
		pos: function(x, y, type) {
			if (arguments.length < 2) return { x: this.html.container.offsetLeft, y: this.html.container.offsetTop };
			
			var style = this.html.container.style;
			
			if (type == 'absolute' || type == 'relative') style.position = type;
			style.left = x + 'px'; style.top = y + 'px';
			
			return this;
		},
		
		/**
		 * Get/Set x widget coord in pixels inside parent element.
		 * 
		 * @method x
		 * @memberof Widget.prototype
		 * 
		 * @param {Number} x - left coord.
		 * 
		 * @returns {Widget} current instance for chaining.
		 * @return {Object} this for chaining or current x coord inside parent widget, when called without arguments.
		 **/
		x: function(x) {
			if (arguments.length == 0) return this.html.container.offsetLeft;
			
			this.html.container.style.left = x + 'px';
			return this;
		},
		
		/**
		 * Get/Set y widget coord in pixels inside parent element.
		 * 
		 * @method y
		 * @memberof Widget.prototype
		 * 
		 * @param {Number} y - top coord.
		 * 
		 * @returns {Widget} current instance for chaining.
		 * @return {Object} this for chaining or current y coord inside parent widget, when called without arguments.
		 **/
		y: function(y) {
			if (arguments.length == 0) return this.html.container.offsetTop;
			
			this.html.container.style.top = y + 'px';
			return this;
		},
		
		/**
		 * Get/Set widget size in pixels. This size is a full outer dimensions of the widget.
		 * Correct size is returned only if widget exists in DOM.
		 * 
		 * @method size
		 * @memberof Widget.prototype
		 * 
		 * @param {Number} w - width.
		 * @param {Number} h - height.
		 * 
		 * @returns {Widget} current instance for chaining.
		 * @return {Object} this for chaining or widget size as { width: width, height: height }, when called without arguments.
		 **/
		size: function(w, h) {
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
		},
		
		/**
		 * Get/Set outer widget width in pixels.
		 * Correct width is returned only if widget exists in DOM.
		 * 
		 * @method width
		 * @memberof Widget.prototype
		 * 
		 * @param {Number} w - width.
		 * 
		 * @returns {Widget} current instance for chaining.
		 * @return {Object} this for chaining or current width, when called without arguments.
		 **/
		width: function(w) {
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
		},
		
		/**
		 * Get/Set outer widget height in pixels.
		 * Correct height is returned only if widget exists in DOM.
		 * 
		 * @method height
		 * @memberof Widget.prototype
		 * 
		 * @param {Number} h - height.
		 * 
		 * @returns {Widget} current instance for chaining.
		 * @return {Object} this for chaining or current height, when called without arguments.
		 **/
		height: function(h) {
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
		},
		
		/**
		 * Add DOM event handler to widget.
		 * Event is added to html.container. Use its _widget_ property to access widget.
		 * 
		 * @method addEvent
		 * @memberof Widget.prototype
		 * 
		 * @param {String} type - event type.
		 * @param {Function} handler - event handler.
		 * 
		 * @returns {Widget} current instance for chaining.
		 **/
		addEvent: function(type, handler) {
			this.html.container.addEventListener(type, handler, false);
			return this;
		},
		
		/**
		 * Remove DOM event handler from widget.html.container.
		 * 
		 * @method removeEvent
		 * @memberof Widget.prototype
		 * 
		 * @param {String} type - event type.
		 * @param {Function} handler - event handler.
		 * 
		 * @returns {Widget} current instance for chaining.
		 **/
		removeEvent: function(type, handler) {
			this.html.container.removeEventListener(type, handler, false);
			return this;
		}
	}
});
