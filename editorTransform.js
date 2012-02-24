/* 
 * Editor transformer class for transforming objects
 */
//UNIVERSAL EDITABLE OBJECT
var EditTransform = function() {
    //init points, rects and objects
    this.init();
    
    //place objects
    this.placeObjects();
    
    //init transform events
    this.initEvents();
}

//init transform points and shapes
EditTransform.prototype.init = function() {
    //colors
    var c = {stroke:"", fill:"gray"};
    var c2 = {stroke:"", fill:"#000000"};
    
    //rotation point
    this.rotatePoint = null;
    
    //shapes
    for (var i = 1; i <= 4; i++) {
        //transform points
        this['p' + i] = new Point();
        
        //scale and rotation objects
        this['ro' + i] = new Shaper('ro' + i, new Rectangle(), c);
        this['so' + i] = new Shaper('so' + i, new Rectangle(), c2);
    }
}

//init transform control events
EditTransform.prototype.initEvents = function() {
    var box = this;
    var lastPos = {h:'L', v:'U'};

    //make scale objects draggable and init rotate events for rotation objects
    for (var i = 1; i <= 4; i++) {
        this['so' + i].draggable();
        this['so' + i].addEventListener(MouseEvent.DRAGEND, function(e) {
            lastPos.h = 'L';lastPos.v = 'U';
            box.updateRects();
        });
        
        this['ro' + i].addEventListener(MouseEvent.DOWN, function(e) {
                box.rotatePoint = box['p' + e.target.id.charAt(2)];
                stage.state = 'rotateObj';
        });
    }
    
    //init scale points events
    this.so1.addEventListener(MouseEvent.DRAG, function(e) {
        box.p1.x = box.p4.x = e.pos.x;
        box.p1.y = box.p2.y = e.pos.y;
        box.so1.matrix.reset();
        scaleObj();
    });

    this.so2.addEventListener(MouseEvent.DRAG, function(e) {
        box.p2.x = box.p3.x = e.pos.x;
        box.p2.y = box.p1.y = e.pos.y;
        box.so2.matrix.reset();
        scaleObj();
    });

    this.so3.addEventListener(MouseEvent.DRAG, function(e) {
        box.p3.x = box.p2.x = e.pos.x;
        box.p3.y = box.p4.y = e.pos.y;
        box.so3.matrix.reset();
        scaleObj();
    });

    this.so4.addEventListener(MouseEvent.DRAG, function(e) {
        box.p4.x = box.p1.x = e.pos.x;
        box.p4.y = box.p3.y = e.pos.y;
        box.so4.matrix.reset();
        scaleObj();
    });

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
    
    function scaleObj() {
        //init vars
        var s = stage.selectedObject; //.shape;
        
        //mirror shape if needed
        var pos = checkPointsPos();
        if (pos.h) s.mirror('horiz');
        if (pos.v) s.mirror('vert');
        
        //place into rect
        var p = new Polygon([box.p1, box.p2, box.p3, box.p4]);
        var tR = p.getBoundRect();
        
        s.placeIntoRect(tR);
        box.updateRectCenters();
    }
}

//apply to object
EditTransform.prototype.apply = function(obj) {
    //unset box
    this.unset();
    
    //setup selection
    stage.selectedObject = obj;
    var box = stage.transformBox;
    
    obj.addEventListener(MouseEvent.DRAG, function(e) {
        box.updateRects();
    });
    
    //update box
    this.updateRects();
    this.placeObjects();
}

//setup transform rects
EditTransform.prototype.updateRects = function() {
    //init vars
    var box = stage.transformBox;
    var r = stage.selectedObject.getBoundRect();
    
    //setup points
    box.p1.x = box.p4.x = r.from.x;
    box.p1.y = box.p2.y = r.from.y;
    box.p3.x = box.p2.x = r.to.x;
    box.p3.y = box.p4.y = r.to.y;
    
    //update rect centers
    box.updateRectCenters();
    
    //redraw
    stage.layer.forceRedraw();
}

//setup transform rect centers
EditTransform.prototype.updateRectCenters = function() {
    for (var i = 1; i <= 4; i++) {
        this['so' + i].shape.placeAroundPoint(this['p' + i], 3);
        this['ro' + i].shape.placeAroundPoint(this['p' + i], 6);
    }    
}

//place transform controls
EditTransform.prototype.placeObjects = function() {
    this.removeObjects();
    
    var layer = stage.layer;
    for (var i = 1; i <= 4; i++) {
        layer.addObject(this['ro' + i]);
        layer.addObject(this['so' + i]);
    }
}

//remove transform controls
EditTransform.prototype.removeObjects = function() {
    var layer = stage.layer;
    for (var i = 1; i <= 4; i++) {
        layer.removeObject(this['ro' + i]);
        layer.removeObject(this['so' + i]);
    }
}

//unset box
EditTransform.prototype.unset = function() {
    //clear selection
    if (stage.selectedObject) stage.selectedObject.removeEventListener(MouseEvent.DRAG);
    stage.selectedObject = null;
    this.removeObjects();
}

//get center of transform box
EditTransform.prototype.getCenter = function() {
    var r = new Rectangle(this.p1, this.p3);
    return r.getCenter();
}

//rotate
EditTransform.prototype.rotate = function(angle, pivot, rotateObj) {
    if (!stage.selectedObject) return;

    //rotate box
    var box = this;
    for (var i = 1; i <= 4; i++) box['p' + i].rotate(angle, pivot);
    box.updateRectCenters();
    
    //rotate object if rotateObj is true
    if (rotateObj) stage.selectedObject.rotate(angle, pivot);
    
    //redraw layer
    stage.layer.forceRedraw();
}

//scale
EditTransform.prototype.scale = function(scx, scy, pivot) {
    if (!stage.selectedObject) return;
    stage.selectedObject.scale(scx, scy, pivot);
    this.updateRects();
}

//align
EditTransform.prototype.align = function(base) {
    if (!stage.selectedObject) return;
    var r = new Rectangle(new Point(0, 0), new Point(stage.stageWidth, stage.stageHeight));
    stage.selectedObject.align(base, r);
    this.updateRects();
}

//mirror
EditTransform.prototype.mirror = function(base) {
    if (!stage.selectedObject) return;
    stage.selectedObject.mirror(base);
    this.updateRects();
}
