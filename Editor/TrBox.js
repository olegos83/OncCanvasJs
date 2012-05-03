/* 
 * Editor transformer class for transforming objects
 */
//UNIVERSAL EDITABLE OBJECT
var TrBox = function() {
	//init vars
	this.selected = null;
	
    //init points, rects and objects
    this.init();
    
    //place objects
    this.placeObjects();
    
    //init transform events
    this.initEvents();
}

//init transform points and shapes
TrBox.prototype.init = function() {
    //colors
    var c = {stroke:"", fill:"gray"};
    var c2 = {stroke:"", fill:"#000000"};
    
    //rotation point
    this.rotationPoint = null;
    
    //shapes
    for (var i = 1; i <= 8; i++) {
        //transform points
        this['p' + i] = new Point(-10, -10);
        
        //scale and rotation objects
        this['ro' + i] = new TrPoint(this['p' + i], 6, c);
        this['so' + i] = new TrPoint(this['p' + i], 3, c2);
    }
}

//init transform control events
TrBox.prototype.initEvents = function() {
    var box = this;
    var lastPos = {h:'L', v:'U'};

    //make scale objects draggable and init rotate events for rotation objects
    for (var i = 1; i <= 8; i++) {
        this['so' + i].startDrag();
        this['so' + i].addEventListener(MouseEvent.DRAGEND, function(e) {
            lastPos.h = 'L';lastPos.v = 'U';
            box.updateRects();
        });
        
        if (i <= 4) this['ro' + i].addEventListener(MouseEvent.DOWN, function(e) {
                box.rotationPoint = e.target._pos;
                stage.state = 'rotating';
        });
    }
    
    //init scale points events
    this.so1.addEventListener(MouseEvent.DRAG, function(e) {
        box.p1.x = box.p4.x = box.p8.x = e.pos.x;
        box.p1.y = box.p2.y = box.p5.y = e.pos.y;
        scale();
    });

    this.so2.addEventListener(MouseEvent.DRAG, function(e) {
        box.p2.x = box.p3.x = box.p6.x = e.pos.x;
        box.p2.y = box.p1.y = box.p5.y = e.pos.y;
        scale();
    });

    this.so3.addEventListener(MouseEvent.DRAG, function(e) {
        box.p3.x = box.p2.x = box.p6.x = e.pos.x;
        box.p3.y = box.p4.y = box.p7.y = e.pos.y;
        scale();
    });

    this.so4.addEventListener(MouseEvent.DRAG, function(e) {
        box.p4.x = box.p1.x = box.p8.x = e.pos.x;
        box.p4.y = box.p3.y = box.p7.y = e.pos.y;
        scale();
    });
    
    //set middle scale points events
    this.so5.addEventListener(MouseEvent.DRAG, function(e) {
        box.p1.y = box.p2.y = box.p5.y = e.pos.y;
        scale();
    });
    
    this.so6.addEventListener(MouseEvent.DRAG, function(e) {
    	box.p3.x = box.p2.x = box.p6.x = e.pos.x;
        scale();
    });
    
    this.so7.addEventListener(MouseEvent.DRAG, function(e) {
    	box.p4.y = box.p3.y = box.p7.y = e.pos.y;
        scale();
    });
    
    this.so8.addEventListener(MouseEvent.DRAG, function(e) {
    	box.p4.x = box.p1.x = box.p8.x = e.pos.x;
        scale();
    });
    
    //middle points correction
    function setMidPoints() {
    	var c = box.getCenter();
        box.p5.x = box.p7.x = c.x;
        box.p6.y = box.p8.y = c.y;
    }
    
    //scale obj functions
    function checkPointsPos() {
        var fr = box.p1;
        var to = box.p3;
        var pos = {h:'', v:''};
        var posChange = {h:false, v:false};
        
        if (fr.isLeftTo(to)) pos.h = 'L';
        if (fr.isRightTo(to)) pos.h = 'R';
        if ( (pos.h != '') && (pos.h != lastPos.h) ) {
            lastPos.h = pos.h;
            posChange.h = true;
        }

        if (fr.isUpTo(to)) pos.v = 'U';
        if (fr.isDownTo(to)) pos.v = 'D';
        if  ( (pos.v != '') && (pos.v != lastPos.v) ) {
            lastPos.v = pos.v;
            posChange.v = true;
        }
        
        return posChange;
    }
    
    function scale() {
    	//set middle transform points position
    	setMidPoints();
    	
        //init vars
        var s = stage.trBox.selected;
        
        //mirror shape if needed
        var pos = checkPointsPos();
        if (pos.h) s.mirror('horiz');
        if (pos.v) s.mirror('vert');
        
        //place into rect
        var p = new Polygon([box.p1, box.p2, box.p3, box.p4]);
        var tR = p.getBoundRect();
        
        s.placeIntoRect(tR);
    }
}

