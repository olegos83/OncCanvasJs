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
		//empty constructor
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
 * DataProvider by OlegoS, 09 Apr 2013
 *
 * A wrapper for array to manage data collections.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * DataProvider is designed to work with data collections.
	 * Support of events are imlemented via EventListener inheritance.
	 * 
	 * Any class may be inherited from DataProvider to support data events.
	 * Class instances, inherited from DataProvider have 'data' property, which must not be overriden.
	 * 
	 * Event support can slow down items iteration, so you can directly use 'data' property
	 * to get more iteration speed, but in that case, events must be processed manually. 
	 * 
	 * @class DataProvider
	 * @super EventListener
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {Array} data - initial data array. By default it is empty.
	 **/
	var DataProvider = function(data) {
		//initialize base class
		EventListener.call(this);
		
	    /**
	     * Data array.
	     * 
	     * @property data
	     * @type Array
	     **/
	    this.data = (data == null ? [] : data);
	}
	
	//extend from EventListener
	inheritProto(DataProvider, EventListener);
	
	
//STATIC
	/**
	 * Data event types.
	 **/
	var DataEvent = {
	    ADD: 'add',
	    REMOVE: 'remove',
	    CLEAR: 'clear',
	    CHANGE: 'change'
	};
	
//PROTOTYPE
	//get prototype reference
	var p = DataProvider.prototype;
	
	/**
	 * Add item to the end of data.
	 * 
	 * @method add
	 * @param {Object} item - item.
	 **/
	p.add = function(item) {
		this.data.push(item);
		this.processEvent({ item: item, type: DataEvent.ADD });
	}

	/**
	 * Add item to data at specified index.
	 * 
	 * @method addAt
	 * @param {Object} item - item.
	 * @param {Number} index - index.
	 **/
	p.addAt = function(item, index) {
	    this.data.splice(index, 0, item);
	    this.processEvent({ item: item, index: index, type: DataEvent.ADD });
	}

	/**
	 * Remove item from data.
	 * 
	 * @method remove
	 * @param {Object} item - item.
	 **/
	p.remove = function(item) {
		var data = this.data, l = data.length, i;
		
		for (i = 0; i < l; i++) if (data[i] == item) {
			data.splice(i, 1);
			this.processEvent({ item: item, type: DataEvent.REMOVE });
			break;
		}
	}

	/**
	 * Remove item from data at specified index.
	 * 
	 * @method removeAt
	 * @param {Number} index - index.
	 **/
	p.removeAt = function(index) {
		var evt = { item: this.data[index], index: index, type: DataEvent.REMOVE };
		
	    this.data.splice(index, 1);
	    this.processEvent(evt);
	}

	/**
	 * Remove all data.
	 * 
	 * @method clear
	 **/
	p.clear = function() {
		var evt = { data: this.data, type: DataEvent.CLEAR };
		
	    this.data = [];
	    this.processEvent(evt);
	}

	/**
	 * Get item at specified index.
	 * 
	 * @method itemAt
	 * @param {Number} index - index.
	 * 
	 * @return {Object} found item.
	 **/
	p.itemAt = function(index) {
	    return this.data[index];
	}

	/**
	 * Get item index.
	 * 
	 * @method indexOf
	 * @param {Object} item - item.
	 * 
	 * @return {Number} item index or -1, if no item found.
	 **/
	p.indexOf = function(item) {
		var data = this.data, l = data.length, i;
		
	    for (i = 0; i < l; i++) if (data[i] == item) return i;
	    return -1;
	}

	/**
	 * Set item index.
	 * 
	 * @method setItemIndex
	 * @param {Object} item - item.
	 * @param {Number} index - index.
	 **/
	p.setItemIndex = function(item, index) {
		var data = this.data, l = data.length, i;
	    
		for (i = 0; i < l; i++) if (data[i] == item) {
			data.splice(i, 1);
		    data.splice(index, 0, item);
		    
		    this.processEvent({ item: item, oldIndex: i, newIndex: index, type: DataEvent.CHANGE });
		    break;
	    }
	}

	/**
	 * Get number of items in data.
	 * 
	 * @method length
	 * 
	 * @return {Number} number of items.
	 **/
	p.length = function() {
		return this.data.length;
	}

	/**
	 * Invoke method for all items.
	 * 
	 * @method each
	 * @param {Function} method - method.
	 * @param {Array} parameters - parameters.
	 **/
	p.each = function(method, parameters) {
		var data = this.data, l = data.length, i;
		for (i = 0; i < l; i++) method.apply(data[i], parameters);
	}

	/**
	 * Clone data provider. Event handlers are not cloned.
	 * 
	 * @method clone
	 * 
	 * @return {DataProvider} a cloned DataProvider.
	 **/
	p.clone = function() {
	    var data = this.data, l = data.length, tmpArr = [], i;
	    
	    for (i = 0; i < l; i++) tmpArr.push(data[i]);
	    return new DataProvider(tmpArr);
	}

	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[DataProvider(" + this.data + ")]";
	}
	
	//set up for global use
	window.DataEvent = DataEvent;
	window.DataProvider = DataProvider;
}() );
