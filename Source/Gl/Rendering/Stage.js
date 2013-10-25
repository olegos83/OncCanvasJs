/**
 * @file Stage implementation.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Rectangle is very important in geometry and rendering calculations.
 * 
 * @class Stage
 * @memberof WebbyJs
 */
WebbyJs.createClass({
	/**
	 * Class name.
	 */
	name: 'Stage',
	
	/**
	 * @constructor
	 * 
	 * @param {Point} from - up left point. Default is Point(0, 0).
	 * @param {Point} to - bottom right point. Default is Point(0, 0).
	 */
	construct: function Stage(from, to) {
		/**
	     * Up left point of rectangle.
	     * 
	     * @memberof Stage
	     * @type {Point}
	     */
		this.from = from || new WebbyJs.Point();
	},
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Check intersection between this and target bounding rectangle.
		 * 
		 * @method intersectBounds
		 * @memberof Stage.prototype
		 * 
		 * @param {Rectangle} target - target to test.
		 * 
		 * @returns {Stage} current instance for chaining.
		 */
		intersectBounds: function(target) {
		    return this;
		}
	},
	
	/**
	 * Interfaces.
	 */
	interfaces: WebbyJs.Geom
});



//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	//implement draggable objects
	var obj, dragged, sx, sy, s_drag = MouseEvent.DRAGSTART, do_drag = MouseEvent.DRAG, e_drag = MouseEvent.DRAGEND;
	
	function dragStart(e) {
    	sx = e.x; sy = e.y;
        obj = e.target;
        e.propagation = false;
    }

    function dragGo(mx, my) {
        if (obj) {
        	if ( !dragged && (mx != sx || my != sy) ) {
            	dragged = true;
            	obj.processEvent({ x: sx, y: sy, target: obj, type: s_drag });
            }
            
            var dx = mx - sx, dy = my - sy;
            sx = mx; sy = my;

            obj.move(dx, dy); obj.layer.redraw();
            obj.processEvent({ x: mx, y: my, dx: dx, dy: dy, target: obj, type: do_drag });
        }
    }

    function dragEnd(mx, my) {
        if (obj) {
        	obj.processEvent({ x: mx, y: my, target: obj, type: e_drag });
            obj = dragged = null;
        }
    }
	
	//layer management handlers
	function onLayerAdd(e) {
		var item = e.item;
		
		if (item.stage) item.stage.remove(item);
		item.stage = this;
		
		var cv = item.canvas, cvs = cv.style, cvd = this.canvasDiv; 
		
		cv.width = cvd.clientWidth; cv.height = cvd.clientHeight;
		cvs.position = 'absolute'; cvs.top = cvs.left = '0';
		
		var i = e.index, next = null;
		
		if (i == null) cvd.appendChild(cv); else {
			i = this.data[i];
			if (i) next = i.canvas;
			if (next) cvd.insertBefore(cv, next); else cvd.appendChild(cv);
		}
	}
	
	function onLayerRemove(e) {
		e.item.stage = null;
		this.canvasDiv.removeChild(e.item.canvas);
	}
	
	function onClear(e) {
		this.canvasDiv.innerHTML = '';
	}
	
	function onChange(e) {
		var next = this.data[e.newIndex + 1];
		if (next) this.canvasDiv.insertBefore(e.item.canvas, next.canvas); else this.canvasDiv.appendChild(e.item.canvas);
	}
	
	
