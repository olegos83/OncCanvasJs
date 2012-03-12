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
    gr.addColorStop(0,'rgb(255,0,0)');
    gr.addColorStop(.5,'rgb(0,255,0)');
    gr.addColorStop(1,'rgb(0,0,255)');
    o.color.fill = gr;
    console.log(o.color);
}
