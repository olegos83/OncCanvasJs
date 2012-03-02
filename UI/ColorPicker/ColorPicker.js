//COLOR OBJECT 
function Color() {
    //Stored as values between 0 and 1
    var red = 0;
    var green = 0;
    var blue = 0;
   
    //Stored as values between 0 and 360
    var hue = 0;
   
    //Strored as values between 0 and 1
    var saturation = 0;
    var value = 0;
     
this.SetRGB = function(r, g, b) {
  if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
    
  r = r/255.0;
  red = r > 1 ? 1 : r < 0 ? 0 : r;
  
  g = g/255.0;
  green = g > 1 ? 1 : g < 0 ? 0 : g;
  
  b = b/255.0;
  blue = b > 1 ? 1 : b < 0 ? 0 : b;
  
  calculateHSV();
  return true;
}
   
this.Red = function() {
	return Math.round(red*255);
}
   
this.Green = function() {
	return Math.round(green*255);
}
   
this.Blue = function() {
	return Math.round(blue*255);
}
   
this.SetHSV = function(h, s, v) {
  if (isNaN(h) || isNaN(s) || isNaN(v)) return false;
    
  hue = (h >= 360) ? 359.99 : (h < 0) ? 0 : h;
  saturation = (s > 1) ? 1 : (s < 0) ? 0 : s;
  value = (v > 1) ? 1 : (v < 0) ? 0 : v;
  
  calculateRGB();
  return true;
}
     
this.Hue = function() {
	return hue;
}
     
this.Saturation = function() {
	return saturation;
}
     
this.Value = function() {
	return value;
} 
     
this.SetHexString = function(hexString) {
  if(hexString == null || typeof(hexString) != "string") return false;
  if (hexString.substr(0, 1) == '#') hexString = hexString.substr(1);
  if(hexString.length != 6) return false;
     
  var r = parseInt(hexString.substr(0, 2), 16);
  var g = parseInt(hexString.substr(2, 2), 16);
  var b = parseInt(hexString.substr(4, 2), 16);
  
  return this.SetRGB(r,g,b);
}
 
this.HexString = function() {
  var rStr = this.Red().toString(16);
  if (rStr.length == 1) rStr = '0' + rStr;
  
  var gStr = this.Green().toString(16);
  if (gStr.length == 1) gStr = '0' + gStr;
  
  var bStr = this.Blue().toString(16);
  if (bStr.length == 1) bStr = '0' + bStr;
  
  return ('#' + rStr + gStr + bStr).toUpperCase();
}
   
function calculateHSV() {
  var max = Math.max(Math.max(red, green), blue);
  var min = Math.min(Math.min(red, green), blue);
 
  value = max;
  saturation = 0;
  if(max != 0) saturation = 1 - min/max;
   
  hue = 0;
  if(min == max) return;
 
  var delta = (max - min);
  if (red == max) hue = (green - blue) / delta;
  else if (green == max) hue = 2 + ((blue - red) / delta); else hue = 4 + ((red - green) / delta);
  
  hue = hue * 60;
  if(hue <0) hue += 360;
}
   
function calculateRGB() {
  red = value;
  green = value;
  blue = value;
 
  if(value == 0 || saturation == 0)
    return;
 
  var tHue = (hue / 60);
  var i = Math.floor(tHue);
  var f = tHue - i;
  var p = value * (1 - saturation);
  var q = value * (1 - saturation * f);
  var t = value * (1 - saturation * (1 - f));
  switch(i) {
    case 0:
      red = value;green = t;blue = p;
    break;
    
    case 1:
      red = q;green = value;blue = p;
    break;
    
    case 2:
      red = p;green = value;blue = t;
    break;
    
    case 3:
      red = p;green = q;blue = value;
    break;
    
    case 4:
      red = t;green = p;blue = value;
    break;
    
    default:
      red = value;green = p;blue = q;
    break;
  }
}

}

