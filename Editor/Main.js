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
    var p = new Point(100, 100);
    var r = new Rectangle();
    r.placeAroundPoint(p, 30);
    
    var o = new Shaper('', r.toPolygon());
    stage.addObject(o);
    
    //horizontal gradient
    var fill = new Gradient();
    fill.addColorStop(0,'#ff0000');
    fill.addColorStop(1,'#0000ff');
    fill.addColorStop(0.5,'#00ff00');
    
    //var gr = fill.setup(o, stage.layer);
    //

    o.color.fill = fill;
}
