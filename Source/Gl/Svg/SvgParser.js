/*
 * SvgParser by OlegoS, 10 Apr 2013
 *
 * Svg parser for loading and saving vector graphics in svg format.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	//trim string
	function trim(str) { return str.replace(/^\s+|\s+$/g, ''); }
	
	//compress spaces inside string
	function compressSpaces(str) { return str.replace(/[\s\r\t\n]+/gm, ' '); }
	
	//ajax request
	function ajax(url) {
		var ajax = ( XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP') );
		
		ajax.open('GET', url, false);
		ajax.send(null);
			
	    return ajax.responseText;
	}
	
	//parse xml
	function parseXml(xml) {
		var doc;
		
		if (DOMParser) {
			doc = new DOMParser().parseFromString(xml, 'text/xml');
		} else {
			xml = xml.replace(/<!DOCTYPE svg[^>]*>/, '');
			
			doc = new ActiveXObject('Microsoft.XMLDOM');
			doc.async = 'false';
			doc.loadXML(xml);
		}
		
		return doc;
	}
	
	
//CONSTRUCTOR
	/**
	 * SvgParser parses svg file and builds objects tree, which is compatible
	 * with Owl_JS graphics lib.
	 * 
	 * @class SvgParser
	 * @author OlegoS
	 **/
	var SvgParser = function() {
		/**
	     * Svg source as it was loaded.
	     * 
	     * @property source
	     * @type String
	     **/
	    this.source = '';
	    
	    /**
	     * Svg DOM tree.
	     * 
	     * @property dom
	     * @type Document
	     **/
	    this.dom = null;
	    
	    /**
	     * Svg version.
	     * 
	     * @property version
	     * @type String
	     **/
	    this.version = '';
	    
	    /**
	     * Svg id.
	     * 
	     * @property id
	     * @type String
	     **/
	    this.id = '';
	    
	    /**
	     * Svg width.
	     * 
	     * @property width
	     * @type Number
	     **/
	    this.width = 0;
	    
	    /**
	     * Svg height.
	     * 
	     * @property height
	     * @type Number
	     **/
	    this.height = 0;
		
		/**
	     * Layer objects, compatible with Owl_JS.
	     * 
	     * @property layerObjects
	     * @type Array
	     **/
	    this.layerObjects = [];
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = SvgParser.prototype;
	
	/**
	 * Load svg source from string.
	 * 
	 * @method loadSvgString
	 * @param {String} str - svg source string.
	 **/
	p.loadSvgString = function(str) {
		this.source = str;
		this.dom = parseXml(str);
	}
	
	/**
	 * Load svg source from url.
	 * 
	 * @method loadSvgUrl
	 * @param {String} url - svg source url.
	 **/
	p.loadSvgUrl = function(url) {
		this.source = ajax(url);
		this.dom = parseXml(this.source);
	}
	
	/**
	 * Convert svg DOM to layer objects.
	 * Result is accumulated in this.layerObjects array.
	 * 
	 * @method parseSvg
	 * @param {Element} el - starting element.
	 **/
	p.parseSvg = function(el) {
		//return if not element
		if (el.nodeType != 1) return;
		
		//init vars
		var tag = el.nodeName, attrs = el.attributes, childs = el.childNodes, i, l;
		
		//parse attributes and prepare object properties
		var x = 0, y = 0, width = 0, height = 0, r = 0,
			path = '', transform = '', style = { fillColor: null, strokeColor: null },
			p, v, tmp;
		
		for (i = 0, l = attrs.length; i < l; i++) {
			p = attrs[i].name; v = attrs[i].value;
			
			if (p == 'x' || p == 'cx' || p == 'x1') {
				x = Number(v);
				
			} else if (p == 'y' || p == 'cy' || p == 'y1') {
				y = Number(v);
				
			} else if (p == 'width' || p == 'x2') {
				width = Number(v);
				
			} else if (p == 'height' || p == 'y2') {
				height = Number(v);
				
			} else if (p == 'r') {
				r = Number(v);
				
			} else if (p == 'd') {
				path = v;
				
			} else if (p == 'points') {
				path = 'M' + v;
				
			} else if (p == 'transform') {
				transform = v;
				
			} else if (p == 'fill') {
				style.fillColor = ( v == 'none' ? null : v );
				
			} else if (p == 'stroke') {
				style.strokeColor = ( v == 'none' ? null : v );
				
			} else if (p == 'stroke-width') {
				style.strokeWidth = Number(v);
				
			} else if (p == 'opacity') {
				style.opacity = Number(v);
				
			} else if (p == 'font-family') {
				tmp = FontsManager.styleByPostscript[v.replace(/'/g, '').toLowerCase()];
				
				style.fontFamily = tmp.fontFamily;
				style.fontWeight = tmp.fontWeight;
				style.fontStyle = tmp.fontStyle;
				
			} else if (p == 'font-size') {
				style.fontSize = v + 'px';
			}
		}
		
		//check up svg tag and create layer object
		var shape, obj, m;
		
		if (tag == 'rect') {
			shape = new Rectangle(new Point(x, y), new Point(x + width, y + height)).toPath();
			obj = new Shaper('svg_rect', shape, style);
			
		} else if (tag == 'line') {
			shape = new Path([ new Point(x, y), new Point(width, height) ]);
			obj = new Shaper('svg_line', shape, style);
			
		} else if (tag == 'circle') {
			shape = new Path();
			shape.ellipse(new Point(x, y), r, r);
			obj = new Shaper('svg_circle', shape, style);
			
		} else if (tag == 'polygon' || tag == 'polyline' || tag == 'path') {
			if (tag == 'polygon') path += 'Z';
			
			shape = new Path();
			shape.svg(path);
			
			obj = new Shaper('svg_' + tag, shape, style);
			
		} else if (tag == 'text') {
			obj = new Text('svg_text', el.textContent, style);
		}
		
		//apply transform
		if (transform.indexOf('matrix') != -1) {
			m = new Matrix();
			m.svg(transform);
			obj.matrixTransform(m);
		}
		
		//save object
		if (obj) this.layerObjects.push(obj);
		
		//parse childNodes
		for (i = 0, l = childs.length; i < l; i++) this.parseSvg(childs[i]);
	}
	
	/**
	 * Return a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[SvgParser]";
	}
	
	//set up for global use
	window.SvgParser = SvgParser;
}() );
