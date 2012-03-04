/* 
 * Stage class
 */

//STAGE CLASS
//constructor and initialization
var Stage = function() {
    //init properties
	this.color = {stroke:'#000000', fill:'#FFFFFF'};

    //state of stage
    this.state = '';

    //init main layer
    this.layer = new Layer("edit_area");
    this.layer.setFps(24);
    this.stageWidth = this.layer.canvas.width;
    this.stageHeight = this.layer.canvas.height;
    this.trBox = null;
    
    //set canvas events
    var events = {};
    events[MouseEvent.DOWN] = this.stageMouseDown;
    events[MouseEvent.MOVE] = this.stageMouseMove;
    events[MouseEvent.UP] = events[MouseEvent.OUT] = this.stageMouseUp;
    Dom(this.layer.canvas).addEvents(events);
}

//add object to stage, set its base events and push it to objects array
Stage.prototype.addObject = function(obj) {
    //add to stage
    obj.zoom = 0; //add zoom property
    stage.layer.addObject(obj);
    
    //add events
    //obj.draggable();
    obj.addEventListener('mousedown', function(e) {
        stage.color.stroke = e.target.color.stroke;
        stage.color.fill = e.target.color.fill;
        stage.trBox.apply(e.target);
    });
}

//remove object and its events
Stage.prototype.removeObject = function(obj) {
    stage.layer.removeObject(obj);
}

//clear all objects and reset stage
Stage.prototype.clear = function() {
    this.state = '';
    this.trBox.unset();
    this.layer.clear();
}

//stage mouse down
Stage.prototype.stageMouseDown = function(e) {
    //console.log('stage mouseDown', stage.state);
    var mx = e.pageX - stage.layer.canvas.offsetLeft;
    var my = e.pageY - stage.layer.canvas.offsetTop;
	
    //new rectangle
    if (stage.state == 'newRect') {
        var r = new Rectangle(new Point(mx, my), new Point(mx + 1, my + 1)).toPolygon();
        stage.newObj = new Shaper("newRect", r, {stroke:stage.color.stroke, fill:stage.color.fill});
        stage.addObject(stage.newObj);
        
        stage.start_x = mx;
        stage.start_y = my;
        stage.state = 'drawing';
        
    //new arrow
    } else if (stage.state == 'newArrow') {
        var r = createArrow();
        r.move(mx, my);
        stage.newObj = new Shaper("newArrow", r, {stroke:stage.color.stroke, fill:stage.color.fill});
        stage.addObject(stage.newObj);
        
        stage.start_x = mx;
        stage.start_y = my;
        stage.state = 'drawing';
        
    //clear selection
    } else if (!stage.layer.getObjectUnderPoint({x:mx, y:my})) stage.trBox.unset();
    
}

//stage mouse move
Stage.prototype.stageMouseMove = function(e) {
    //console.log('stage mouseMove', stage.state);
    var mx = e.pageX - stage.layer.canvas.offsetLeft;
    var my = e.pageY - stage.layer.canvas.offsetTop;

    //rotation
    if (stage.state == 'rotating') {
        var trBox = stage.trBox;
        var c = trBox.getCenter();
        var a1 = trBox.rotatePoint.angleTo(c);
        var a2 = new Point(mx, my).angleTo(c);
        trBox.rotate(a2 - a1, c, true);
        
    //new rectangle
    } else if (stage.state == 'drawing') {
        var r = new Rectangle(new Point(stage.start_x, stage.start_y), new Point(mx, my));
        r.normalize();
        
        stage.newObj.shape.placeIntoRect(r);
        stage.layer.forceRedraw();
    }
}

//stage mouse up
Stage.prototype.stageMouseUp = function(e) {
    //console.log('stage mouseUp', stage.state);
    
    //new rectangle
    if (stage.state == 'drawing') {
        stage.trBox.apply(stage.newObj);
        
    //rotation
    } else if (stage.state == 'rotating') stage.trBox.updateRects();

    stage.state = '';
}
