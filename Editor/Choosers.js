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
	    	stage.history.push(stage.layer.dumpObjects());
	    	
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
	var titleStr = "Change stroke color", grFn = setStrokeColor;
	
    if (type == 1) {
    	titleStr = "Change fill color";
    	grFn = setFillColor;
    }
	
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
	    		var chColor = stage.color.stroke;
	    		if (type == 1) chColor = stage.color.fill;
	    		
	    		wnd.addControl(picker);
	    	    ColorPicker.attach(grFn, chColor);
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
    var gradientEditor = ColorPicker.initGradientEditor(5, 35, wnd.getWidth() - 10, wnd.getHeight() - 70, grFn);
    
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
var TextEditor = function(textObj) {
	//init vars
	var isNew = 1, text = '', face = 'Arial', size = '42px', weight = 'normal', style = 'normal';
	
	if (textObj && textObj.text) {
		isNew = 0;
		text = textObj.text;
		face = textObj.font.face;
		size = textObj.font.size;
		weight = textObj.font.weight;
		style = textObj.font.style;
	}
	
	//create window
	if (TextEditor.wnd) TextEditor.wnd.close();
    var wnd = TextEditor.wnd = new DomWnd('Edit text', 200, 60, 700, 330);
	
	//create controls
    var combo = Dom.create('div', '', 'absolute', 5, 5);
    wnd.addControl(combo);
    
    //font select
    var fontBox = Dom.createComboBox([
          'Arial',
          'Comic Sans MS',
          'Courier',
          'Garamond',
          'Georgia',
          'Impact',
          'Palatino Linotype',
          'Symbol',
          'Times New Roman',
          'Verdana'
    ]);
    
    Dom(fontBox).width(150).prop('onchange', function(e) {
    	face = e.target.value;
    	Dom(textInput).css('fontFamily', face);
    }).prop('value', face).addTo(combo);
    
    //size select
    var szArr = [];
    for (var i = 8; i <= 198; i += 2) szArr.push(i + 'px');
    
    var sizeBox = Dom.createComboBox(szArr);
    
    Dom(sizeBox).width(70).css('marginLeft', '5px').prop('onchange', function(e) {
    	size = e.target.value;
    	Dom(textInput).css('fontSize', size);
    }).prop('value', size).addTo(combo);
    
    //bold and italic buttons
    var boldBtn = Dom.create('button');
    
    Dom(boldBtn).css({
    	marginLeft: '5px',
    	height: '24px',
    	fontFamily: 'Verdana',
    	fontWeight: 'bold'
    }).prop({
    	innerHTML: 'B',
    	onclick: function(e) {
    		weight = textInput.style.fontWeight;
    		
    		Dom(boldBtn).css('fontWeight', weight);
    		if (weight == 'bold') weight = 'normal'; else weight = 'bold';
    		
    		Dom(textInput).css('fontWeight', weight);
    	}
    }).addTo(combo);
    
    var italicBtn = Dom.create('button');
    
    Dom(italicBtn).css({
    	marginLeft: '3px',
    	height: '24px',
    	fontFamily: 'Verdana',
    	fontStyle: 'italic'
    }).prop({
    	innerHTML: 'I',
    	onclick: function(e) {
    		style = textInput.style.fontStyle;
    		
    		Dom(italicBtn).css('fontStyle', style);
    		if (style == 'italic') style = 'normal'; else style = 'italic';
    		
    		Dom(textInput).css('fontStyle', style);
    	}
    }).addTo(combo);
    
	//create textinput
    var textCont = Dom.create('div', '', 'absolute', 5, 35, wnd.getWidth() - 12, wnd.getHeight() - 70);
    
    Dom(textCont).css({
    	border: '1px solid',
    	background: "url('Editor/img/canv_bg.png')",
    	cursor: 'text'
    }).prop({
    	onclick: function(e) {
    		textInput.focus();
    	}
    });
    
    var textInput = Dom.create('input', '', '', '', '', wnd.getWidth() - 12);
    
    Dom(textInput).prop('value', text).css({
    	border: 'none',
    	outline: 'none',
    	background: 'none',
    	fontFamily: face,
    	fontSize: size,
    	fontWeight: weight,
    	fontStyle: style
    }).addTo(textCont);
    
    //create buttons
    var selectBtn = Dom.create('button', '', 'absolute', 5, wnd.getHeight() - 30, 100, 25);
    
    Dom(selectBtn).prop({
    	innerHTML: 'Place', 
    	onclick: function(e) {
    		if (textInput.value == '') return;
    		stage.history.push(stage.layer.dumpObjects());
    		
    		if (isNew) {
	    		var t = new Text('text', textInput.value, { face: face, size: size, weight: weight, style: style });
	    		stage.addObject(t);
		        t.move(stage.stageWidth / 2 - t.getWidth() / 2, stage.stageHeight / 2 - t.getHeight() / 2);
		        stage.trBox.apply(t);
    		} else {
    			textObj.setText(textInput.value);
    			textObj.setFont({ face: face, size: size, weight: weight, style: style });
    			stage.layer.forceRedraw();
    			stage.trBox.updateRects();
    		}
		    
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
    
    wnd.addControl([textCont, selectBtn, cancelBtn]);
}
