//GLOBALS
var stage = null;

//MAIN FUNCTION - ENTRY POINT
function main() {
	//remove onselectstart
	document.onselectstart = function() { return false; }
	
    //init stage
    stage = new Stage();
    
    //init transformer
    stage.trBox = new TrBox();
    
    //text test
    var t = new Text('TextForTest', 'Text and gradient sample', {size: '70px'});
    stage.addObject(t);
    t.move(45, 200);
    
    var tfill = new Gradient('linear');
    tfill.addColorStop(0,'#ff0000');
    tfill.addColorStop(0.5,'#00ff00');
    tfill.addColorStop(1,'#0000ff');
    t.color.fill = tfill;
    
    ColorChooser(1);
}