//COLORS
var Colors = new function() {
  this.ColorFromHSV = function(hue, sat, val) {
    var color = new Color();
    color.SetHSV(hue,sat,val);
    return color;
  }

  this.ColorFromRGB = function(r, g, b) {
    var color = new Color();
    color.SetRGB(r,g,b);
    return color;
  }

  this.ColorFromHex = function(hexStr) {
    var color = new Color();
    color.SetHexString(hexStr);
    return color;
  }
}


//OFFSETS OF COLORPICKER ELEMENTS
var circleOffset = new Point(5, 5);
var arrowsOffset = new Point(0, 4);

var arrowsLowBounds = new Point(0, -4);
var arrowsUpBounds = new Point(0, 251);
var circleLowBounds = new Point(-5, -5);
var circleUpBounds = new Point(250, 250);


//EVENTS
function getMousePos(eventObj) {
  eventObj = eventObj ? eventObj : window.event;
  if (eventObj.layerX) return new Point(eventObj.layerX, eventObj.layerY);
  else return new Point(eventObj.offsetX, eventObj.offsetY);
}

function absoluteCursorPostion(eventObj) {
  eventObj = eventObj ? eventObj : window.event;
  
  if(isNaN(window.scrollX))
    return new Point(eventObj.clientX + document.documentElement.scrollLeft + document.body.scrollLeft, 
    				 eventObj.clientY + document.documentElement.scrollTop + document.body.scrollTop);
  else
    return new Point(eventObj.clientX + window.scrollX, eventObj.clientY + window.scrollY);
}

//DRAG
function dragObject(element, attachElement, lowerBound, upperBound, startCallback, moveCallback, endCallback, attachLater) {
  if(typeof(element) == "string") element = document.getElementById(element);

  var cursorStartPos = null;
  var elementStartPos = null;
  var dragging = false;
  var listening = false;
  var disposed = false;
  
  function dragStart(eventObj) { 
    if (dragging || !listening || disposed) return;
    dragging = true;
    
    if(startCallback != null) startCallback(eventObj, element);
    
    cursorStartPos = absoluteCursorPostion(eventObj);
    elementStartPos = new Point(parseInt(element.style.left), parseInt(element.style.top));
    
    Dom(document).addEvent(MouseEvent.MOVE, dragGo).addEvent(MouseEvent.UP, dragStopHook);
    return Dom.cancelEvent(eventObj);
  }
  
  function dragGo(eventObj) {
    if (!dragging || disposed) return;
    
    var newPos = absoluteCursorPostion(eventObj);
    newPos.move(elementStartPos.x, elementStartPos.y);
    newPos.move(-cursorStartPos.x, -cursorStartPos.y);
    newPos.checkBounds(lowerBound, upperBound);
    Dom(element).placeTo(newPos);
    
    if(moveCallback != null) moveCallback(newPos, element);
    return Dom.cancelEvent(eventObj); 
  }
  
  function dragStopHook(eventObj) {
    dragStop();
    return Dom.cancelEvent(eventObj);
  }
  
  function dragStop() {
    if(!dragging || disposed) return;
    Dom(document).removeEvent(MouseEvent.MOVE, dragGo).removeEvent(MouseEvent.UP, dragStopHook);
    cursorStartPos = null;
    elementStartPos = null;
    if(endCallback != null) endCallback(element);
    dragging = false;
  }
  
  this.Dispose = function() {
    if(disposed) return;
    this.StopListening(true);
    element = null;
    attachElement = null
    lowerBound = null;
    upperBound = null;
    startCallback = null;
    moveCallback = null
    endCallback = null;
    disposed = true;
  }
  
  this.StartListening = function() {
    if(listening || disposed) return;
    listening = true;
    Dom(attachElement).addEvent(MouseEvent.DOWN, dragStart);
  }
  
  this.StopListening = function(stopCurrentDragging) {
    if(!listening || disposed) return;
    Dom(attachElement).removeEvent(MouseEvent.DOWN, dragStart);
    listening = false;
    if(stopCurrentDragging && dragging) dragStop();
  }
  
  this.IsDragging = function(){return dragging;}
  this.IsListening = function() {return listening;}
  this.IsDisposed = function() {return disposed;}
  
  if(typeof(attachElement) == "string") attachElement = document.getElementById(attachElement);
  if(attachElement == null) attachElement = element;
  if(!attachLater) this.StartListening();
}


