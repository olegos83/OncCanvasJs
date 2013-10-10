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
 * Palette by OlegoS, 4 Jun 2013
 *
 * Selectable color palette.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	//palette color set
	var colors = [
		'#ffffff', '#000000', '#ff0000', '#f26522', '#ffff00', '#006600', '#00cc00', '#33ccff', '#000099', '#0000ff', '#ff00ff', '#ff6699', '#603913', '#800000',
		'#ebebeb', '#e1e1e1', '#d7d7d7', '#cbcbcb', '#c2c2c2', '#b7b7b7', '#acacac', '#a0a0a0', '#959595', '#898989', '#7d7d7d', '#707070', '#626262', '#555555',
		'#464646', '#2b2b2b', '#262626', '#111111', '#000000', '#c7b299', '#998675', '#736357', '#534741', '#37302d', '#37302d', '#c69c6e', '#a67c52', '#8c6239',
		'#754c24', '#603913', '#003366', '#336699', '#3366cc', '#003399', '#000099', '#0000cc', '#000066', '#006666', '#006699', '#0099cc', '#0066cc', '#0033cc',
		'#0000ff', '#3333ff', '#333399', '#008080', '#009999', '#33cccc', '#00ccff', '#0099ff', '#0066ff', '#3366ff', '#3333cc', '#666699', '#339966', '#00cc99',
		'#00ffcc', '#00ffff', '#33ccff', '#3399ff', '#6699ff', '#6666ff', '#6600ff', '#6600cc', '#339933', '#00cc66', '#00ff99', '#66ffcc', '#66ffff', '#66ccff',
		'#99ccff', '#9999ff', '#9966ff', '#9933ff', '#9900ff', '#006600', '#00cc00', '#00ff00', '#66ff99', '#99ffcc', '#ccffff', '#ccecff', '#ccccff', '#cc99ff',
		'#cc66ff', '#cc00ff', '#9900cc', '#003300', '#008000', '#33cc33', '#66ff66', '#99ff99', '#ccffcc', '#ffffff', '#ffccff', '#ff99ff', '#ff66ff', '#cc00cc',
		'#660066', '#336600', '#009900', '#66ff33', '#99ff66', '#ccff99', '#ffffcc', '#ffcccc', '#ff99cc', '#ff66cc', '#ff33cc', '#cc0099', '#800080', '#333300',
		'#669900', '#99ff33', '#ccff66', '#ffff99', '#ffcc99', '#ff9999', '#ff6699', '#ff3399', '#cc3399', '#990099', '#666633', '#99cc00', '#ccff33', '#ffff66',
		'#ffcc66', '#ff9966', '#ff7c80', '#ff0066', '#d60093', '#993366', '#808000', '#cccc00', '#ffcc00', '#ff9933', '#ff6600', '#ff5050', '#cc0066', '#660033',
		'#996633', '#cc9900', '#ff9900', '#cc6600', '#ff3300', '#cc0000', '#990033', '#663300', '#996600', '#cc3300', '#993300', '#990000', '#800000', '#a50021'
	];
	
	//color element hover
	function colorOver() { $(this).css('border-color', '#ff6a0a'); }
	function colorOut() { $(this).css('border-color', $(this).css('background-color')); }
	
	
//CONSTRUCTOR
	/**
	 * Selectable color palette.
	 *
	 * @class Palette
	 * @super DomWidget
	 * @author OlegoS
	 *
	 * @constructor
	 **/
	var Palette = function() {
		//initialize base class
		DomWidget.call(this);
		
		//init html
		this.addClass('dw_pal').size(80, 28);
	    
	    for (var i = 0, l = colors.length, pal = this.html.container, c; i < l; i++) {
	    	c = colors[i];
	    	$("<div class='dw_pal_color'></div>").css({ borderColor: c, backgroundColor: c }).hover(colorOver, colorOut).appendTo(pal);
	    }
	}
	
	//extend from DomWidget
	inheritProto(Palette, DomWidget);
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = Palette.prototype;
	
	/**
	 * Return a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[Palette]";
	}
	
	//set up for global use
	window.Palette = Palette;
}() );
