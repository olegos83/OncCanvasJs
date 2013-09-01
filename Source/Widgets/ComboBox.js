/*
 * ComboBox by OlegoS, 06 Jun 2013
 *
 * Combobox widget.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	//toggle combo select
	function toggleSelect() { $(this._widget_.html.content).toggleClass('dw_combo_select_open'); }
	
	//select item
	function selectItem() { this._widget_.selectItem(this); $(this._widget_.html.content).removeClass('dw_combo_select_open'); }
	
	
//CONSTRUCTOR
	/**
	 * Combobox widget.
	 *
	 * @class ComboBox
	 * @super DomWidget
	 * @author OlegoS
	 *
	 * @constructor
	 **/
	var ComboBox = function() {
		//initialize base class
		DomWidget.call(this);
		
		/**
		 * Items array.
		 * 
		 * @property items
		 * @type Array
		 **/
		this.items = [];
		
		/**
		 * Item select callback.
		 * 
		 * @property onSelect
		 * @type Function
		 **/
		this.onSelect = null;
		
		//init html
		this.addClass('dw_combo');
		
		var html = this.html, container = html.container;
		
		html.label = $("<div class='dw_combo_label'></div>").appendTo(container)[0];
		html.button = $("<div class='dw_combo_btn'></div>").click(toggleSelect).appendTo(container)[0];
		html.button._widget_ = this;
		html.content = $("<div class='dw_combo_select'></div>").appendTo(container)[0];
		
		this.size(150, 20);
	}
	
	//extend from DomWidget
	inheritProto(ComboBox, DomWidget);
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = ComboBox.prototype;
	
	/**
	 * Get/Set combo label.
	 * 
	 * @method label
	 * @param {String} label - new label.
	 * 
	 * @return {Object} this for chaining or label if no arguments.
	 **/
	p.label = function(label) {
		if (arguments.length == 0) return $(this.html.label).text();
		
		$(this.html.label).text(label);
		return this;
	}
	
	/**
	 * Add select text item.
	 * 
	 * @method addItem
	 * @param {String} item - new item.
	 * 
	 * @return {Object} this for chaining.
	 **/
	p.addItem = function(item) {
		var html = this.html, item = $("<div class='dw_combo_item'>" + item + "</div>").click(selectItem).appendTo(html.content)[0];
		
		item._widget_ = this;
		this.items.push(item);
		
		if (!html.selected) this.selectItem(item);
		return this;
	}
	
	/**
	 * Select item.
	 * 
	 * @method selectItem
	 * @param {Object} item - item to be selected.
	 * 
	 * @return {Object} this for chaining.
	 **/
	p.selectItem = function(item) {
		var html = this.html;
		if (html.selected) $(html.selected).removeClass('dw_combo_item_selected');
		
		html.selected = item;
		this.label($(item).addClass('dw_combo_item_selected').text());
		
		if (this.onSelect) this.onSelect(html.selected);
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
		
		$(html.label).css({ width: width - 28 });
		$(html.content).css({ width: width });
	}
	
	/**
	 * Inner set height method.
	 * 
	 * @method _setHeight
	 * @private
	 * @param {Number} height - height.
	 **/
	p._setHeight = function(height) {
		$(this.html.label).css({ height: height, lineHeight: height + 'px' });
	}
	
	/**
	 * Return a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[ComboBox]";
	}
	
	//set up for global use
	window.ComboBox = ComboBox;
}() );
