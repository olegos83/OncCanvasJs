/*
* Dom by OlegoS. Feb 16, 2012
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
* Dom class - to help working with DOM tree of the document.
* To simplify creation and modification of html elements.
* Also, it can work with events.
* 
* @class Dom
* @static
* @author OlegoS
*
* @constructor
* @param {Element} el - element or its id to work with. Can be empty for 
*                                 some functions.
**/
var Dom = function(el) {
    if (typeof(el) == 'string') Dom.el = document.getElementById(el); else Dom.el = el;
    return Dom;
}


//public methods:
    /**
     * Create new DOM element. To ommit params, use '' and default style would be set.
     * @method create
     * @static
     * @param {String} tag - HTML tag, for example 'div' or 'img'.
     * @param {String} id - element id.
     * @param {String} position - css position.
     * @param {Number} x - css left.
     * @param {Number} y - css top.
     * @param {Number} width - css width.
     * @param {Number} height - css height.
     * @param {String} display - css display.
     * @param {String} overflow - css overflow.
     * @return {Element} created element.
     **/
    Dom.create = function(tag, id, position, x, y, width, height, display, overflow) {
        if (tag == "") return null;
        this.el = document.createElement(tag);
        
        if (id) this.attr('id', id);
        if (position) this.css('position', position);
        
        if ( (x != null) || (x != '') ) this.css('left', x + 'px');
        if ( (y != null) || (y != '') ) this.css('top', y + 'px');
        
        if ( (width != null) || (width != '') ) this.css('width', width + 'px');
        if ( (height != null) || (height != '') ) this.css('height', height + 'px');
        
        if (display) this.css('display', display);
        if (overflow) this.css('overflow', overflow);
        
        return this.el;
    }

    /**
     * Set DOM element CSS style.
     * @method css
     * @static
     * @param {String} style - css style.
     * @param {String} value - value to set.
     * @return {Dom} this - can be chained.
     **/
    Dom.css = function(style, value) {
    	this.el.style[style] = value;
        return this;
    }
    
    /**
     * Set DOM element attribute.
     * @method attr
     * @static
     * @param {String} attr - html attribute.
     * @param {String} value - value to set.
     * @return {Dom} this - can be chained.
     **/
    Dom.attr = function(attr, value) {
    	this.el.setAttribute(attr, value);
        return this;
    }
    
    /**
     * Set DOM element attribute.
     * @method prop
     * @static
     * @param {String} prop - element property.
     * @param {String} value - value to set.
     * @return {Dom} this - can be chained.
     **/
    Dom.prop = function(prop, value) {
    	this.el[prop] = value;
        return this;
    }
    
    /**
     * Place DOM element to specified position.
     * @method placeTo
     * @static
     * @param {Point} pos - position.
     * @return {Dom} this - can be chained.
     **/
    Dom.placeTo = function(pos) {
    	this.css('left', pos.x + 'px').css('top', pos.y + 'px');
        return this;
    }
    
    /**
     * Add event listener to DOM element.
     * @method addEvent
     * @static
     * @param {String} eventName - name of event.
     * @param {Function} listener - event handler.
     * @return {Dom} this - can be chained.
     **/
    Dom.addEvent = function(eventName, listener) {
    	if (this.el.addEventListener) this.el.addEventListener(eventName, listener, false);
    	else if (this.el.attachEvent) this.el.attachEvent("on" + eventName, listener);
    	return this;
    }
    
    /**
     * Remove event listener to DOM element.
     * @method removeEvent
     * @static
     * @param {String} eventName - name of event.
     * @param {Function} listener - event handler.
     * @return {Dom} this - can be chained.
     **/
    Dom.removeEvent = function(eventName, listener) {
    	if (this.el.removeEventListener) this.el.removeEventListener(eventName, listener, false);
    	else if (this.el.detachEvent) this.el.detachEvent("on" + eventName, listener);
    	return this;
    }
    
    /**
     * Cancel default browser handler of event. Also it cancels event bubbling.
     * @method cancelEvent
     * @static
     * @param {Event} e - event.
     * @return {Boolean} always false for browser.
     **/
    Dom.cancelEvent = function(e) {
    	e = e ? e : window.event;
    	if (e.stopPropagation) e.stopPropagation();
    	if (e.preventDefault) e.preventDefault();
    	e.cancelBubble = true;
    	e.cancel = true;
    	e.returnValue = false;
    	return false;
    }
    
    /**
     * Get target element from event.
     * @method getEventTarget
     * @static
     * @param {Event} e - event.
     * @return {Element} e.target or e.srcElement for IE.
     **/
     Dom.getEventTarget = function(e) {
    	e = e ? e : window.event;
    	return e.target ? e.target : e.srcElement;
     }
     