//COLORPICKER
function arrowsDown(e, arrows) {
  var pos = getMousePos(e);
  if(Dom.getEventTarget(e) == arrows) pos.y += parseInt(arrows.style.top);
  
  pos.move(-arrowsOffset.x, -arrowsOffset.y);
  pos.checkBounds(arrowsLowBounds, arrowsUpBounds);
  Dom(arrows).placeTo(pos);
  
  arrowsMoved(pos);
}

function circleDown(e, circle) {
  var pos = getMousePos(e);
  
  if(Dom.getEventTarget(e) == circle) {
    pos.x += parseInt(circle.style.left);
    pos.y += parseInt(circle.style.top);
  }
  
  pos.move(-circleOffset.x, -circleOffset.y);
  pos.checkBounds(circleLowBounds, circleUpBounds);
  Dom(circle).placeTo(pos);
    
  circleMoved(pos);
}

function arrowsMoved(pos, element) {
  pos.move(arrowsOffset.x, arrowsOffset.y);
  currentColor.SetHSV((256 - pos.y) * 359.99 / 255, currentColor.Saturation(), currentColor.Value());
  colorChanged("arrows");
}

function circleMoved(pos, element) {
	pos.move(circleOffset.x, circleOffset.y);
  currentColor.SetHSV(currentColor.Hue(), 1 - pos.y / 255.0, pos.x / 255.0);
  colorChanged("circle");
}

function colorChanged(source) {
  document.getElementById("hexBox").value = currentColor.HexString();
  document.getElementById("redBox").value = currentColor.Red();
  document.getElementById("greenBox").value = currentColor.Green();
  document.getElementById("blueBox").value = currentColor.Blue();
  document.getElementById("hueBox").value = Math.round(currentColor.Hue());
  var str = (currentColor.Saturation()*100).toString();
  if(str.length > 4)
    str = str.substr(0,4);
  document.getElementById("saturationBox").value = str;
  str = (currentColor.Value()*100).toString();
  if(str.length > 4)
    str = str.substr(0,4);
  document.getElementById("valueBox").value = str;
  
  if(source == "arrows" || source == "box")
    document.getElementById("gradientBox").style.backgroundColor = Colors.ColorFromHSV(currentColor.Hue(), 1, 1).HexString();
    
  if(source == "box") {
    var el = document.getElementById("arrows");
    el.style.top = (256 - currentColor.Hue()*255/359.99 - arrowsOffset.y) + 'px';
    
    var pos = new Point(currentColor.Value()*255, (1-currentColor.Saturation())*255);
    pos.move(-circleOffset.x, -circleOffset.y);
    
    Dom("circle").placeTo(pos); 
    endMovement();
  }
  
  document.getElementById("quickColor").style.backgroundColor = currentColor.HexString();
  
  //set color with attached method
  if (setColorMethod) setColorMethod(currentColor.HexString());
}

function endMovement() {
  document.getElementById("staticColor").style.backgroundColor = currentColor.HexString();
}

function hexBoxChanged(e) {
  currentColor.SetHexString(document.getElementById("hexBox").value);
  colorChanged("box");
}

function redBoxChanged(e) {
  currentColor.SetRGB(parseInt(document.getElementById("redBox").value), currentColor.Green(), currentColor.Blue());
  colorChanged("box");
}

function greenBoxChanged(e) {
  currentColor.SetRGB(currentColor.Red(), parseInt(document.getElementById("greenBox").value), currentColor.Blue());
  colorChanged("box");
}

function blueBoxChanged(e) {
  currentColor.SetRGB(currentColor.Red(), currentColor.Green(), parseInt(document.getElementById("blueBox").value));
  colorChanged("box");
}

function hueBoxChanged(e) {
  currentColor.SetHSV(parseFloat(document.getElementById("hueBox").value), currentColor.Saturation(), currentColor.Value());
  colorChanged("box");
}

