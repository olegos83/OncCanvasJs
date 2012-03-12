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
    
    
    //tests
    /*var p = new Point(100, 100);
    var r = new Rectangle();
    r.placeAroundPoint(p, 30);
    
    var o = new Shaper('', r);
    stage.addObject(o);*/
}
