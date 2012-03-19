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
    var gr = stage.layer.ctx.createLinearGradient(70, 0, 130, 0);
    
    //Add the color stops.
    gr.addColorStop(0,'#ff0000');
    gr.addColorStop(1,'#0000ff');
    gr.addColorStop(0.5,'#00ff00');
    o.color.fill = gr;
    console.log(o.color);
    
    var o2 = {};
    o2[0.005] = 10;
    console.log(o2, o2[0.005]);
}
