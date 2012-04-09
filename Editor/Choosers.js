//CLIPART CHOOSER
var ClipChooser = function() {
	//init vars
	var selectedClip = null;
	
	//create categories selector
	var tstStr = "<p style='margin:4px'>Here I will use script, which fetches clipart files and categories.</p>";
	tstStr += "<p style='margin:4px'>The same idea is inside setting background of canvas.</p>";
	
	var catSelector = Dom.create('div', '', 'absolute', 5, 5, 200, 360, '', 'auto');
	Dom(catSelector).css({border: '1px solid', backgroundColor: '#fff'}).prop('innerHTML', tstStr);
	
    //create clipart list
    var imgList = Dom.create('div', '', 'absolute', 215, 5, 429, 360, '', 'auto');
    Dom(imgList).css({border: '1px solid', backgroundColor: '#fff'});
    
    var artArr = ['butterfly.png', 'colorpens.png', 'leave.png', 'technopolis.png', 
                  'bycicle.png', 'flower.png', 'snowman.png', 'tiger.png', 'cat.png', 
                  'heloween.png', 'sun.png'];
    
    for (var i = 0; i < artArr.length; i++) {
        var img = Dom.create('img', '', '', '', '', 175, 130);
        
        Dom(img).prop({
        	src: 'Editor/clipart/img/' + artArr[i],
        	onmouseover: function(e) {
        		Dom(e.target).css('borderColor', '#000');
        	},
        	onmouseout: function(e) {
        		if (e.target != selectedClip) Dom(e.target).css('borderColor', '#fff');
        	},
        	onclick: function(e) {
        		if (selectedClip) Dom(selectedClip).css('borderColor', '#fff');
        		selectedClip = e.target;
        	}
        }).css({margin: '5px', border: '1px solid #fff'}).addTo(imgList);
    }
    
    //setup window
    if (ClipChooser.imgListWnd) ClipChooser.imgListWnd.close();
    var imgListWnd = ClipChooser.imgListWnd = new DomWnd('Select image', 200, 60, 650, 400);
    
    //create buttons
    var selectBtn = Dom.create('button', '', 'absolute', 5, imgListWnd.getHeight() - 30, 100, 25);
    
    Dom(selectBtn).prop({
    	innerHTML: 'Select',
    	onclick: function(e) {
	    	if (!selectedClip) return;
	    	
	    	var im = new Bitmap("img", selectedClip.src, 200, 150);
	        stage.addObject(im);
	        im.move(stage.stageWidth / 2 - im.getWidth() / 2, stage.stageHeight / 2 - im.getHeight() / 2);
	        stage.trBox.apply(im);
	        
	        imgListWnd.close();
    	}
    });
    
    var cancelBtn = Dom.create('button', '', 'absolute', 110, imgListWnd.getHeight() - 30, 100, 25);
    
    Dom(cancelBtn).prop({
    	innerHTML: 'Cancel',
    	onclick: function(e) {
    		imgListWnd.close();
    	}
    });
    
    //add controls
    imgListWnd.addControl([catSelector, imgList, selectBtn, cancelBtn]);
}