function saturationBoxChanged(e) {
  currentColor.SetHSV(currentColor.Hue(), parseFloat(document.getElementById("saturationBox").value)/100.0, currentColor.Value());
  colorChanged("box");
}

function valueBoxChanged(e) {
  currentColor.SetHSV(currentColor.Hue(), currentColor.Saturation(), parseFloat(document.getElementById("valueBox").value)/100.0);
  colorChanged("box");
}

function fixPNG(myImage) {
  if(!document.body.filters) return;
  var arVersion = navigator.appVersion.split("MSIE");
  var version = parseFloat(arVersion[1]);
  if(version < 5.5 || version >= 7) return;

  var imgID = (myImage.id) ? "id='" + myImage.id + "' " : ""
  var imgStyle = "display:inline-block;" + myImage.style.cssText
  var strNewHTML = "<span " + imgID 
              + " style=\"" + "width:" + myImage.width 
              + "px; height:" + myImage.height 
              + "px;" + imgStyle + ";"
              + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
              + "(src=\'" + myImage.src + "\', sizingMethod='scale');\"></span>"
  myImage.outerHTML = strNewHTML
}

function fixGradientImg() {
  fixPNG(document.getElementById("gradientImg"));
}

//returns element with colorpicker, path is path to images
function initColorPicker(path) {
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
    addColorDataRow(table, "Hex: ", "hexBox", "hexBoxChanged()");
    addColorDataRow(table, "Red: ", "redBox", "redBoxChanged()");
    addColorDataRow(table, "Green: ", "greenBox", "greenBoxChanged()");
    addColorDataRow(table, "Blue: ", "blueBox", "blueBoxChanged()");
    addColorDataRow(table, "Hue: ", "hueBox", "hueBoxChanged()");
    addColorDataRow(table, "Saturation: ", "saturationBox", "saturationBoxChanged()");
    addColorDataRow(table, "Value: ", "valueBox", "valueBoxChanged()");
    
    //return picker
    return picker;
}

//now attach color picker to method with will change color property as needed
var setColorMethod = null;
function attachColorPicker(method, initialColor) {
    setColorMethod = method;
    fixGradientImg();
    
    if (initialColor == '') initialColor = '#ffffff';
    if (initialColor.charAt(0) == '#') {
    	currentColor = Colors.ColorFromHex(initialColor);
    } else {
    	var c = initialColor.split('(')[1].split(',');
    	currentColor = Colors.ColorFromRGB(c[0], c[1], parseInt(c[2]));
    }
    
    new dragObject("arrows", "hueBarDiv", arrowsLowBounds, arrowsUpBounds, arrowsDown, arrowsMoved, endMovement);
    new dragObject("circle", "gradientBox", circleLowBounds, circleUpBounds, circleDown, circleMoved, endMovement);
    colorChanged('box');
}

//SAFE COLOR PALETTE
function numberToCssColor(n) {
	var tmp = n.toString(16);
	var len = 6 - tmp.length;
	
	if (len > 0) {
		var a = '';
		for (var i = 0; i < len; i++) a += '0';
		tmp = '#' + a + tmp;
	} else {
		tmp = '#' + tmp;
	}
	
	return tmp;
}

function buildSafePalette(type, el, selFn, sz) {
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
	
	var wd = sz || 16; var ht = sz || 16;
	var x = 0; var y = 0; var i = 0; var j = 0;
	var d; var it; var it2; var clr;
	
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
		clr = numberToCssColor(lineColors[i]);			
		drawItem(x, y, clr, el, selFn);	
	}
	
	if (type == 1) for (i = 0; i < it; i++) {
		x = wd; y = i * ht;
		clr = numberToCssColor(lineColors[i + 6]);
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
			
			clr = numberToCssColor((Math.floor(x / 6) * 51) << 16 | (x % 6 * 51) << 8 | y * 51);				
			x = j * wd; y = i * ht;
			
			drawItem(x + d, y, clr, el, selFn);
		}
	}
}
