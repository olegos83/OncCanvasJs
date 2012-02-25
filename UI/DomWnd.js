/*
* DomWnd by OlegoS. Feb 6, 2012
*
* Copyright (c) 2012 OlegoS
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/**
* OncCanvasJs is a framework to work with html5 canvas. It can be used to write
* games or any other web-applications, which use canvas graphics.
* @module OncCanvasJs
**/


/**
* DomWnd class - Window implemented by divs. Can be used to construct interface.
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
	var body = document.getElementsByTagName("body")[0];
	
//DO NOT USE PRIVATE PROPERTIES DIRECTLY - RESULT IS UNPREDICTABLE
//private properties:
    /**
    * Window container.
    * @property _wnd
    * @type Elem
    * @private
    **/
	this._wnd = Dom().create('div', title, 'absolute', x, y, width, height + 20);
	Dom(this._wnd).css('border', '1px solid');
	body.appendChild(this._wnd);

    /**
    * Window title bar.
    * @property _title
    * @type Elem
    * @private
    **/
	this._title = Dom().create('div', '', '', 0, 0, width, 20, 'block');
	Dom(this._title).css('backgroundColor', '#cccccc');
	this._wnd.appendChild(this._title);
    
    /**
    * Window title text.
    * @property _titleText
    * @type Elem
    * @private
    **/
    this._titleText = Dom().create('span');
    Dom(this._titleText).prop('innerHTML', title).css('marginLeft', '4px');
    this._title.appendChild(this._titleText);
   
    /**
    * Window close button.
    * @property _closeBtn
    * @type Elem
    * @private
    **/
    this._closeBtn = Dom().create('img', '', 'relative', width - this._titleText.offsetWidth - 23, 2, 15, 15);
    Dom(this._closeBtn).attr("src", "UI/close_btn.png");
    this._title.appendChild(this._closeBtn);
    
    this._closeBtn.addEventListener("click", function(e) {
        self.close();
    }, false);

    /**
    * Window body - all controls are added here.
    * @property _body
    * @type Elem
    * @private
    **/
    this._body = Dom().create('div', '', 'absolute', 0, 20, width, parseInt(this._wnd.style.height) - 20, 'block');
    Dom(this._body).css('backgroundColor', '#eeeeee');
    this._wnd.appendChild(this._body);
    
    //set drag and drop handlers
    var startX = 0;
    var startY = 0;
    
    //title mouse down handler
    function onMouseDown(e) {
        e.preventDefault();
        
        startX = e.clientX - parseInt(self._wnd.style.left);
        startY = e.clientY - parseInt(self._wnd.style.top);
        
        document.addEventListener("mousemove", onMouseMove, false);
        document.addEventListener("mouseup", onMouseUp, false);
    }
    
    //document mousemove handler
    function onMouseMove(e) {
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        
        self.setPosition({x:dx, y:dy});
    }
    
    //document mouseup handler
    function onMouseUp(e) {
        document.removeEventListener("mousemove", onMouseMove, false);
        document.removeEventListener("mouseup", onMouseUp, false);
    }
    
    //now turn drag on
    this._title.addEventListener("mousedown", onMouseDown, false);
}


//public methods:
    /**
     * Set window position.
     * @method setPosition
     * @param {Point} pos - position of the window.
     **/
    DomWnd.prototype.setPosition = function(pos) {
    	Dom(this._wnd).css('left', pos.x + 'px').css('top', pos.y + 'px');
    }

    /**
     * Get window position.
     * @method getPosition
     * @return {Point} - position of the window.
     **/
    DomWnd.prototype.getPosition = function() {
        return new Point(parseInt(this._wnd.style.left), parseInt(this._wnd.style.top));
    }
    
    /**
     * Get window width.
     * @method getWidth
     * @return {Number} - width of the window.
     **/
    DomWnd.prototype.getWidth = function() {
        return parseInt(this._wnd.style.width);
    }
    
    /**
     * Get window height.
     * @method getHeight
     * @return {Number} - height of the window.
     **/
    DomWnd.prototype.getHeight = function() {
        return parseInt(this._body.style.height);
    }
    
    /**
     * Close window - remove it from body. 
     * When node is removed - all its children are removed to - W3C spec.
     * @method close
     **/
    DomWnd.prototype.close = function() {
        var body = document.getElementsByTagName("body")[0];
        body.removeChild(this._wnd);
    }

    /**
     * Add control to window.
     * @method addControl
     * @param {Elem} elem - control to add.
     **/
    DomWnd.prototype.addControl = function(elem) {
        this._body.appendChild(elem);
    }
    
    /**
     * Remove control from window.
     * @method removeControl
     * @param {Elem} elem - control to remove.
     **/
    DomWnd.prototype.removeControl = function(elem) {
        this._body.removeChild(elem);
    }
    
    /**
     * Clear window. Remove all controls from its body.
     * @method clear
     **/
    DomWnd.prototype.clear = function() {
        //get body children
        var children = this._body.childNodes;
        var len = children.length;
        
        //remove them
        for (var i = 0; i < len; i++) this.removeControl(children[i]);
    }
    
    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of this object.
     **/
    DomWnd.prototype.toString = function() {
        return "[Domwnd(id:" + this._wnd.id + ")]";
    }
    