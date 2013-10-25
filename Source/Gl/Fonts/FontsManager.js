/**
 * @file The implementation of WebbyJs class creation.
 * @author Olegos <olegos83@yandex.ru>
 */
WebbyJs.import({
	/**
	 * All WebbyJs members, which can be globalized.
	 * 
	 * @memberof WebbyJs
	 * @type {Array}
	 * 
	 * @private
	 */
	_globals: [],
	
	/**
	 * Class prototype inheritance method.
	 * 
	 * @method extendClass
	 * @memberof WebbyJs
	 * 
	 * @param {Object} child - child class reference.
	 * @param {Object} parent - parent class reference.
	 * 
	 * @returns {String} objects class name or '' for undefined or null obj.
	 */
	extendClass: function(child, parent) {
		if (child == parent) return;
	}
});


/*
 * FontsManager by OlegoS, 10 Apr 2013
 *
 * A vector font manager based on typefacejs rendering method.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	
	
//STATIC
	/**
	 * FontsManager can load and render fonts as vector data stored as object in a javascript file,
	 * which can be created with a font converter from ttf font file.
	 * 
	 * FontsManager has a configuration, stored in 'fonts_config.js' file, which contains a relationship
	 * between font files and styles. It is used for dynamic font load on demand.
	 * 
	 * If there is no requested font, it is substituted by 'Verdana', which must be added (bold and italic too)
	 * in any case to work properly.
	 * 
	 * Converter is a perl script, stored in Converter directory - it can be used as command line tool
	 * or uploaded to server and used online as cgi script.
	 * 
	 * @class FontsManager
	 * @author OlegoS
	 *
	 * @static
	 */
	var FontsManager = {
		/**
	     * Font filenames stored by font family_weight_style as key.
	     * 
	     * @property fileByStyle
	     * @type Object
	     */
	    fileByStyle: {},
	    
		/**
	     * Font data stored by font family_weight_style as key.
	     * 
	     * @property fontByStyle
	     * @type Object
	     */
	    fontByStyle: {},
	    
	    /**
	     * Font styles stored by Font.postscriptName as key.
	     * Styles are stored as objects like { fontFamily: 'family', fontWeight: 'weight', fontStyle: 'style' }.
	     * 
	     * @property styleByPostscript
	     * @type Object
	     */
	    styleByPostscript: {},
		
	    /**
		 * Load external font or config file.
		 * 
		 * @method load
		 * @param {String} src - path to font file.
		 */
	    load: function(src) {
	    	var ajax = ( XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP') );
			
			ajax.open('GET', src, false);
			ajax.send(null);
			
		    eval(ajax.responseText);
		},
		
		/**
		 * Set up configuration for font files and styles.
		 * 
		 * @method setConfig
		 * @param {Array} cfg - config info.
		 */
		setConfig: function(cfg) {
			for (var i = 0, l = cfg.length, f, s; i < l; i++) {
				f = cfg[i]; s = { fontFamily: f.family, fontWeight: f.weight, fontStyle: f.style };
				
				this.styleByPostscript[f.postscript] = s;
				this.fileByStyle[ this.getStyleKey(s) ] = f.file;
			}
		},
		
		/**
		 * Used by font file after loading.
		 * 
		 * @method addFont
		 * @param {Object} fnt - font data.
		 */
		addFont: function(fnt) {
			var font = new Font(fnt);
			this.fontByStyle[font.family + '_' + font.weight + '_' + font.style] = font;
			
			this.styleByPostscript[font.postscriptName] = {
				fontFamily: font.family, fontWeight: font.weight, fontStyle: font.style
			};
		},
		
		/**
		 * Get style key to access fonts by style.
		 * 
		 * @method getStyleKey
		 * @param {Object} style - font style.
		 * 
		 * @returns {String} font key.
		 */
		getStyleKey: function(style) {
			return style.fontFamily.toLowerCase() + '_' + style.fontWeight.toLowerCase() + '_' + style.fontStyle.toLowerCase();
		},
		
		/**
		 * Get working path to font file by style info.
		 * 
		 * @method getFileByStyle
		 * @param {Object} style - font style.
		 * 
		 * @returns {String} font filename.
		 */
		getFileByStyle: function(style) {
			var file = this.fileByStyle[ this.getStyleKey(style) ];
			if (file) return Main.baseDir + 'fonts/' + file; else return '';
		},
		
		/**
		 * Get font by style.
		 * 
		 * @method getFontByStyle
		 * @param {Object} style - font style.
		 * 
		 * @returns {Font} font reference.
		 */
		getFontByStyle: function(style) {
			var font = this.fontByStyle[ this.getStyleKey(style) ];
			
			if (!font) {
				var file = this.getFileByStyle(style);
				
				if (file == '') {
					style = { fontFamily: 'verdana', fontWeight: style.fontWeight, fontStyle: style.fontStyle };
					file = this.getFileByStyle(style);
				}
				
				this.load(file);
				font = this.fontByStyle[ this.getStyleKey(style) ];
			}
			
			return font;
		}
	};
	
	
//PROTOTYPE
	//configure
	FontsManager.setConfig([
	    { family: 'verdana', weight: 'normal', style: 'normal', postscript: 'verdana', file: 'verdana.js' },
	    { family: 'verdana', weight: 'normal', style: 'italic', postscript: 'verdana-italic', file: 'verdana italic.js' },
	    { family: 'verdana', weight: 'bold', style: 'normal', postscript: 'verdana-bold', file: 'verdana bold.js' },
	    { family: 'verdana', weight: 'bold', style: 'italic', postscript: 'verdana-bolditalic', file: 'verdana bold italic.js' },
	    
		{ family: 'arial black', weight: 'normal', style: 'normal', postscript: 'arial-black', file: 'arial black.js' },
		{ family: 'bembo bq', weight: 'normal', style: 'normal', postscript: 'bembobq-bold', file: 'bembo monotype bold.js' },
		{ family: 'arialmt', weight: 'normal', style: 'normal', postscript: 'arialmt', file: 'arialmt.js' },
		{ family: 'bembo mt semibold', weight: 'normal', style: 'normal', postscript: 'bembomt-semibold', file: 'bembo mt semibold.js' },
		{ family: 'oswald', weight: 'normal', style: 'normal', postscript: 'oswald-regular', file: 'oswald regular.js' },
		{ family: 'arial narrow', weight: 'bold', style: 'italic', postscript: 'arialnarrow-bolditalic', file: 'arial narrow bold italic.js' },
		{ family: 'calibri', weight: 'bold', style: 'italic', postscript: 'calibri-bolditalic', file: 'calibri bold italic.js' },
		{ family: 'arial narrow', weight: 'bold', style: 'normal', postscript: 'arialnarrow-bold', file: 'arial narrow bold.js' },
		{ family: 'calibri', weight: 'bold', style: 'normal', postscript: 'calibri-bold', file: 'calibri bold.js' },
		{ family: 'trebuchet ms', weight: 'normal', style: 'normal', postscript: 'trebuchetms', file: 'trebuchet ms.js' },
		{ family: 'arial narrow', weight: 'normal', style: 'italic', postscript: 'arialnarrow-italic', file: 'arial narrow italic.js' },
		{ family: 'calibri', weight: 'normal', style: 'italic', postscript: 'calibri-italic', file: 'calibri italic.js' },
		{ family: 'arial narrow', weight: 'normal', style: 'normal', postscript: 'arialnarrow', file: 'arial narrow.js' },
		{ family: 'calibri', weight: 'normal', style: 'normal', postscript: 'calibri', file: 'calibri.js' },
		{ family: 'arno pro', weight: 'bold', style: 'normal', postscript: 'arnopro-bold', file: 'arnopro-bold.js' },
		{ family: 'calibri light', weight: 'normal', style: 'italic', postscript: 'calibri-lightitalic', file: 'calibri light italic.js' },
		{ family: 'bembo', weight: 'bold', style: 'normal', postscript: 'bembo-bold', file: 'bembo bold.js' },
		{ family: 'calibri light', weight: 'normal', style: 'normal', postscript: 'calibri-light', file: 'calibri light.js' },
		{ family: 'bembo', weight: 'normal', style: 'italic', postscript: 'bembo-italic', file: 'bembo italic.js' },
		{ family: 'copper penny dtp', weight: 'normal', style: 'normal', postscript: 'copperpennydtpnormal', file: 'copper penny dtp normal.js' },
		{ family: 'impact mt', weight: 'normal', style: 'normal', postscript: 'impactmt', file: 'impact mt.js' }
	]);
	
	//set up for global use
	window.FontsManager = FontsManager;
}() );
