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
    
    
    //gradient test
    /*var p = new Point(300, 200);
    var r = new Rectangle();
    r.placeAroundPoint(p, 150);
    
    var o = new Shaper('', r.toPolygon());
    stage.addObject(o);
    
    //horizontal gradient
    var fill = new Gradient('radial');
    fill.addColorStop(0,'#ff0000');
    fill.addColorStop(0.2,'#ffccc0');
    fill.addColorStop(1,'#0000ff');
    fill.addColorStop(0.5,'#00ff00');
    fill.addColorStop(0.8,'#23abcf');
    
    fill.scale = 1.6;
    //fill.rotation = -0.5;
    o.color.fill = o.color.stroke = fill;*/
    
    //text test
    var t = new Text('TextForTest', 'Text and gradient sample', {size: '70px'});
    stage.addObject(t);
    t.move(45, 200);
    
    var tfill = new Gradient('linear');
    tfill.addColorStop(0,'#ff0000');
    tfill.addColorStop(0.5,'#00ff00');
    tfill.addColorStop(1,'#0000ff');
    t.color.fill = tfill;
}