//BACKGROUND CHOOSER
var BgrChooser = function() {
	//init vars
	var selectedClip = null;
	
	//create categories selector
	var tstStr = "<p style='margin:4px'>Here I will use script, which fetches clipart files and categories.</p>";
	tstStr += "<p style='margin:4px'>The same idea is inside setting background of canvas.</p>";
	
	var catSelector = Dom.create('div', '', 'absolute', 5, 5, 200, 360, '', 'auto');
	Dom(catSelector).css({border: '1px solid', backgroundColor: '#fff'}).prop('innerHTML', tstStr);
	
    //create clipart list
    var imgList = Dom.create('div', '', 'absolute', 215, 5, 429, 289, '', 'auto');
    Dom(imgList).css({border: '1px solid', backgroundColor: '#fff'});
    
    var artArr = ['butterfly.png', 'colorpens.png', 'leave.png', 'technopolis.png', 
                  'bycicle.png', 'flower.png', 'snowman.png', 'tiger.png', 'cat.png', 
                  'heloween.png', 'sun.png'];
    
    for (var i = 0; i < artArr.length; i++) {
        var img = Dom.create('img', '', '', '', '', 175, 130);
        
        Dom(img).prop({
        	src: 'Editor/clipart/img/' + artArr[i],
        	onmouseover: function(e) {
        		Dom(e.target).css('borderColor', '#000');
        	},
        	onmouseout: function(e) {
        		if (e.target != selectedClip) Dom(e.target).css('borderColor', '#fff');
        	},
        	onclick: function(e) {
        		if (selectedClip) Dom(selectedClip).css('borderColor', '#fff');
        		selectedClip = e.target;
        	}
        }).css({margin: '5px', border: '1px solid #fff'}).addTo(imgList);
    }
    
    //create color select
    var colorSelect = Dom.create('div', '', 'absolute', 215, 299, 420, 160);
    
    ColorPicker.attachSafePicker(1, colorSelect, function(e) {
    	Dom(stage.layer.canvas).css('backgroundColor', e.target.style.backgroundColor);
    }, 11);
    
    //setup window
    if (BgrChooser.imgListWnd) BgrChooser.imgListWnd.close();
    var imgListWnd = BgrChooser.imgListWnd = new DomWnd('Set background', 200, 60, 650, 400);
    
    //create buttons
    var selectBtn = Dom.create('button', '', 'absolute', 5, imgListWnd.getHeight() - 30, 100, 25);
    
    Dom(selectBtn).prop({
    	innerHTML: 'Select', 
    	onclick: function(e) {
	    	if (!selectedClip) {
	    		imgListWnd.close();
	    		return;
	    	}
	    	
	    	Dom(stage.layer.canvas).css({
	    		backgroundImage: 'url(' + selectedClip.src + ')',
	    		backgroundRepeat: 'no-repeat', 
	    		backgroundSize: '100% 100%'
	    	});
	        
	    	imgListWnd.close();
    	}
    });
    
    var cancelBtn = Dom.create('button', '', 'absolute', 110, imgListWnd.getHeight() - 30, 100, 25);
    
    Dom(cancelBtn).prop({
    	innerHTML: 'Cancel', 
    	onclick: function(e) {
    		imgListWnd.close();
    	}
    });
    
    //add controls
    imgListWnd.addControl([catSelector, imgList, colorSelect, selectBtn, cancelBtn]);
}


