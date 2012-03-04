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
        img = Dom.create('img', '', '', '', '', 175, 130);
        
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
        }).css({margin: '5px', border: '1px solid #fff'});
        
        imgList.appendChild(img);
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
	    	
	    	var im = new Bitmap("img", selectedClip.src, 150, 150);
	        stage.addObject(im);
	        im.move(stage.stageWidth / 2 - im.getWidth() / 2, stage.stageHeight / 2 - im.getHeight() / 2);
	        
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
    imgListWnd.addControl(catSelector);
    imgListWnd.addControl(imgList);
    imgListWnd.addControl(selectBtn);
    imgListWnd.addControl(cancelBtn);
}