//apply to object
TrBox.prototype.apply = function(obj, dragStartPos) {
    //unset box
    this.unset();
    
    //setup selection
    this.selected = obj;
    var box = stage.trBox;
    
    obj.startDrag(); 
    if (dragStartPos) Draggable.onmousedown({pos:dragStartPos, target:obj});
    obj.addEventListener(MouseEvent.DRAG, function(e) {
        box.updateRects();
    });
    
    //update box
    this.updateRects();
    this.placeObjects();
}

//setup transform rects
TrBox.prototype.updateRects = function() {
    //init vars
    var box = stage.trBox;
    var r = box.selected.getBoundRect();
    var c = r.getCenter();
    
    //setup points
    box.p1.x = box.p4.x = box.p8.x = r.from.x;
    box.p1.y = box.p2.y = box.p5.y = r.from.y;
    box.p3.x = box.p2.x = box.p6.x = r.to.x;
    box.p3.y = box.p4.y = box.p7.y = r.to.y;
    box.p5.x = box.p7.x = c.x;
    box.p6.y = box.p8.y = c.y;
    
    //redraw
    stage.layer.forceRedraw();
}

//place transform controls
TrBox.prototype.placeObjects = function() {
    this.removeObjects();
    
    var layer = stage.layer;
    for (var i = 1; i <= 8; i++) {
        layer.addObject(this['ro' + i]);
        layer.addObject(this['so' + i]);
    }
}

//remove transform controls
TrBox.prototype.removeObjects = function() {
    var layer = stage.layer;
    for (var i = 1; i <= 8; i++) {
        layer.removeObject(this['ro' + i]);
        layer.removeObject(this['so' + i]);
    }
}

//unset box
TrBox.prototype.unset = function() {
    //clear selection
    if (stage.trBox.selected) {
    	stage.trBox.selected.stopDrag();
    	stage.trBox.selected.removeEventListener(MouseEvent.DRAG);
    }
    
    stage.trBox.selected = null;
    this.removeObjects();
}

//get center of transform box
TrBox.prototype.getCenter = function() {
    var r = new Rectangle(this.p1, this.p3);
    return r.getCenter();
}

//rotate
TrBox.prototype.rotate = function(angle, pivot, rotateObj) {
    if (!stage.trBox.selected) return;

    //rotate box
    var box = this;
    for (var i = 1; i <= 8; i++) box['p' + i].rotate(angle, pivot);
    
    //rotate object if rotateObj is true
    if (rotateObj) stage.trBox.selected.rotate(angle, pivot);
    
    //redraw layer
    stage.layer.forceRedraw();
}

//scale
TrBox.prototype.scale = function(scx, scy, pivot) {
    if (!stage.trBox.selected) return;
    stage.trBox.selected.scale(scx, scy, pivot);
    this.updateRects();
}

//align
TrBox.prototype.align = function(base) {
    if (!stage.trBox.selected) return;
    var r = new Rectangle(new Point(0, 0), new Point(stage.stageWidth, stage.stageHeight));
    stage.trBox.selected.align(base, r);
    this.updateRects();
}

//mirror
TrBox.prototype.mirror = function(base) {
    if (!stage.trBox.selected) return;
    stage.trBox.selected.mirror(base);
    this.updateRects();
}


//TRANSFORM POINT. It is a rectangle, placed around center position.
var TrPoint = function(pos, rad, color) {
    //Point position.
    this._pos = pos;
    
    //Point radius.
    this._radius = rad;
    
	//initialize base class
    Shaper.call(this, '', new Rectangle(), color);
}

//extend from Shaper, set constructor and delete unused properties
TrPoint.prototype = new Shaper();
for (var p in TrPoint.prototype) if (TrPoint.prototype.hasOwnProperty(p)) delete TrPoint.prototype[p];
TrPoint.prototype.constructor = TrPoint;

//TrPoint methods
//move TrPoint
TrPoint.prototype.move = function(dx, dy) {
	this._pos.move(dx, dy);
}

//Test if point is on TrPoint.
TrPoint.prototype.hasPoint = function(p) {
    //if can't be drawn return
    if (!this.layer) return;
    if (!this.visible) return;
    
    //setup path and test point
    this.shape.placeAroundPoint(this._pos, this._radius);
    this.layer.drawShape("", "", this.shape.clone());
    var result = this.layer.ctx.isPointInPath(p.x, p.y);
    return result;
}

//Draw function
TrPoint.prototype.draw = function() {
    //if can't be drawn return
    if (!this.layer) return;
    if (!this.visible) return;
    
    //draw shape
    this.shape.placeAroundPoint(this._pos, this._radius);
    this.layer.drawShape(this.color.stroke, this.color.fill, this.shape.clone());
}

//Clone function
TrPoint.prototype.clone = function() {
	return false;
}
