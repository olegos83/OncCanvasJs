//CLIPART CHOOSER
var BgrChooser = function() {
	//init vars
	var selectedClip = null;
	
	//create categories selector
	var tstStr = "<p style='margin:4px'>Here I will use script, which fetches clipart files and categories.</p>";
	tstStr += "<p style='margin:4px'>The same idea is inside setting background of canvas.</p>";
	
	var catSelector = Dom().create('div', '', 'absolute', 5, 5, 200, 360, '', 'auto');
	Dom(catSelector).css('border', '1px solid').css('backgroundColor', '#fff').prop('innerHTML', tstStr);
	
    //create clipart list
    var imgList = Dom().create('div', '', 'absolute', 215, 5, 429, 289, '', 'auto');
    Dom(imgList).css('border', '1px solid').css('backgroundColor', '#fff');
    
    var artArr = ['butterfly.png', 'colorpens.png', 'leave.png', 'technopolis.png', 
                  'bycicle.png', 'flower.png', 'snowman.png', 'tiger.png', 'cat.png', 
                  'heloween.png', 'sun.png'];
    
    for (var i = 0; i < artArr.length; i++) {
        img = Dom().create('img', '', '', '', '', 175, 130);
        
        Dom(img).prop('src', 'Editor/clipart/img/' + artArr[i]).css('margin', '5px').css('border', '1px solid #fff').prop('onmouseover', function(e) {
        	Dom(e.target).css('borderColor', '#000');
        }).prop('onmouseout', function(e) {
        	if (e.target != selectedClip) Dom(e.target).css('borderColor', '#fff');
        }).prop('onclick', function(e) {
        	if (selectedClip) Dom(selectedClip).css('borderColor', '#fff');
        	selectedClip = e.target;
        });
        
        imgList.appendChild(img);
    }
    
    //create color select
    var colorSelect = Dom().create('div', '', 'absolute', 215, 299, 420, 160);
    buildSafePalette(1, colorSelect, function(e) {
    	Dom(stage.layer.canvas).css('backgroundColor', e.target.style.backgroundColor);
    }, 11);
    
    //setup window
    if (BgrChooser.imgListWnd) BgrChooser.imgListWnd.close();
    var imgListWnd = BgrChooser.imgListWnd = new DomWnd('Set background', 200, 60, 650, 400);
    
    //create buttons
    var selectBtn = Dom().create('button', '', 'absolute', 5, imgListWnd.getHeight() - 30, 100, 25);
    Dom(selectBtn).prop('innerHTML', 'Select').prop('onclick', function(e) {
    	if (!selectedClip) {
    		imgListWnd.close();
    		return;
    	}
    	
    	Dom(stage.layer.canvas).css('backgroundImage', 'url(' + selectedClip.src + ')').
    	css('backgroundRepeat', 'no-repeat').css('backgroundSize', '100% 100%');
        imgListWnd.close();
    });
    
    var cancelBtn = Dom().create('button', '', 'absolute', 110, imgListWnd.getHeight() - 30, 100, 25);
    Dom(cancelBtn).prop('innerHTML', 'Cancel').prop('onclick', function(e) {
        imgListWnd.close();
    });
    
    //add controls
    imgListWnd.addControl(catSelector);
    imgListWnd.addControl(imgList);
    imgListWnd.addControl(colorSelect);
    imgListWnd.addControl(selectBtn);
    imgListWnd.addControl(cancelBtn);
}
