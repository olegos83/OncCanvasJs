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
			
			Dom(dv).css({
				border: '1px solid',
				backgroundColor: c,
				cursor: 'pointer'
			}).prop({
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
	 },
	 
	 /**
      * Init gradient editor.
      **/
	 initGradientEditor: function(x, y, width, height) {
		 //init vars
		 var grRot = 0; var grScale = 1; var grType = 'linear';
		 
		 //init gradients
		 var gradientArr = [
			['#a9f4dd', '#b03c26', '#c47e1c'],
			['#635da9', '#47fac9', '#18d3f4'],
			['#0a680b', '#f9cdad', '#e72269'],
			['#65519c', '#de51cf', '#7685f5'],
			['#659734', '#380ae8', '#5d673d'],
			['#cdd790', '#029bfb', '#c6460e'],
			['#23b75f', '#5b6b2d', '#43d38b'],
			['#39cd10', '#eeb8df', '#b1e257'],
			['#c1a61f', '#0bd5cd', '#94c7d5'],
			['#314025', '#fa0767', '#a42eb8'],
			['#3c6d02', '#22f53d', '#5da848'],
			['#9ab742', '#997fbe', '#73740d'],
			['#590dec', '#dd6128', '#7188a1'],
			['#18b51e', '#d5721e', '#dbd162'],
			['#279d0d', '#8dab3c', '#1ebacf'],
			['#0ef5a8', '#786bce', '#788059'],
			['#0d25cf', '#99761f', '#2509d0'],
			['#4ab054', '#677aaa', '#c20ba4'],
			['#ca18d5', '#c1283a', '#a1cc91'],
			['#1d346a', '#35a828', '#7c728e'],
			['#d4455f', '#b15007', '#3f0045'],
			['#475937', '#2229d4', '#f39124'],
			['#e02fe4', '#901af9', '#01edaa'],
			['#e9ce30', '#85b74d', '#944e2e'],
			['#8a727b', '#5ea30f', '#433f4c'],
			['#949dbd', '#ef3890', '#4d1903'],
			['#bf7c27', '#4bd780', '#546f48'],
			['#5fb053', '#3f3ee7', '#2aee69'],
			['#ec97c3', '#30c85e', '#b546d4'],
			['#29dffe', '#ae3933', '#c71b55'],
			['#7678ee', '#979911', '#131fba'],
			['#248d3e', '#92c7eb', '#e44259'],
			['#da4c18', '#ecdfa2', '#425f3d'],
			['#640773', '#cd50dd', '#68834e'],
			['#d60ebf', '#1437ba', '#a19cf1'],
			['#326422', '#752ddb', '#066940'],
			['#a61cc0', '#ad8a16', '#8edc07'],
			['#1b2159', '#fc351b', '#497bae'],
			['#ea57cc', '#dc91ea', '#6399b2'],
			['#31a2e0', '#4159a1', '#5ecb00'],
			['#d12552', '#40c2a8', '#6afa69'],
			['#97ca10', '#f2f050', '#ab69f7'],
			['#9d5662', '#139a33', '#d49b33'],
			['#64a4f9', '#6b2aad', '#a87cef'],
			['#a32464', '#33178e', '#b5d02e'],
			['#aba35f', '#3a07fb', '#114cdd'],
			['#a4588b', '#1dcd49', '#fcbc72'],
			['#eb35d8', '#917db6', '#55b3e8'],
			['#27c335', '#b18d51', '#bb0b7a'],
			['#c5eadf', '#de9261', '#b83883'],
			['#5aea52', '#a99e54', '#61d23b'],
			['#7acf44', '#e5c56a', '#f9e104'],
			['#d6527e', '#df77d0', '#afe909'],
			['#128aa4', '#bc988d', '#5597f1'],
			['#c7f6d3', '#29c4b1', '#1d2906'],
			['#1a914c', '#5e90b4', '#43f8d8'],
			['#2da3ec', '#d95c04', '#a6016a'],
			['#f3dd80', '#e666a1', '#7934db'],
			['#0d47d2', '#723db9', '#d79d92'],
			['#6935de', '#373dd6', '#7a49dc'],
			['#d7e577', '#8a7aca', '#2a76bf'],
			['#ac0045', '#a74124', '#bc797f'],
			['#9a8aa3', '#235335', '#04a615'],
			['#aa3f94', '#4017ae', '#dced91'],
			['#cccdc3', '#8c50b5', '#f4f6dc'],
			['#b19317', '#a51ce0', '#6384d0'],
			['#0efa17', '#da5931', '#a7486a'],
			['#5384c7', '#7b7922', '#e278b5'],
			['#4b0840', '#4faae0', '#c1322a'],
			['#f4056d', '#e2218d', '#45d74e'],
			['#36f032', '#3a5c58', '#aee2fb'],
			['#dd4ebb', '#1102be', '#49899b'],
			['#25c451', '#84b5eb', '#a4f9f7'],
			['#affc63', '#5aed49', '#43375c'],
			['#e777e2', '#21c8f3', '#29c1e1'],
			['#d35772', '#688db4', '#4120a5'],
			['#e75663', '#0f5171', '#b75887'],
			['#55937e', '#a8ebda', '#dd05dc'],
			['#61150c', '#ae3255', '#3902b4'],
			['#1bbb23', '#beb121', '#40240a'],
			['#4a3d89', '#2d614b', '#93ef05'],
			['#6bd36d', '#fee656', '#944d55'],
			['#3868a8', '#50ea68', '#70778b'],
			['#9fae64', '#3180f9', '#97e214'],
			['#cfd939', '#f94689', '#1646dd'],
			['#3ac5bf', '#a32347', '#e00ad0'],
			['#dbf510', '#87f475', '#2b00e8'],
			['#0dacdd', '#581797', '#1261e8'],
			['#1a0f74', '#51aa77', '#599c9e'],
			['#8aa068', '#4b5a98', '#0a763b'],
			['#8fe550', '#fc7df4', '#75988d'],
			['#0e5e5f', '#7e6487', '#9019e8'],
			['#17f22c', '#e99135', '#89a7f9'],
			['#de460f', '#b2cc25', '#71eb53'],
			['#fd7438', '#663828', '#db1f8b'],
			['#85f437', '#2c27cb', '#c537e0'],
			['#ced0c6', '#688784', '#2fef52'],
			['#e33c20', '#45b780', '#b530e3'],
			['#877a46', '#3e9a2a', '#a2e7a1'],
			['#6c95b2', '#042cde', '#181b86'],
			['#a7e96e', '#1bfdcb', '#76dcd5'],
			['#2eb774', '#7daa92', '#2d83d9'],
			['#53ddcf', '#ef4cdb', '#14fd09'],
			['#03dc55', '#806076', '#1d1573'],
			['#fc7747', '#73f4f3', '#5f7e3a'],
			['#61edcf', '#d15c6a', '#fc3777'],
			['#e3a1ee', '#e6d048', '#f78968'],
			['#bb15ea', '#e53a72', '#06b207'],
			['#e7066d', '#ec2063', '#4c0fc5'],
			['#68c0f2', '#a8fb58', '#2c991c'],
			['#154ffa', '#3aed95', '#d20e14'],
			['#85bc50', '#8168e9', '#890e2a'],
			['#1ec80b', '#cfb18a', '#2440aa'],
			['#e74761', '#e153c2', '#dc4fa6'],
			['#0b7efb', '#fa3012', '#a620ba'],
			['#1e3dea', '#a3ec6d', '#019824'],
			['#7de85d', '#8e90b7', '#0a8ec5'],
			['#99eb16', '#67ba9c', '#922b98'],
			['#0a7b76', '#252a3b', '#6f2312'],
			['#99d89e', '#40c0ad', '#aeeeb7']
		 ], numGradients = gradientArr.length;
		 
		 for (var i = 0; i < numGradients; i++) {
			 var gr = new Gradient();
			 
			 gr.addColorStop(0, gradientArr[i][0]);
			 gr.addColorStop(0.5, gradientArr[i][1]);
			 gr.addColorStop(1, gradientArr[i][2]);
			 
			 gradientArr[i][3] = gr;
		 }
		 
		 //fill presets method
		 function fillPresets(num, sz) {
			 var cy = sz / 2;
			 presets.innerHTML = '';
			 
			 for (var i = 0; i < num; i++) {
				 var cv = Dom.create('canvas', i.toString(), '', '', '', sz, sz);
				 Dom(cv).css({
					 border: '1px solid',
					 marginLeft: '2px',
					 marginTop: '2px',
					 cursor: 'pointer'
				 }).prop({
					 width:sz,
					 height:sz,
					 onmouseover: function(e) {
						 Dom(e.target).css('borderColor', '#fff');
					 },
					 onmouseout: function(e) {
						 Dom(e.target).css('borderColor', '#000');
					 },
					 onclick: function(e) {
						 var ctx = gradBox.getContext('2d');
						 var gr = gradientArr[e.target.id][3];
						 
						 gr.type('linear'); gr.rotation = 0; gr.scale = 1;
						 ctx.fillStyle = gr.toCanvasGradient(ctx, new Point(0, 0), new Point(gradBox.width, 0));
						 ctx.fillRect(0, 0, gradBox.width, gradBox.height);
					 }
				 }).addTo(presets);
				 
				 var gr = gradientArr[i][3];
				 gr.type(grType); gr.rotation = grRot; gr.scale = grScale;
				 
				 var ctx = cv.getContext("2d");
				 ctx.fillStyle = gr.toCanvasGradient(ctx, new Point(0, cy), new Point(sz, cy));
				 ctx.fillRect(0, 0, sz, sz);
			 }
		 }
		 
		 //create gradient editor main container
		 var gradEditor = Dom.create('div', '', 'absolute', x, y, width, height);
		 
		 //create presets container
		 var presets = Dom.create('div', '', 'absolute', 0, 0, width - 2, height - 67, '', 'auto');
		 Dom(presets).css('border', '1px solid').addTo(gradEditor);
		 
		 //create gradient canvases
		 fillPresets(numGradients, 40);
		 
		 //create scale set
		 var scaleSet = Dom.create('div', '', 'absolute', 127, height - 58);
		 Dom(scaleSet).prop('innerHTML', 'Scale: ').addTo(gradEditor);
		 
		 var lelftScBtn = Dom.create('button');
		 
		 Dom(lelftScBtn).css({
			 width: '16px',
			 height: '16px',
			 padding: '0',
			 lineHeight: '10px'
		 }).prop({ 
			 innerHTML: '<',
			 onclick: function(e) {
				 grScale -= 0.1;
				 if (grScale < 0.1) grScale = 0.1;
				 Dom(scInput).prop('value', grScale.toFixed(1));
				 fillPresets(numGradients, 40);
			 }
		 }).addTo(scaleSet);
		 
		 var scInput = Dom.create('input', '', '', '', '', 40);
		 
		 Dom(scInput).css({
			 margin: '0 3px',
			 fontFamily: 'Verdana',
			 textAlign: 'center'
		 }).prop('value', grScale.toFixed(1)).addTo(scaleSet);
		 
		 var rightScBtn = Dom.create('button');
		 
		 Dom(rightScBtn).css({
			 width: '16px',
			 height: '16px',
			 padding: '0',
			 lineHeight: '10px'
		 }).prop({ 
			 innerHTML: '>',
			 onclick: function(e) {
				 grScale += 0.1;
				 Dom(scInput).prop('value', grScale.toFixed(1));
				 fillPresets(numGradients, 40);
			 }
		 }).addTo(scaleSet);
		 
		 //create rotation set
		 var rotationSet = Dom.create('div', '', 'absolute', 261, height - 58);
		 Dom(rotationSet).prop('innerHTML', 'Rotation: ').addTo(gradEditor);
		 
		 var lelftRotBtn = Dom.create('button');
		 
		 Dom(lelftRotBtn).css({
			 width: '16px',
			 height: '16px',
			 padding: '0',
			 lineHeight: '10px'
		 }).prop({
			 innerHTML: '<',
			 onclick: function(e) {
				 grRot -= 0.1;
				 Dom(rotInput).prop('value', grRot.toFixed(1));
				 fillPresets(numGradients, 40);
			 }
		 }).addTo(rotationSet);
		 
		 var rotInput = Dom.create('input', '', '', '', '', 40);
		 
		 Dom(rotInput).css({
			 margin: '0 3px',
			 fontFamily: 'Verdana',
			 textAlign: 'center'
		 }).prop('value', grRot.toFixed(1)).addTo(rotationSet);
		 
		 var rightRotBtn = Dom.create('button');
		 
		 Dom(rightRotBtn).css({
			 width: '16px',
			 height: '16px',
			 padding: '0',
			 lineHeight: '10px'
		 }).prop({
			 innerHTML: '>',
			 onclick: function(e) {
				 grRot += 0.1;
				 Dom(rotInput).prop('value', grRot.toFixed(1));
				 fillPresets(numGradients, 40);
			 }
		 }).addTo(rotationSet);
		 
		 //create type set
		 var typeSet = Dom.create('div', '', 'absolute', 0, height - 60);
		 Dom(typeSet).prop('innerHTML', 'Type: ').addTo(gradEditor);
		 
		 var typeCombo = Dom.createComboBox(['linear', 'radial']);
		 Dom(typeCombo).width(75).prop({
			 onchange: function(e) {
				 grType = typeCombo.value;
				 fillPresets(numGradients, 40);
			 }
		 }).addTo(typeSet);
		 
		 //create gradient editor sliders box
		 var gradBox = Dom.create('canvas', '', 'absolute', 155, height - 25, 250, 40);
		 Dom(gradBox).css('background', 'white').addTo(gradEditor);
		 
		 //return editor container as element
		 return gradEditor;
	 }
} 
