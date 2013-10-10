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
 * TabSwitch by OlegoS, 19 May 2013
 *
 * Simple multitab div.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * Simple multitab div.
	 *
	 * @class TabSwitch
	 * @super DomWidget
	 * @author OlegoS
	 *
	 * @constructor
	 **/
	var TabSwitch = function() {
		//initialize base class
		DomWidget.call(this);
	    
	    /**
	     * Selected tab reference.
	     * 
	     * @property selected
	     * @type Object
	     **/
	    this.selected = null;
	    
	    //create tabswitch elements
	    var html = this.html, tabSwitch = html.container;
	    
	    html.tabsBar = $("<div class='dw_tab_switch_bar'></div>").appendTo(tabSwitch)[0];
	    html.content = $("<div class='dw_tab_switch_content'></div>").appendTo(tabSwitch)[0];
	}
	
	//extend from DomWidget
	inheritProto(TabSwitch, DomWidget);
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = TabSwitch.prototype;
	
	/**
	 * Add tab. Name is used in css and js to determine tab style and code.
	 * 
	 * @method addTab
	 * @param {String} name - tab name for inner use.
	 * @param {String} title - tab title is displayed on tab button. If omitted, name is used.
	 * 
	 * @return {Object} this for chaining.
	 **/
	p.addTab = function(name, title) {
		var self = this, html = self.html, txt = title || name, tabBtn;
		
		html[name + 'Tab'] = $("<div class='dw_tab_switch_content_new'></div>").appendTo(html.content)[0];
		html[name + 'TabBtn'] = $("<div class='dw_tab_switch_btn'>" + txt + "</div>").appendTo(html.tabsBar)[0];
			
		tabBtn = html[name + 'TabBtn'];
		tabBtn._content_ = html[name + 'Tab'];
		
		$(tabBtn).click(function() {
			if (self.selected) {
				$(self.selected).removeClass('dw_tab_switch_btn_active');
				$(self.selected._content_).css({ visibility: 'hidden' });
			}
			
			self.selected = this;
			$(this).addClass('dw_tab_switch_btn_active');
			$(this._content_).css({ visibility: 'visible' });
		});
		
		return this;
	}
	
	/**
	 * Inner set width method.
	 * 
	 * @method _setWidth
	 * @private
	 * @param {Number} width - width.
	 **/
	p._setWidth = function(width) {
		var html = this.html;
		
		$(html.tabsBar).css({ width: width - 1 });
		$(html.content).css({ width: width - 2 });
	}
	
	/**
	 * Inner set height method.
	 * 
	 * @method _setHeight
	 * @private
	 * @param {Number} height - height.
	 **/
	p._setHeight = function(height) {
		var html = this.html;
		
		$(html.container).css({ height: height + 25 });
		$(html.content).css({ height: height });
	}
	
	/**
	 * Return a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[TabSwitch]";
	}
	
	//set up for global use
	window.TabSwitch = TabSwitch;
}() );
