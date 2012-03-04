//TOOLBAR
//show clipart window
function onUpPanelClick(event) {
	var id = event.target.id;
	//console.log(id);

    //clipart chooser
	if (id == 'clipart') ClipChooser();
	
	//background chooser
	if (id == 'background') BgrChooser();
}

//create new arrow
function createArrow() {
    var pArr = [new Point(0, 1), new Point(1, 1), new Point(1, 0),
                new Point(2, 2),
                new Point(1, 4), new Point(1, 3), new Point(0, 3)];
    
    return new Polygon(pArr);
}

//tool clicked
function onToolClick(event) {
    var id = event.target.id;
    var box = stage.trBox;
    var layer = stage.layer;
    var obj = box.selected;

    //drawing tools
    if (id == 'clear_tool') stage.clear();
    if (id == 'rect_tool') {box.unset();stage.state = 'newRect';}
    if (id == 'arrow_tool') {box.unset();stage.state = 'newArrow';}
    
    //color set tools
    if (id == 'stroke_tool') ColorChooser(0);
    if (id == 'fill_tool') ColorChooser(1);
    
    //align tools
    if (id == 'align_left_tool') box.align('left');
    if (id == 'align_top_tool') box.align('top');
    if (id == 'align_center_tool') box.align('center');
    if (id == 'align_vert_tool') box.align('vert');
    if (id == 'align_right_tool') box.align('right');
    if (id == 'align_bottom_tool') box.align('bottom');

    //mirror tools
    if (id == 'mirror_horiz_tool') box.mirror('horiz');
    if (id == 'mirror_vert_tool') box.mirror('vert');

    //scale tools
    if (id == 'size_plus_tool') box.scale(1.1, 1.1, box.getCenter());
    if (id == 'size_minus_tool') box.scale(0.9, 0.9, box.getCenter());

    //rotate tools
    if (obj && (id == 'rotate_left_tool') ) {
        box.rotate(-0.1, box.getCenter(), true);
        box.updateRects();
    }
    
    if (obj && (id == 'rotate_right_tool') ) {
        box.rotate(0.1, box.getCenter(), true);
        box.updateRects();
    }

    //delete tool
    if (obj && (id == 'delete_tool') ) {
        stage.removeObject(obj);
        box.unset();
    }

    //copy tool
    if (obj && (id == 'copy_tool') ) {
        var obj_copy = obj.clone();
        stage.addObject(obj_copy);
        obj_copy.move(20, 20);
        box.apply(obj_copy);
    }

    //zoom tools
    var len = layer.getNumObjects();
    var c = layer.getCenter();
    var o = null;var i;
    
    if (id == 'zoom_add_tool') {
        for (i = 0; i < len; i++) {
            o = layer.getObjectAt(i);
            
            if (o.zoom != null) {
                o.scale(1.1, 1.1, c);
                o.zoom++;
            }
        }

        if (obj) box.updateRects(); else layer.forceRedraw();
    }
    
    if (id == 'zoom_reset_tool') {
        for (i = 0; i < len; i++) {
            o = layer.getObjectAt(i);
            
            if (o.zoom != null) {
                for (var j = 0; j < o.zoom; j++) o.scale(0.9, 0.9, c);
                o.zoom = 0;
            }
        }

        if (obj) box.updateRects(); else layer.forceRedraw();
    }
    
    //layer up/down tools
    var index;
    
    if (obj && (id == 'layer_down_tool') ) {
        index = layer.getObjectIndex(obj);
        if (index > 0) layer.setObjectIndex(obj, index - 1);
    }
    
    if (obj && (id == 'layer_up_tool') ) {
        var l = layer.getNumObjects() - 1;
        index = layer.getObjectIndex(obj);
        if (index < l) layer.setObjectIndex(obj, index + 1);
    }
}
