/*
* CtxOptions by OlegoS. Feb 4, 2012
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
* CtxOptions is a set of classes-helpers to set drawing options of HTML5 canvas context.
* In these helpers there are defined string constants for canvas context options.
**/


//canvas context options helpers:
    /**
     * Options for globalCompositeOperation
     **/
    var Composite = {
        SOURCE_ATOP:'source-atop',
        SOURCE_IN:'source-in',
        SOURCE_OUT:'source-out',
        SOURCE_OVER:'source-over',
        DESTINATION_ATOP:'destination-atop',
        DESTINATION_IN:'destination-in',
        DESTINATION_OUT:'destination-out',
        DESTINATION_OVER:'destination-over',
        LIGHTER:'lighter',
        COPY:'copy',
        XOR:'xor'
    };

    /**
     * Options for lineCap
     **/
   var LineCap = {
        BUTT:'butt',
        ROUND:'round',
        SQUARE:'square'
   };

    /**
     * Options for lineJoin
     **/
    var LineJoin = {
        BEVEL:'bevel',
        ROUND:'round',
        MITER:'miter'
    };
    
    /**
     * Options for textAlign
     **/
    var TextAlign = {
        START:'start',
        END:'end',
        LEFT:'left',
        RIGHT:'right',
        CENTER:'center'
    };
    
    /**
     * Options for textBaseline
     **/
    var TextBaseline = {
        TOP:'top',
        HANGING:'hanging',
        MIDDLE:'middle',
        ALPHABETIC:'alphabetic',
        IDEOGRAPHIC:'ideographic',
        BOTTOM:'bottom'
    };