//COLOR CHOOSER
var ColorChooser = function(type) {
	//init vars
	var titleStr;
	if (type == 1) titleStr = "Change fill color"; else titleStr = "Change stroke color";
	
    //setup window
    if (ColorChooser.wnd) ColorChooser.wnd.close();
    var wnd = ColorChooser.wnd = new DomWnd(titleStr, 200, 60, 482, 330);
	
    //create combo box
    var combo = Dom.create('div', '', 'absolute', 5, 5);
    var selectBox = Dom.createComboBox(['None', 'Colors', 'Custom colors', 'Gradient']);
    
    Dom(selectBox).css('width', '256px').prop('onchange', function(e) {
    	clearWnd();
    	var v = e.target.value;
    	
    	switch (v) {
	    	case 'None':
	    		setColor(type, '');
	    	break;
	    	
	    	case 'Colors':
	    		wnd.addControl(colorSelect);
	        break;
	        	
	    	case 'Custom colors':
	    		wnd.addControl(picker);
	    	    
	    	    if (type == 1) ColorPicker.attach(setFillColor, stage.color.fill);
	    	    else ColorPicker.attach(setStrokeColor, stage.color.stroke);
	        break;
	        
	    	case 'Gradient':
	    		wnd.addControl(gradientEditor);
	        break;
    	}
    }).prop('value', 'Colors');
    
    combo.appendChild(selectBox);
    wnd.addControl(combo);
    
    //create color select
    var colorSelect = Dom.create('div', '', 'absolute', 5, 35);
    ColorPicker.attachSafePicker(0, colorSelect, function(e) {
    	setColor(type, e.target.style.backgroundColor);
    }, 21);
    
    wnd.addControl(colorSelect);
    
    //create picker
    var picker = ColorPicker.init("UI/ColorPicker/");
    Dom(picker).pos({x:0, y:30});
    
    //create gradient editor
    var gradientEditor = ColorPicker.initGradientEditor(5, 35, wnd.getWidth() - 10, wnd.getHeight() - 70);
    
    //create buttons
    var selectBtn = Dom.create('button', '', 'absolute', 5, wnd.getHeight() - 30, 100, 25);
    
    Dom(selectBtn).prop({
    	innerHTML: 'Ok',
    	onclick: function(e) {
    		wnd.close();
    	}
    });
    
    wnd.addControl(selectBtn);
    
    //INTERNAL FUNCTIONS
	//color set methods
	function setColor(type, c) {
		if (type == 1) setFillColor(c); else setStrokeColor(c);
	}
	
	function setStrokeColor(c) {
	    stage.color.stroke = c;
	    if (stage.trBox.selected) stage.trBox.selected.color.stroke = c;
	    stage.layer.forceRedraw();
	}

	function setFillColor(c) {
	    stage.color.fill = c;
	    if (stage.trBox.selected) stage.trBox.selected.color.fill = c;
	    stage.layer.forceRedraw();
	}
	
	//clear window method
	function clearWnd() {
		wnd.removeControl([picker, colorSelect, gradientEditor]);
	}
}


//TEXT EDITOR
var TextEditor = function(text) {
	//init vars
	var face = 'Arial', size = '18px';
	
	//create window
	if (TextEditor.wnd) TextEditor.wnd.close();
    var wnd = TextEditor.wnd = new DomWnd('Edit text', 200, 60, 700, 330);
	
	//create controls
    var combo = Dom.create('div', '', 'absolute', 5, 5);
    wnd.addControl(combo);
    
    //font select
    var fontBox = Dom.createComboBox(['Arial', 'Times New Roman', 'Courier', 'Verdana']);
    
    Dom(fontBox).width(150).prop('onchange', function(e) {
    	face = e.target.value;
    	Dom(textInput).css('fontFamily', face);
    }).prop('value', face).addTo(combo);
    
    //size select
    var szArr = [];
    for (var i = 8; i <= 196; i += 2) szArr.push(i + 'px');
    var sizeBox = Dom.createComboBox(szArr);
    
    Dom(sizeBox).width(70).css('marginLeft', '5px').prop('onchange', function(e) {
    	size = e.target.value;
    	Dom(textInput).css('fontSize', size);
    }).prop('value', size).addTo(combo);
    
	//create textinput
    var textInput = Dom.create('input', '', 'absolute', 5, 35, wnd.getWidth() - 14);
    
    Dom(textInput).prop('value', text).css({
    	border: 'none',
    	outline: 'none',
    	background: 'none',
    	fontFamily: face,
    	fontSize: size
    });
    
    //create buttons
    var selectBtn = Dom.create('button', '', 'absolute', 5, wnd.getHeight() - 30, 100, 25);
    
    Dom(selectBtn).prop({
    	innerHTML: 'Place', 
    	onclick: function(e) {
    		if (textInput.value == '') return;
    		
    		var t = new Text('text', textInput.value, {face: face, size: size});
    		stage.addObject(t);
	        t.move(stage.stageWidth / 2 - t.getWidth() / 2, stage.stageHeight / 2 - t.getHeight() / 2);
	        stage.trBox.apply(t);
	        
	        wnd.close();
    	}
    });
    
    var cancelBtn = Dom.create('button', '', 'absolute', 110, wnd.getHeight() - 30, 100, 25);
    
    Dom(cancelBtn).prop({
    	innerHTML: 'Cancel', 
    	onclick: function(e) {
    		wnd.close();
    	}
    });
    
    wnd.addControl([textInput, selectBtn, cancelBtn]);
}