//CONSTRUCTOR
	/**
	 * Stage can contain many layers and it processes events in them by
	 * catching event on a special div element. Inherited from DataProvider, so it is data driven.
	 * 
	 * You must assign Stage to any html element, configured as you need.
	 * All layer's canvases will be added to it and they will have same size and position.
	 * 
	 * @class Stage
	 * @super DataProvider
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {String} id - stage id.
	 * @param {Element} parent - DOM element to assign Stage.
	 */
	var Stage = function(id, parent) {
		//initialize base class
		DataProvider.call(this);
		
		/**
	     * Stage id.
	     * 
	     * @property id
 	     * @type String
	     */
	    this.id = (id == null ? '' : id);
		
		/**
	     * DOM element, Stage attached to.
	     * 
	     * @property parent
	     * @type Element
	     */
	    this.parent = null;
	    
	    /**
	     * Canvases container div element.
	     * 
	     * @property canvasDiv
	     * @type Element
	     */
	    this.canvasDiv = document.createElement('div');
	    
	    /**
	     * Event processing div element.
	     * 
	     * @property eventDiv
	     * @type Element
	     */
	    this.eventDiv = document.createElement('div');
	    
	    //start events processing
	    var self = this, ed = self.eventDiv, cvd = self.canvasDiv, m_move = MouseEvent.MOVE, m_up = MouseEvent.UP, m_out = MouseEvent.OUT;
	    
	    var handler = function(e) {
	    	//init vars
	    	var layers = self.data, lim = null, e_type = e.type, mx = e.pageX - ed._ox, my = e.pageY - ed._oy,
	    		evt = { x: mx, y: my, target: null, type: e_type, propagation: true };
	    	
	    	//process draggable
	    	if (e_type == m_move) { dragGo(mx, my); lim = 1; }
	    	if (e_type == m_up || e_type == m_out) dragEnd(mx, my);
	    	
	    	//process event across layers
	    	for (var j = layers.length - 1; j >= 0; j--) {
	    		var objs = layers[j].getObjectsUnderPoint({ x: mx, y: my }, lim);

	        	for (var i = 0, l = objs.length; i < l; i++) {
	        		evt.target = objs[i];
	        		objs[i].processEvent(evt);
	        		if (!evt.propagation) break;
	            }
	        	
	        	if ( (lim && l > 0) || !evt.propagation ) break;
	    	}
	    	
	    	//process event for stage
	    	if (evt.propagation) { evt.target = self; self.processEvent(evt); }
	    }
	    
	    //setup main event handler for layer inner events
	    var evtDiv = (_BROWSER_ == 'ie' ? cvd : ed),
	    	evtTypes = [MouseEvent.DOWN, MouseEvent.MOVE, MouseEvent.UP, MouseEvent.CLICK, MouseEvent.DBLCLICK];
	    
	    for (var i = 0; i < evtTypes.length; i++) evtDiv.addEventListener(evtTypes[i], handler);
	    
	    //init stage
	    this.addEventListener(DataEvent.ADD, onLayerAdd);
	    this.addEventListener(DataEvent.REMOVE, onLayerRemove);
	    
	    this.addEventListener(DataEvent.CLEAR, onClear);
	    this.addEventListener(DataEvent.CHANGE, onChange);
	    
	    if (parent) this.attach(parent);
	}

	//extend from DataProvider
	inheritProto(Stage, DataProvider);
	
	
//STATIC
	Stage.dragStart = dragStart;
	
	
//PROTOTYPE
	//get prototype reference
	var p = Stage.prototype;
	
	/**
	 * Attach Stage to DOM element.
	 * 
	 * @method attach
	 * @param {Element} parent - element.
	 */
	p.attach = function(parent) {
		this.detach(); this.parent = parent;
		
		var layers = this.data, w = parent.clientWidth, h = parent.clientHeight,
			ed = this.eventDiv, cvd = this.canvasDiv, cvs, cv;
		
		cvs = cvd.style; cvs.position = 'absolute'; cvs.top = cvs.left = '0'; cvs.width = w + 'px'; cvs.height = h + 'px';
		parent.appendChild(cvd);
		
	    for (var i = 0, l = layers.length; i < l; i++) {
	    	cv = layers[i].canvas; cvs = cv.style;
	    	cv.width = w; cv.height = h; cvs.position = 'absolute'; cvs.top = cvs.left = '0';
	    }
	    
	    cvs = ed.style; cvs.position = 'absolute'; cvs.top = cvs.left = '0'; cvs.width = w + 'px'; cvs.height = h + 'px';
	    parent.appendChild(ed);
	    
	    var bb = ed.getBoundingClientRect(), body = document.body;
	    
	    ed._ox = Math.round(bb.left + window.pageXOffset - body.clientLeft);
	    ed._oy = Math.round(bb.top + window.pageYOffset - body.clientTop);
	}
	
	/**
	 * Detach Stage from DOM element.
	 * 
	 * @method detach
	 */
	p.detach = function() {
	    if (this.parent) {
	    	this.parent.innerHTML = '';
		    this.parent = null;
	    }
	}
	
	/**
	 * Invalidate Stage parameters.
	 * 
	 * @method invalidate
	 */
	p.invalidate = function() {
		var ed = this.eventDiv, bb = ed.getBoundingClientRect(), body = document.body;
		
	    ed._ox = Math.round(bb.left + window.pageXOffset - body.clientLeft);
	    ed._oy = Math.round(bb.top + window.pageYOffset - body.clientTop);
	}
	
	/**
	 * Clone this Stage.
	 * 
	 * @method clone
	 * 
	 * @returns {Stage} a cloned Stage.
	 */
	p.clone = function() {
	    //need to implement
	}
	
	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @returns {String} a string representation of this object.
	 */
	p.toString = function() {
	    return "[Stage(" + this.data + ")]";
	}
	
	//set up for global use
	window.Stage = Stage;
}() );
