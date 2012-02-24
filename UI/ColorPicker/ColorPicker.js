var Colors = new function()
{
  this.ColorFromHSV = function(hue, sat, val)
  {
    var color = new Color();
    color.SetHSV(hue,sat,val);
    return color;
  }

  this.ColorFromRGB = function(r, g, b)
  {
    var color = new Color();
    color.SetRGB(r,g,b);
    return color;
  }

  this.ColorFromHex = function(hexStr)
  {
    var color = new Color();
    color.SetHexString(hexStr);
    return color;
  }

  function Color()
  {
    //Stored as values between 0 and 1
    var red = 0;
    var green = 0;
    var blue = 0;
   
    //Stored as values between 0 and 360
    var hue = 0;
   
    //Strored as values between 0 and 1
    var saturation = 0;
    var value = 0;
     
    this.SetRGB = function(r, g, b)
    {
      if (isNaN(r) || isNaN(g) || isNaN(b))
        return false;
        
      r = r/255.0;
      red = r > 1 ? 1 : r < 0 ? 0 : r;
      g = g/255.0;
      green = g > 1 ? 1 : g < 0 ? 0 : g;
      b = b/255.0;
      blue = b > 1 ? 1 : b < 0 ? 0 : b;
      
      calculateHSV();
      return true;
    }
   
    this.Red = function()
    {return Math.round(red*255);}
   
    this.Green = function()
    {return Math.round(green*255);}
   
    this.Blue = function()
    {return Math.round(blue*255);}
   
    this.SetHSV = function(h, s, v)
    {
      if (isNaN(h) || isNaN(s) || isNaN(v))
        return false;
        
      hue = (h >= 360) ? 359.99 : (h < 0) ? 0 : h;
      saturation = (s > 1) ? 1 : (s < 0) ? 0 : s;
      value = (v > 1) ? 1 : (v < 0) ? 0 : v;
      calculateRGB();
      return true;
    }
     
    this.Hue = function()
    {return hue;}
     
    this.Saturation = function()
    {return saturation;}
     
    this.Value = function()
    {return value;} 
     
    this.SetHexString = function(hexString)
    {
      if(hexString == null || typeof(hexString) != "string")
        return false;
       
      if (hexString.substr(0, 1) == '#')
        hexString = hexString.substr(1);
       
      if(hexString.length != 6)
        return false;
         
      var r = parseInt(hexString.substr(0, 2), 16);
      var g = parseInt(hexString.substr(2, 2), 16);
      var b = parseInt(hexString.substr(4, 2), 16);
      
      return this.SetRGB(r,g,b);
    }
     
    this.HexString = function()
    {
      var rStr = this.Red().toString(16);
      if (rStr.length == 1)
        rStr = '0' + rStr;
      var gStr = this.Green().toString(16);
      if (gStr.length == 1)
        gStr = '0' + gStr;
      var bStr = this.Blue().toString(16);
      if (bStr.length == 1)
        bStr = '0' + bStr;
      return ('#' + rStr + gStr + bStr).toUpperCase();
    }
   
    this.Complement = function()
    {
      var newHue = (hue>= 180) ? hue - 180 : hue + 180;
      var newVal = (value * (saturation - 1) + 1);
      var newSat = (value*saturation) / newVal;
      var newColor = new Color();
      newColor.SetHSV(newHue, newSat, newVal);
      return newColor;
    }
   
    function calculateHSV()
    {
      var max = Math.max(Math.max(red, green), blue);
      var min = Math.min(Math.min(red, green), blue);
     
      value = max;
     
      saturation = 0;
      if(max != 0)
        saturation = 1 - min/max;
       
      hue = 0;
      if(min == max)
        return;
     
      var delta = (max - min);
      if (red == max)
        hue = (green - blue) / delta;
      else if (green == max)
        hue = 2 + ((blue - red) / delta);
      else
        hue = 4 + ((red - green) / delta);
      hue = hue * 60;
      if(hue <0)
        hue += 360;
    }
   
    function calculateRGB()
    {
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
      switch(i)
      {
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
}
();

function Position(x, y)
{
  this.X = x;
  this.Y = y;
  
  this.Add = function(val)
  {
    var newPos = new Position(this.X, this.Y);
    if(val != null)
    {
      if(!isNaN(val.X))
        newPos.X += val.X;
      if(!isNaN(val.Y))
        newPos.Y += val.Y
    }
    return newPos;
  }
  
  this.Subtract = function(val)
  {
    var newPos = new Position(this.X, this.Y);
    if(val != null)
    {
      if(!isNaN(val.X))
        newPos.X -= val.X;
      if(!isNaN(val.Y))
        newPos.Y -= val.Y
    }
    return newPos;
  }
  
  this.Min = function(val)
  {
    var newPos = new Position(this.X, this.Y)
    if(val == null)
      return newPos;
    
    if(!isNaN(val.X) && this.X > val.X)
      newPos.X = val.X;
    if(!isNaN(val.Y) && this.Y > val.Y)
      newPos.Y = val.Y;
    
    return newPos;  
  }
  
  this.Max = function(val)
  {
    var newPos = new Position(this.X, this.Y)
    if(val == null)
      return newPos;
    
    if(!isNaN(val.X) && this.X < val.X)
      newPos.X = val.X;
    if(!isNaN(val.Y) && this.Y < val.Y)
      newPos.Y = val.Y;
    
    return newPos;  
  }  
  
  this.Bound = function(lower, upper)
  {
    var newPos = this.Max(lower);
    return newPos.Min(upper);
  }
  
  this.Check = function()
  {
    var newPos = new Position(this.X, this.Y);
    if(isNaN(newPos.X))
      newPos.X = 0;
    if(isNaN(newPos.Y))
      newPos.Y = 0;
    return newPos;
  }
  
  this.Apply = function(element)
  {
    if(typeof(element) == "string")
      element = document.getElementById(element);
    if(element == null)
      return;
    if(!isNaN(this.X))
      element.style.left = this.X + 'px';
    if(!isNaN(this.Y))
      element.style.top = this.Y + 'px';  
  }
}

var pointerOffset = new Position(0, navigator.userAgent.indexOf("Firefox") >= 0 ? 1 : 0);
var circleOffset = new Position(5, 5);
var arrowsOffset = new Position(0, 4);

var arrowsLowBounds = new Position(0, -4);
var arrowsUpBounds = new Position(0, 251);
var circleLowBounds = new Position(-5, -5);
var circleUpBounds = new Position(250, 250);

function correctOffset(pos, offset, neg)
{
  if(neg)
    return pos.Subtract(offset);
  return pos.Add(offset);
}

function hookEvent(element, eventName, callback)
{
  if(typeof(element) == "string")
    element = document.getElementById(element);
  if(element == null)
    return;
  if(element.addEventListener)
  {
    element.addEventListener(eventName, callback, false);
  }
  else if(element.attachEvent)
    element.attachEvent("on" + eventName, callback);
}

function unhookEvent(element, eventName, callback)
{
  if(typeof(element) == "string")
    element = document.getElementById(element);
  if(element == null)
    return;
  if(element.removeEventListener)
    element.removeEventListener(eventName, callback, false);
  else if(element.detachEvent)
    element.detachEvent("on" + eventName, callback);
}

function cancelEvent(e)
{
  e = e ? e : window.event;
  if(e.stopPropagation)
    e.stopPropagation();
  if(e.preventDefault)
    e.preventDefault();
  e.cancelBubble = true;
  e.cancel = true;
  e.returnValue = false;
  return false;
}

function getMousePos(eventObj)
{
  eventObj = eventObj ? eventObj : window.event;
  var pos;
  if(isNaN(eventObj.layerX))
    pos = new Position(eventObj.offsetX, eventObj.offsetY);
  else
    pos = new Position(eventObj.layerX, eventObj.layerY);
  return correctOffset(pos, pointerOffset, true);
}

function getEventTarget(e)
{
  e = e ? e : window.event;
  return e.target ? e.target : e.srcElement;
}

function absoluteCursorPostion(eventObj)
{
  eventObj = eventObj ? eventObj : window.event;
  
  if(isNaN(window.scrollX))
    return new Position(eventObj.clientX + document.documentElement.scrollLeft + document.body.scrollLeft, 
      eventObj.clientY + document.documentElement.scrollTop + document.body.scrollTop);
  else
    return new Position(eventObj.clientX + window.scrollX, eventObj.clientY + window.scrollY);
}

function dragObject(element, attachElement, lowerBound, upperBound, startCallback, moveCallback, endCallback, attachLater)
{
  if(typeof(element) == "string")
    element = document.getElementById(element);
  if(element == null)
      return;
  
  if(lowerBound != null && upperBound != null)
  {
    var temp = lowerBound.Min(upperBound);
    upperBound = lowerBound.Max(upperBound);
    lowerBound = temp;
  }

  var cursorStartPos = null;
  var elementStartPos = null;
  var dragging = false;
  var listening = false;
  var disposed = false;
  
  function dragStart(eventObj)
  { 
    if(dragging || !listening || disposed) return;
    dragging = true;
    
    if(startCallback != null)
      startCallback(eventObj, element);
    
    cursorStartPos = absoluteCursorPostion(eventObj);
    
    elementStartPos = new Position(parseInt(element.style.left), parseInt(element.style.top));
   
    elementStartPos = elementStartPos.Check();
    
    hookEvent(document, "mousemove", dragGo);
    hookEvent(document, "mouseup", dragStopHook);
    
    return cancelEvent(eventObj);
  }
  
  function dragGo(eventObj)
  {
    if(!dragging || disposed) return;
    
    var newPos = absoluteCursorPostion(eventObj);
    newPos = newPos.Add(elementStartPos).Subtract(cursorStartPos);
    newPos = newPos.Bound(lowerBound, upperBound)
    newPos.Apply(element);
    if(moveCallback != null)
      moveCallback(newPos, element);
        
    return cancelEvent(eventObj); 
  }
  
  function dragStopHook(eventObj)
  {
    dragStop();
    return cancelEvent(eventObj);
  }
  
  function dragStop()
  {
    if(!dragging || disposed) return;
    unhookEvent(document, "mousemove", dragGo);
    unhookEvent(document, "mouseup", dragStopHook);
    cursorStartPos = null;
    elementStartPos = null;
    if(endCallback != null)
      endCallback(element);
    dragging = false;
  }
  
  this.Dispose = function()
  {
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
  
  this.StartListening = function()
  {
    if(listening || disposed) return;
    listening = true;
    hookEvent(attachElement, "mousedown", dragStart);
  }
  
  this.StopListening = function(stopCurrentDragging)
  {
    if(!listening || disposed) return;
    unhookEvent(attachElement, "mousedown", dragStart);
    listening = false;
    
    if(stopCurrentDragging && dragging)
      dragStop();
  }
  
  this.IsDragging = function(){return dragging;}
  this.IsListening = function() {return listening;}
  this.IsDisposed = function() {return disposed;}
  
  if(typeof(attachElement) == "string")
    attachElement = document.getElementById(attachElement);
  if(attachElement == null)
    attachElement = element;
    
  if(!attachLater)
    this.StartListening();
}

function arrowsDown(e, arrows)
{
  var pos = getMousePos(e);
  
  if(getEventTarget(e) == arrows)
    pos.Y += parseInt(arrows.style.top);
  
  pos = correctOffset(pos, arrowsOffset, true);
  
  pos = pos.Bound(arrowsLowBounds, arrowsUpBounds);
  
  pos.Apply(arrows);
  
  arrowsMoved(pos);
}

function circleDown(e, circle)
{ 
  var pos = getMousePos(e);
  
  if(getEventTarget(e) == circle)
  {
    pos.X += parseInt(circle.style.left);
    pos.Y += parseInt(circle.style.top);
  }
  
  pos = correctOffset(pos, circleOffset, true);
  
  pos = pos.Bound(circleLowBounds, circleUpBounds);
  
  pos.Apply(circle);
    
  circleMoved(pos);
}

function arrowsMoved(pos, element)
{
  pos = correctOffset(pos, arrowsOffset, false);
  currentColor.SetHSV((256 - pos.Y)*359.99/255, currentColor.Saturation(), currentColor.Value());
  colorChanged("arrows");
}

function circleMoved(pos, element)
{
  pos = correctOffset(pos, circleOffset, false);
  currentColor.SetHSV(currentColor.Hue(), 1-pos.Y/255.0, pos.X/255.0);
  colorChanged("circle");
}

function colorChanged(source)
{
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
    
  if(source == "box")
  {
    var el = document.getElementById("arrows");
    el.style.top = (256 - currentColor.Hue()*255/359.99 - arrowsOffset.Y) + 'px';
    var pos = new Position(currentColor.Value()*255, (1-currentColor.Saturation())*255);
    pos = correctOffset(pos, circleOffset, true);
    pos.Apply("circle");
    endMovement();
  }
  
  document.getElementById("quickColor").style.backgroundColor = currentColor.HexString();
  
  //set color with attached method
  if (setColorMethod) setColorMethod(currentColor.HexString());
}

function endMovement()
{
  document.getElementById("staticColor").style.backgroundColor = currentColor.HexString();
}

function hexBoxChanged(e)
{
  currentColor.SetHexString(document.getElementById("hexBox").value);
  colorChanged("box");
}

function redBoxChanged(e)
{
  currentColor.SetRGB(parseInt(document.getElementById("redBox").value), currentColor.Green(), currentColor.Blue());
  colorChanged("box");
}

function greenBoxChanged(e)
{
  currentColor.SetRGB(currentColor.Red(), parseInt(document.getElementById("greenBox").value), currentColor.Blue());
  colorChanged("box");
}

function blueBoxChanged(e)
{
  currentColor.SetRGB(currentColor.Red(), currentColor.Green(), parseInt(document.getElementById("blueBox").value));
  colorChanged("box");
}

function hueBoxChanged(e)
{
  currentColor.SetHSV(parseFloat(document.getElementById("hueBox").value), currentColor.Saturation(), currentColor.Value());
  colorChanged("box");
}

function saturationBoxChanged(e)
{
  currentColor.SetHSV(currentColor.Hue(), parseFloat(document.getElementById("saturationBox").value)/100.0, currentColor.Value());
  colorChanged("box");
}

function valueBoxChanged(e)
{
  currentColor.SetHSV(currentColor.Hue(), currentColor.Saturation(), parseFloat(document.getElementById("valueBox").value)/100.0);
  colorChanged("box");
}

function fixPNG(myImage) 
{
  if(!document.body.filters)
    return;
  var arVersion = navigator.appVersion.split("MSIE");
  var version = parseFloat(arVersion[1]);
  if(version < 5.5 || version >= 7)
    return;

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

function fixGradientImg()
{
  fixPNG(document.getElementById("gradientImg"));
}

//interface of picker construct
function createElement(elem, id, position, x, y, width, height) {
    var el = document.createElement(elem);
    el.setAttribute("id", id);
    el.style.position = position;
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.width = width + "px";
    el.style.height = height + "px";
    return el;
}

function addColorDataRow(table, text, id, onchange) {
    //add tr
    var tr = document.createElement("tr");
    table.appendChild(tr);
    
    //add text td
    var td = document.createElement("td");
    td.innerHTML = text;
    tr.appendChild(td);
    
    //add input td
    var td2 = document.createElement("td");
    tr.appendChild(td2);
    
    var input = document.createElement("input");
    input.setAttribute("id", id);
    input.setAttribute("type", "text");
    input.setAttribute("size", "8");
    input.setAttribute("onchange", onchange);
    input.style.margin = "0.3em";
    input.style.fontFamily = "Verdana";
    input.style.fontSize = "12px";
    input.style.width = "75px";
    input.style.height = "12px";
    td2.appendChild(input);
}

//returns element with colorpicker, path is path to images
function initColorPicker(path) {
    //picker itself
    var picker = createElement("div", "", "relative", 0, 0, 482, 274);
    
    //gradient box
    var gradientBox = createElement("div", "gradientBox", "absolute", 5, 5, 256, 256);
    gradientBox.style.cursor = "crosshair";
    picker.appendChild(gradientBox);
    
    //gradient image
    var gradientImg = createElement("img", "gradientImg", "", 0, 0, 256, 256);
    gradientImg.setAttribute("src", path + "color_picker_gradient.png");
    gradientImg.style.display = "block";
    gradientBox.appendChild(gradientImg);

    //circle to select color
    var circle = createElement("img", "circle", "absolute", 0, 0, 11, 11);
    circle.setAttribute("src", path + "color_picker_circle.gif");
    gradientBox.appendChild(circle);

    //hue bar division
    var hueBarDiv = createElement("div", "hueBarDiv", "absolute", 270, 5, 35, 256);
    picker.appendChild(hueBarDiv);
    
    //color picker bar
    var colorPickerBar = createElement("img", "", "absolute", 8, 0, 19, 256);
    colorPickerBar.setAttribute("src", path + "color_picker_bar.png");
    hueBarDiv.appendChild(colorPickerBar);
    
    //arrows to select color
    var arrows = createElement("img", "arrows", "absolute", 0, 0, 35, 9);
    arrows.setAttribute("src", path + "color_picker_arrows.gif");
    hueBarDiv.appendChild(arrows);
    
    //table and colorview container
    var tableContainer = createElement("div", "", "absolute", 315, 5, 145, 256);
    picker.appendChild(tableContainer);
    
    //colorview
    var colorview = createElement("div", "", "absolute", 3, 0, 120, 30);
    colorview.style.border = "1px solid black";
    tableContainer.appendChild(colorview);
    
    //quick color
    var quickColor = createElement("div", "quickColor", "absolute", 0, 0, 60, 30);
    colorview.appendChild(quickColor);

    //static color
    var staticColor = createElement("div", "staticColor", "absolute", 60, 0, 60, 30);
    colorview.appendChild(staticColor);
    
    //table with color values
    var table = document.createElement("table");
    table.setAttribute("width", "100%");
    table.setAttribute("cellspacing", "0");
    table.setAttribute("cellspadding", "0");
    table.style.position = "absolute";
    table.style.height = "240px";
    table.style.top = "30px";
    table.style.fontFamily = "Verdana";
    table.style.fontSize = "12px";
    tableContainer.appendChild(table);
    
    //add table rows
    addColorDataRow(table, "Hex: ", "hexBox", "hexBoxChanged();");
    
    addColorDataRow(table, "Red: ", "redBox", "redBoxChanged();");
    addColorDataRow(table, "Green: ", "greenBox", "greenBoxChanged();");
    addColorDataRow(table, "Blue: ", "blueBox", "blueBoxChanged();");

    addColorDataRow(table, "Hue: ", "hueBox", "hueBoxChanged();");
    addColorDataRow(table, "Saturation: ", "saturationBox", "saturationBoxChanged();");
    addColorDataRow(table, "Value: ", "valueBox", "valueBoxChanged();");
    
    //return picker
    return picker;
}

//now attach color picker to method with will change color property as needed
var setColorMethod = null;
function attachColorPicker(method, initialColor) {
    setColorMethod = method;
    fixGradientImg();
    
    currentColor = Colors.ColorFromHex(initialColor);
    new dragObject("arrows", "hueBarDiv", arrowsLowBounds, arrowsUpBounds, arrowsDown, arrowsMoved, endMovement);
    new dragObject("circle", "gradientBox", circleLowBounds, circleUpBounds, circleDown, circleMoved, endMovement);
    colorChanged('box');
}
