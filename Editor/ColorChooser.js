//CLIPART CHOOSER
var ColorChooser = function(type) {
	//color set methods
	function setColor(type, c) {
		if (type == 1) setFillColor(c); else setStrokeColor(c);
	}
	
	function setStrokeColor(c) {
	    stage.selectedStroke = c;
	    if (stage.selectedObject) stage.selectedObject.color.stroke = c;
	    stage.layer.forceRedraw();
	}

	function setFillColor(c) {
	    stage.selectedFill = c;
	    if (stage.selectedObject) stage.selectedObject.color.fill = c;
	    stage.layer.forceRedraw();
	}
	
	//init vars
	var titleStr;
	if (type == 1) titleStr = "Change fill color"; else titleStr = "Change stroke color";
	
    //setup window
    if (ColorChooser.wnd) ColorChooser.wnd.close();
    var wnd = ColorChooser.wnd = new DomWnd(titleStr, 5, 5, 482, 330);
	
    //create combo box
    var combo = Dom.create('div', '', 'absolute', 5, 5);
    var selectBox = Dom.createComboBox(['None', 'Colors', 'Custom colors']);
    
    Dom(selectBox).css('width', '256px').prop('onchange', function(e) {
    	var v = e.target.value;
    	
    	if (v == 'None') {
    		setColor(type, '');
    	} else if (v == 'Colors') {
    		wnd.removeControl(picker);
    		wnd.addControl(colorSelect);
    	} else if (v == 'Custom colors') {
    		wnd.removeControl(colorSelect);
    	    wnd.addControl(picker);
    	    
    	    if (type == 1) attachColorPicker(setFillColor, stage.selectedFill);
    	    else attachColorPicker(setStrokeColor, stage.selectedStroke);
    	}
    }).prop('value', 'Colors');
    
    combo.appendChild(selectBox);
    wnd.addControl(combo);
    
    //create color select
    var colorSelect = Dom.create('div', '', 'absolute', 5, 35);
    buildSafePalette(0, colorSelect, function(e) {
    	setColor(type, e.target.style.backgroundColor);
    }, 21);
    
    wnd.addControl(colorSelect);
    
    //create picker
    var picker = initColorPicker("UI/ColorPicker/");
    Dom(picker).placeTo({x:0, y:30});
    
    //create buttons
    var selectBtn = Dom.create('button', '', 'absolute', 5, wnd.getHeight() - 30, 100, 25);
    
    Dom(selectBtn).prop({
    	innerHTML: 'Ok',
    	onclick: function(e) {
    		wnd.close();
    	}
    });
    
    wnd.addControl(selectBtn);
}
