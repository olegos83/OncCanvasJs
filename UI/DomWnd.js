/*
* DomWnd by OlegoS. Feb 6, 2012
*
* Copyright (c) 2012 OlegoS
*
* See license information in readme file.
*/

/**
* OncCanvasJs is a framework to work with html5 canvas. It can be used to write
* games or any other web-applications, which use canvas graphics.
* @module OncCanvasJs
**/


/**
* Window implemented by divs. Can be used to construct interface.
* Windows are always added as childs to body element in DOM tree.
* You can add controls to window, controls are html elements, added to window body.
*
* @class DomWnd
* @author OlegoS
*
* @constructor
* @param {String} title - window title.
* @param {Number} x - window X position.
* @param {Number} y - window Y position.
* @param {Number} width - window width.
* @param {Number} height - window height.
**/
var DomWnd = function(title, x, y, width, height) {
	//init vars
	var self = this;
	
//DO NOT USE PRIVATE PROPERTIES DIRECTLY - RESULT IS UNPREDICTABLE
//private properties:
    /**
    * Window container.
    * @property _wnd
    * @type Element
    * @private
    **/
	this._wnd = Dom.create('div', title, 'absolute', x, y, width, height + 20);
	Dom(this._wnd).css('border', '1px solid').addTo(document.body);

    /**
    * Window title bar.
    * @property _title
    * @type Element
    * @private
    **/
	this._title = Dom.create('div', '', '', 0, 0, width, 20, 'block');
	Dom(this._title).css('backgroundColor', '#cccccc').addTo(this._wnd);
    
    /**
    * Window title text.
    * @property _titleText
    * @type Element
    * @private
    **/
    this._titleText = Dom.create('span');
    Dom(this._titleText).prop('innerHTML', title).css({marginLeft: '4px', cursor: 'default'}).addTo(this._title);
   
    /**
    * Window close button.
    * @property _closeBtn
    * @type Element
    * @private
    **/
    this._closeBtn = Dom.create('img', '', 'relative', width - this._titleText.offsetWidth - 23, 2, 15, 15);
    Dom(this._closeBtn).attr("src", "UI/close_btn.png").addEvent(MouseEvent.DOWN, function(e) {
        self.close();
    }).addTo(this._title);

    /**
    * Window body - all controls are added here.
    * @property _body
    * @type Element
    * @private
    **/
    this._body = Dom.create('div', '', 'absolute', 0, 20, width, parseInt(this._wnd.style.height) - 20, 'block');
    Dom(this._body).css('backgroundColor', '#eeeeee').addTo(this._wnd);
    
    //set drag and drop handlers
    var pos = null;
    
    //title mouse down handler
    function onMouseDown(e) {
    	pos = Dom.getEventMousePos(e);
    	Dom(document).addEvent(MouseEvent.MOVE, onMouseMove).addEvent(MouseEvent.UP, onMouseUp);
        return Dom.cancelEvent(e);
    }
    
    //document mousemove handler
    function onMouseMove(e) {
        var dx = e.pageX - pos.x;
        var dy = e.pageY - pos.y;
        self.pos({x:dx, y:dy});
    }
    
    //document mouseup handler
    function onMouseUp(e) {
    	Dom(document).removeEvent(MouseEvent.MOVE, onMouseMove).removeEvent(MouseEvent.UP, onMouseUp);
    }
    
    //now turn drag on
    Dom(this._title).addEvent(MouseEvent.DOWN, onMouseDown);
}


//public methods:
    /**
     * Get/Set window position.
     * @method pos
     * @param {Point} pos - position of the window.
     * @return {Point} if no pos passed - return current position.
     **/
    DomWnd.prototype.pos = function(pos) {
    	if (pos) Dom(this._wnd).pos(pos); else return Dom(this._wnd).pos();
    }

    /**
     * Get window width.
     * @method getWidth
     * @return {Number} - window width.
     **/
    DomWnd.prototype.getWidth = function() {
        return Dom(this._body).width();
    }
    
    /**
     * Get window height.
     * @method getHeight
     * @return {Number} - window height.
     **/
    DomWnd.prototype.getHeight = function() {
    	return Dom(this._body).height();
    }
    
    /**
     * Close window - remove it from body. 
     * When node is removed - all its children are removed to - W3C spec.
     * @method close
     **/
    DomWnd.prototype.close = function() {
    	try { Dom(document.body).remove(this._wnd); } catch (err) { }
    }

    /**
     * Add control to window.
     * @method addControl
     * @param {Element} elem - control to add.
     **/
    DomWnd.prototype.addControl = function(elem) {
    	Dom(this._body).add(elem);
    }
    
    /**
     * Remove control from window.
     * @method removeControl
     * @param {Element} elem - control to remove.
     **/
    DomWnd.prototype.removeControl = function(elem) {
    	try { Dom(this._body).remove(elem); } catch (err) { }
    }
    
    /**
     * Clear window. Remove all controls from its body.
     * @method clear
     **/
    DomWnd.prototype.clear = function() {
        var bd = this._body;
        while (bd.firstChild) Dom(bd).remove(bd.firstChild);
    }
    
    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of this object.
     **/
    DomWnd.prototype.toString = function() {
        return "[Domwnd(id:" + this._wnd.id + ")]";
    }
    