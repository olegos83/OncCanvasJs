/*
* ColorPicker by OlegoS. Mar 16, 2012
*
* Copyright (c) 2012 OlegoS
*
* See license information in readme file.
*/

/**
* OncCanvasJs is a framework to work with html5 canvas. It can be used to write
* games or any other web-applications, which use canvas graphics.
* @module OncCanvasJs
**/


/**
 * ColorPicker implementation. Support RGB and HSV values.
 * 
 * @class ColorPicker
 * @static
 * @author OlegoS
 *
 * @constructor
**/
var ColorPicker = {
//private properties:
	/**
     * Circle and arrow offsets.
     **/
    offset: {
    	circle: new Point(5, 5), 
    	arrows: new Point(0, 4)
    },
    
    /**
     * Circle and arrow bounds.
     **/
     bounds: {
    	circle: new Rectangle(new Point(-5, -5), new Point(250, 250)), 
    	arrows: new Rectangle(new Point(0, -4), new Point(0, 251))
     },
     
     /**
      * Selected color.
      **/
     color: null,
     
     /**
      * Set color method, called when color changes.
      **/
     setColor: null,
     
//private methods:
     /**
      * Mouse down handlers.
      **/
     arrowsDown: function(e, arrows) {
		var pos = Dom.getEventMousePos(e);
		if(Dom.getEventTarget(e) == arrows) pos.y += parseInt(arrows.style.top);
		
		var offset = ColorPicker.offset.arrows;
		pos.move(-offset.x, -offset.y);
		pos.checkBounds(ColorPicker.bounds.arrows);
		Dom(arrows).pos(pos);
		  
		ColorPicker.arrowsMoved(pos);
     },
     
     circleDown: function(e, circle) {
		var pos = Dom.getEventMousePos(e);
		  
		if(Dom.getEventTarget(e) == circle) {
		  pos.x += parseInt(circle.style.left);
		  pos.y += parseInt(circle.style.top);
		}
		
		var offset = ColorPicker.offset.circle;
		pos.move(-offset.x, -offset.y);
		pos.checkBounds(ColorPicker.bounds.circle);
		Dom(circle).pos(pos);
		  
		ColorPicker.circleMoved(pos);
     },
     
     /**
      * Mouse move handlers.
      **/
     arrowsMoved: function(pos, element) {
    	var offset = ColorPicker.offset.arrows;
		pos.move(offset.x, offset.y);
		
		var hsv = ColorPicker.color.HSV();
		ColorPicker.color.HSV((256 - pos.y) * 359.99 / 255, hsv.s, hsv.v);
		ColorPicker.colorChanged("arrows");
     },

     circleMoved: function(pos, element) {
    	var offset = ColorPicker.offset.circle;
		pos.move(offset.x, offset.y);
		
		ColorPicker.color.HSV(ColorPicker.color.HSV().h, 1 - pos.y / 255.0, pos.x / 255.0);
		ColorPicker.colorChanged("circle");
     },
     
     /**
      * End movement handler.
      **/
     endMovement: function() {
		Dom('staticColor').css('backgroundColor', ColorPicker.color.HEX());
     },
     
     /**
      * Color changer.
      **/
     colorChanged: function (source) {
		var hsv = ColorPicker.color.HSV();
		var rgb = ColorPicker.color.RGB();
		var hex = ColorPicker.color.HEX();
		
		Dom('hexBox').prop('value', hex);
		Dom('redBox').prop('value', rgb.r);
		Dom('greenBox').prop('value', rgb.g);
		Dom('blueBox').prop('value', rgb.b);
		Dom('hueBox').prop('value', Math.round(hsv.h));
		
		var str = (hsv.s * 100).toString();
		if(str.length > 4) str = str.substr(0,4);
		Dom('saturationBox').prop('value', str);
	  
		str = (hsv.v * 100).toString();
		if(str.length > 4) str = str.substr(0,4);
		Dom('valueBox').prop('value', str);
		
		if(source == "arrows" || source == "box")
			Dom('gradientBox').css('backgroundColor', new Color('HSV', {h: hsv.h, s: 1, v: 1}).HEX());
		
		if(source == "box") {
			Dom('arrows').css('top', (256 - hsv.h * 255 / 359.99 - ColorPicker.offset.arrows.y) + 'px');
			
			var pos = new Point(hsv.v * 255, (1 - hsv.s) * 255);
			var offset = ColorPicker.offset.circle;
			pos.move(-offset.x, -offset.y);
			
			Dom('circle').pos(pos);
			ColorPicker.endMovement();
		}
		
		Dom('quickColor').css('backgroundColor', hex);
	  
		//set color with attached method
		if (ColorPicker.setColor) ColorPicker.setColor(hex);
     },
     
     /**
      * Color text inputs changers.
      **/
     hexBoxChanged: function(e) {
    	ColorPicker.color.HEX(document.getElementById("hexBox").value);
		ColorPicker.colorChanged("box");
	 },

	 redBoxChanged: function(e) {
		var rgb = ColorPicker.color.RGB();
		ColorPicker.color.RGB(parseInt(document.getElementById("redBox").value), rgb.g, rgb.b);
		ColorPicker.colorChanged("box");
	 },

	 greenBoxChanged: function(e) {
		var rgb = ColorPicker.color.RGB();
		ColorPicker.color.RGB(rgb.r, parseInt(document.getElementById("greenBox").value), rgb.b);
		ColorPicker.colorChanged("box");
	 },

	 blueBoxChanged: function(e) {
		var rgb = ColorPicker.color.RGB();
		ColorPicker.color.RGB(rgb.r, rgb.g, parseInt(document.getElementById("blueBox").value));
		ColorPicker.colorChanged("box");
	 },

	 hueBoxChanged: function(e) {
		var hsv = ColorPicker.color.HSV();
		ColorPicker.color.HSV(parseFloat(document.getElementById("hueBox").value), hsv.s, hsv.v);
		ColorPicker.colorChanged("box");
	 },

	 saturationBoxChanged: function(e) {
		var hsv = ColorPicker.color.HSV();
		ColorPicker.color.HSV(hsv.h, parseFloat(document.getElementById("saturationBox").value) / 100.0, hsv.v);
		ColorPicker.colorChanged("box");
	 },

	 valueBoxChanged: function(e) {
		var hsv = ColorPicker.color.HSV();
		ColorPicker.color.HSV(hsv.h, hsv.s, parseFloat(document.getElementById("valueBox").value) / 100.0);
		ColorPicker.colorChanged("box");
	 },
	 
	 /**
      * Fix png image gradient image for IE.
      **/
	 fixPNG: function(myImage) {
		if(!document.body.filters) return;
		var arVersion = navigator.appVersion.split("MSIE");
		var version = parseFloat(arVersion[1]);
		if(version < 5.5 || version >= 7) return;
	
		var imgID = (myImage.id) ? "id='" + myImage.id + "' " : "";
		var imgStyle = "display:inline-block;" + myImage.style.cssText;
		  
		var strNewHTML = "<span " + imgID + " style=\"" + "width:" + myImage.width + "px; height:" + myImage.height + 
		            	 "px;" + imgStyle + ";" + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader" +
		              	 "(src=\'" + myImage.src + "\', sizingMethod='scale');\"></span>";
		  
		myImage.outerHTML = strNewHTML;
	 },

	 /**
      * Create picker interface.
      **/
	 init: function(path) {
		//add table row
		function addColorDataRow(table, text, id, onchange) {
		    //add tr
		    var tr = Dom.create("tr");
		    table.appendChild(tr);
		    
		    //add text td
		    var td = Dom.create("td");
		    Dom(td).prop('innerHTML', text);
		    tr.appendChild(td);
		    
		    //add input td
		    var td2 = Dom.create("td");
		    tr.appendChild(td2);
		    
		    var input = Dom.create("input", id, '', '', '', 75, 12);
		    Dom(input).attr({ type: "text", size: "8", onchange: onchange}).css({margin: '0.3em', fontFamily: 'Verdana', fontSize: '12px'});
		    td2.appendChild(input);
		}
		
	    //picker itself
	    var picker = Dom.create("div", "", "relative", 0, 0, 482, 274);
	    
	    //gradient box
	    var gradientBox = Dom.create("div", "gradientBox", "absolute", 5, 5, 256, 256);
	    Dom(gradientBox).css('cursor', 'crosshair');
	    picker.appendChild(gradientBox);
	    
	    //gradient image
	    var gradientImg = Dom.create("img", "gradientImg", "", 0, 0, 256, 256, 'block');
	    Dom(gradientImg).prop("src", path + "color_picker_gradient.png");
	    gradientBox.appendChild(gradientImg);

	    //circle to select color
	    var circle = Dom.create("img", "circle", "absolute", 0, 0, 11, 11);
	    Dom(circle).prop("src", path + "color_picker_circle.gif");
	    gradientBox.appendChild(circle);

	    //hue bar division
	    var hueBarDiv = Dom.create("div", "hueBarDiv", "absolute", 270, 5, 35, 256);
	    picker.appendChild(hueBarDiv);
	    
	    //color picker bar
	    var colorPickerBar = Dom.create("img", "", "absolute", 8, 0, 19, 256);
	    Dom(colorPickerBar).prop("src", path + "color_picker_bar.png");
	    hueBarDiv.appendChild(colorPickerBar);
	    
	    //arrows to select color
	    var arrows = Dom.create("img", "arrows", "absolute", 0, 0, 35, 9);
	    Dom(arrows).prop("src", path + "color_picker_arrows.gif");
	    hueBarDiv.appendChild(arrows);
	    
	    //table and colorview container
	    var tableContainer = Dom.create("div", "", "absolute", 315, 5, 145, 256);
	    picker.appendChild(tableContainer);
	    
	    //colorview
	    var colorview = Dom.create("div", "", "absolute", 3, 0, 120, 30);
	    Dom(colorview).css('border', '1px solid black');
	    tableContainer.appendChild(colorview);
	    
	    //quick color
	    var quickColor = Dom.create("div", "quickColor", "absolute", 0, 0, 60, 30);
	    colorview.appendChild(quickColor);

	    //static color
	    var staticColor = Dom.create("div", "staticColor", "absolute", 60, 0, 60, 30);
	    colorview.appendChild(staticColor);
	    
	    //table with color values
	    var table = Dom.create('table', '', 'absolute', '', 30, '', 240);
	    Dom(table).attr({width: "100%", cellspacing: "0", cellspadding: "0"}).css({fontFamily: 'Verdana', fontSize: '12px'});
	    tableContainer.appendChild(table);
	    
	    //add table rows
	    addColorDataRow(table, "Hex: ", "hexBox", "ColorPicker.hexBoxChanged()");
	    addColorDataRow(table, "Red: ", "redBox", "ColorPicker.redBoxChanged()");
	    addColorDataRow(table, "Green: ", "greenBox", "ColorPicker.greenBoxChanged()");
	    addColorDataRow(table, "Blue: ", "blueBox", "ColorPicker.blueBoxChanged()");
	    addColorDataRow(table, "Hue: ", "hueBox", "ColorPicker.hueBoxChanged()");
	    addColorDataRow(table, "Saturation: ", "saturationBox", "ColorPicker.saturationBoxChanged()");
	    addColorDataRow(table, "Value: ", "valueBox", "ColorPicker.valueBoxChanged()");
	    
	    //return picker
	    return picker;
	 },
	 
	 /**
      * Attach picker to method with initial color.
      **/
	 attach: function(method, initialColor) {
		ColorPicker.setColor = method;
		ColorPicker.fixPNG(document.getElementById("gradientImg"));
	    
	    if (initialColor == '') initialColor = '#ffffff';
	    if (initialColor.charAt(0) == '#') {
	    	ColorPicker.color = new Color('HEX', initialColor);
	    } else {
	    	var c = initialColor.split('(')[1].split(',');
	    	ColorPicker.color = new Color('RGB', {r: c[0], g: c[1], b: parseInt(c[2])});
	    }
	    
	    Dom('arrows').startDrag('hueBarDiv', ColorPicker.bounds.arrows, ColorPicker.arrowsDown, ColorPicker.arrowsMoved, ColorPicker.endMovement);
	    Dom('circle').startDrag('gradientBox', ColorPicker.bounds.circle, ColorPicker.circleDown, ColorPicker.circleMoved, ColorPicker.endMovement);
	    
	    ColorPicker.colorChanged('box');
	 },

	 /**
      * Setup web safe picker.
      **/
	 attachSafePicker: function(type, el, selFn, sz) {
		//init params and vars
		var wd = sz || 16; var ht = sz || 16;
		var x = 0; var y = 0; var i = 0; var j = 0;
		var d = 0; var it = 0; var it2 = 0; var clr = 0;
		
		//init drwItem function
		function drawItem(x, y, c, el, selFn) {
			var dv = Dom.create('div', '', 'absolute', x, y, ht, wd);
			Dom(dv).css({border: '1px solid', backgroundColor: c, cursor: 'pointer'});
			
			Dom(dv).prop({
							onmouseover: function(e) {
								Dom(e.target).css({borderColor: '#fff', zIndex: '20000'});
							},
							onmouseout: function(e) {
								Dom(e.target).css({borderColor: '#000', zIndex: ''});
							}
						 });
			
			if (selFn) Dom(dv).prop('onclick', selFn);
			el.appendChild(dv);
		}
		
		//init vars
		var lineColors = [0x000000, 0x333333, 0x666666, 0x999999, 0xCCCCCC, 0xFFFFFF, 
		                  0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0x00FFFF, 0xFF00FF];
		
		
		//init type dependencies
		switch (type) {
			case 0:
				d = 2 * wd; it = 12; it2 = 18;
			break;
			
			case 1:
				d = 3 * wd; it = 6; it2 = 36;
			break;
		}
		
		//draw items
		for (i = 0; i < it; i++) {
			y = i * ht;
			clr = Color.numToCss(lineColors[i]);			
			drawItem(x, y, clr, el, selFn);	
		}
		
		if (type == 1) for (i = 0; i < it; i++) {
			x = wd; y = i * ht;
			clr = Color.numToCss(lineColors[i + 6]);
			drawItem(x, y, clr, el, selFn);
		}
		
		for (i = 0; i < it; i++) {
			if (type == 0) x = wd; else x = 2 * wd; 
			y = i * ht;
			clr = '#000';	
			drawItem(x, y, clr, el, selFn);
		}		
		
		for (i = 0; i < it; i++) {
			for (j = 0; j < it2; j++) {
				switch (type) {
					case 0:
						if (i > 5) {
							x = j + 18; y = i - 6;
						} else {
							x = j; y = i;
						}
					break;
					
					case 1:
						x = j; y = i;
					break;
			    }
				
				clr = Color.numToCss((Math.floor(x / 6) * 51) << 16 | (x % 6 * 51) << 8 | y * 51);				
				x = j * wd; y = i * ht;
				
				drawItem(x + d, y, clr, el, selFn);
			}
		}
	 }
} 
